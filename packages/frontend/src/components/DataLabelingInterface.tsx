import { useState, useEffect } from "react";
import UserProfileDropdown from "@/components/UserProfileDropdown";
import { Play, Pause, Volume2, Mic, Heart, ChevronRight, MessageSquare, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getNextAudio, submitLabel, AudioResponse, LabelSubmission } from "@/services/api";
import logo from "../assets/carepanion-logo1.png";

interface DataLabelingInterfaceProps {
  walletAddress: string;
  tokenBalance: number;
  onLogout: () => void;
}

const DataLabelingInterface = ({ walletAddress, tokenBalance, onLogout }: DataLabelingInterfaceProps) => {
  const { toast } = useToast();
  
  // Audio state
  const [currentAudio, setCurrentAudio] = useState<AudioResponse | null>(null);
  const [isLoadingAudio, setIsLoadingAudio] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [comfortLevel, setComfortLevel] = useState(0);
  const [clarity, setClarity] = useState(0);
  const [speakingRate, setSpeakingRate] = useState<"Slow" | "Medium" | "Fast" | "">("");
  const [perceivedEmpathy, setPerceivedEmpathy] = useState<"Low" | "Medium" | "High" | "">("");
  const [notes, setNotes] = useState("");
  const [labelCount, setLabelCount] = useState(0);

  // Fetch next audio on mount and after submission
  const fetchNextAudio = async () => {
    setIsLoadingAudio(true);
    try {
      const audio = await getNextAudio();
      setCurrentAudio(audio);
    } catch (error) {
      console.error("Failed to fetch audio:", error);
      toast({
        variant: "destructive",
        title: "No More Audio Files",
        description: error instanceof Error ? error.message : "All audio files have been labeled!",
      });
      setCurrentAudio(null);
    } finally {
      setIsLoadingAudio(false);
    }
  };

  useEffect(() => {
    fetchNextAudio();
  }, []);

  const handlePlayPause = () => {
    if (!currentAudio) return;

    const audio = new Audio(currentAudio.file_url);
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
    // TODO: Implement actual audio playback
  };

  const resetForm = () => {
    setComfortLevel(0);
    setClarity(0);
    setSpeakingRate("");
    setPerceivedEmpathy("");
    setNotes("");
    setIsPlaying(false);
  };

  const handleSaveAndNext = async () => {
    if (!currentAudio) return;
    if (comfortLevel === 0 || clarity === 0 || !speakingRate || !perceivedEmpathy) {
      toast({
        variant: "destructive",
        title: "Incomplete Form",
        description: "Please fill in all required fields",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare label data
      const labelData: LabelSubmission = {
        audio_id: currentAudio.id,
        comfort_level: comfortLevel,
        clarity: clarity,
        speaking_rate: speakingRate as "Slow" | "Medium" | "Fast",
        perceived_empathy: perceivedEmpathy as "Low" | "Medium" | "High",
        notes: notes || undefined
      };

      // Submit to backend
      await submitLabel(labelData);

      toast({
        title: "Label Submitted!",
        description: "Thank you for your contribution.",
      });

      // Increment label count
      setLabelCount(prev => prev + 1);

      // Reset form
      resetForm();

      // Fetch next audio
      await fetchNextAudio();

    } catch (error) {
      console.error("Failed to submit label:", error);
      toast({
        variant: "destructive",
        title: "Submission Failed",
        description: error instanceof Error ? error.message : "Please try again",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const canSubmit = comfortLevel > 0 && clarity > 0 && speakingRate && perceivedEmpathy;

  return (
    <div className="fixed inset-0 w-full h-full bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 p-6 overflow-auto">
      <div className="max-w-7xl mx-auto min-h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-pink-200 to-purple-300 rounded-full flex items-center justify-center shadow-[inset_3px_3px_10px_rgba(160,100,200,0.3)]">
              <img src={logo} alt="Project Logo" className="object-contain w-[130%] h-[130%]"/>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 bg-clip-text text-transparent">Carepanion</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-white/60 backdrop-blur-sm text-purple-600 px-4 py-2 rounded-full text-sm font-bold shadow-[3px_3px_10px_rgba(160,100,200,0.2)]">
              {labelCount} Labeled
            </div>
            <UserProfileDropdown
              walletAddress={walletAddress}
              tokenBalance={tokenBalance}
              onLogout={onLogout}
            />
          </div>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-2.5 flex-1 bg-gradient-to-r from-pink-300 to-purple-400 rounded-full shadow-[inset_2px_2px_5px_rgba(160,100,200,0.3)]" />
            <div className="h-2.5 flex-1 bg-gradient-to-r from-purple-300 to-blue-400 rounded-full shadow-[inset_2px_2px_5px_rgba(100,120,200,0.3)]" />
            <div className="h-2.5 flex-1 bg-gradient-to-r from-blue-300 to-pink-400 rounded-full shadow-[inset_2px_2px_5px_rgba(200,100,180,0.3)]" />
          </div>
          <p className="text-sm text-purple-600 font-semibold">Step 3 of 3: Voice Labeling</p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 flex-1">
          {/* Left Side - Audio Player */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white/60 backdrop-blur-sm rounded-[2.5rem] shadow-[20px_20px_60px_rgba(140,100,180,0.5),-20px_-20px_60px_rgba(255,255,255,0.95)] p-8 border-2 border-white/70">
              <h2 className="text-2xl font-bold text-purple-600 mb-2">Label Voice Sample</h2>
              <p className="text-sm text-purple-500 mb-6">Listen to the audio clip and rate the voice characteristics.</p>

              {isLoadingAudio ? (
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl p-8 mb-4 border-2 border-purple-200/50 flex items-center justify-center h-64">
                  <div className="text-center">
                    <Loader2 className="w-12 h-12 text-purple-500 animate-spin mx-auto mb-3" />
                    <p className="text-purple-600 font-semibold">Loading audio...</p>
                  </div>
                </div>
              ) : currentAudio ? (
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl p-6 mb-4 border-2 border-purple-200/50 shadow-[inset_3px_3px_10px_rgba(160,100,200,0.15)]">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Volume2 className="w-5 h-5 text-purple-500" />
                      <div>
                        <p className="font-bold text-sm text-purple-700">
                          Audio #{currentAudio.id}
                        </p>
                        <p className="text-xs text-purple-500">
                          {currentAudio.duration_seconds} seconds
                        </p>
                      </div>
                    </div>
                    <Mic className="w-5 h-5 text-pink-500" />
                  </div>
                  
                  {/* Waveform */}
                  <div className="bg-white/60 rounded-2xl p-4 mb-4 shadow-[inset_2px_2px_8px_rgba(160,100,200,0.1)]">
                    <div className="flex items-center gap-1 h-12 justify-center">
                      {[...Array(30)].map((_, i) => (
                        <div
                          key={i}
                          className={`w-1 rounded-full transition-all ${
                            isPlaying ? 'bg-gradient-to-t from-purple-400 to-pink-400 animate-pulse' : 'bg-purple-200'
                          }`}
                          style={{
                            height: `${Math.random() * 60 + 20}%`,
                            animationDelay: `${i * 50}ms`
                          }}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="relative">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-300 to-pink-300 rounded-2xl blur opacity-50"></div>
                    <button
                      onClick={handlePlayPause}
                      className="relative w-full bg-gradient-to-r from-purple-300 to-pink-300 text-white py-3 rounded-2xl font-bold shadow-[inset_2px_2px_5px_rgba(255,255,255,0.4)] hover:shadow-[inset_4px_4px_10px_rgba(160,100,200,0.3)] transition-all flex items-center justify-center gap-2"
                    >
                      {isPlaying ? (
                        <>
                          <Pause className="w-5 h-5" />
                          Pause
                        </>
                      ) : (
                        <>
                          <Play className="w-5 h-5" />
                          Play Audio
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-white/40 rounded-3xl p-8 mb-4 border-2 border-purple-200/30 text-center">
                  <p className="text-purple-600 font-bold">No more audio files available</p>
                  <p className="text-sm text-purple-400 mt-2">You've completed all available labels!</p>
                </div>
              )}
            </div>

            {/* Info Card */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl p-6 border-2 border-purple-200/50 shadow-[10px_10px_30px_rgba(160,100,200,0.3)]">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-[inset_2px_2px_5px_rgba(160,100,200,0.2)]">
                  <Heart className="w-5 h-5 text-purple-500" />
                </div>
                <div>
                  <h3 className="font-bold text-purple-700 mb-1">Making a Difference!</h3>
                  <p className="text-sm text-purple-600">
                    Each label helps companion robots better understand comfort and clarity for elderly users worldwide.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Rating Form */}
          <div className="lg:col-span-3 bg-white/60 backdrop-blur-sm rounded-[2.5rem] shadow-[20px_20px_60px_rgba(140,100,180,0.5),-20px_-20px_60px_rgba(255,255,255,0.95)] p-8 border-2 border-white/70 flex flex-col">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Comfort Rating */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-bold text-purple-600">Comfort Level</label>
                  <span className="text-xs text-purple-400 font-semibold">
                    {comfortLevel > 0 ? comfortLevel + ' / 5' : 'Not rated'}
                  </span>
                </div>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => setComfortLevel(rating)}
                      disabled={isSubmitting || !currentAudio}
                      className={`flex-1 py-3 rounded-2xl border-2 transition-all font-bold ${
                        comfortLevel === rating
                          ? 'border-purple-400 bg-gradient-to-br from-purple-100 to-pink-100 text-purple-700 shadow-[inset_3px_3px_10px_rgba(160,100,200,0.2)]'
                          : 'border-white/60 bg-white/40 text-purple-400 hover:bg-white/60 shadow-[3px_3px_10px_rgba(160,100,200,0.15)]'
                      } ${(isSubmitting || !currentAudio) ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {rating}
                    </button>
                  ))}
                </div>
                <div className="flex justify-between mt-2 px-1">
                  <span className="text-xs text-purple-400">Uncomfortable</span>
                  <span className="text-xs text-purple-400">Very Comfortable</span>
                </div>
              </div>

              {/* Clarity Rating */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-bold text-purple-600">Clarity</label>
                  <span className="text-xs text-purple-400 font-semibold">
                    {clarity > 0 ? clarity + ' / 5' : 'Not rated'}
                  </span>
                </div>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => setClarity(rating)}
                      disabled={isSubmitting || !currentAudio}
                      className={`flex-1 py-3 rounded-2xl border-2 transition-all font-bold ${
                        clarity === rating
                          ? 'border-pink-400 bg-gradient-to-br from-pink-100 to-purple-100 text-pink-700 shadow-[inset_3px_3px_10px_rgba(200,100,180,0.2)]'
                          : 'border-white/60 bg-white/40 text-purple-400 hover:bg-white/60 shadow-[3px_3px_10px_rgba(160,100,200,0.15)]'
                      } ${(isSubmitting || !currentAudio) ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {rating}
                    </button>
                  ))}
                </div>
                <div className="flex justify-between mt-2 px-1">
                  <span className="text-xs text-purple-400">Hard to Understand</span>
                  <span className="text-xs text-purple-400">Crystal Clear</span>
                </div>
              </div>

              {/* Speaking Rate */}
              <div>
                <label className="block text-sm font-bold text-purple-600 mb-3">Speaking Rate</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Slow', 'Medium', 'Fast'] as const).map((rate) => (
                    <button
                      key={rate}
                      onClick={() => setSpeakingRate(rate)}
                      disabled={isSubmitting || !currentAudio}
                      className={`p-3 rounded-2xl border-2 transition-all ${
                        speakingRate === rate
                          ? 'border-blue-400 bg-gradient-to-br from-blue-50 to-purple-50 text-blue-700 shadow-[inset_3px_3px_10px_rgba(100,120,200,0.2)]'
                          : 'border-white/60 bg-white/40 text-purple-400 hover:bg-white/60 shadow-[3px_3px_10px_rgba(160,100,200,0.15)]'
                      } ${(isSubmitting || !currentAudio) ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <span className="font-bold text-sm">{rate}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Perceived Empathy */}
              <div>
                <label className="block text-sm font-bold text-purple-600 mb-3">Perceived Empathy</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Low', 'Medium', 'High'] as const).map((level) => (
                    <button
                      key={level}
                      onClick={() => setPerceivedEmpathy(level)}
                      disabled={isSubmitting || !currentAudio}
                      className={`p-3 rounded-2xl border-2 transition-all ${
                        perceivedEmpathy === level
                          ? 'border-pink-400 bg-gradient-to-br from-pink-50 to-purple-50 text-pink-700 shadow-[inset_3px_3px_10px_rgba(200,100,180,0.2)]'
                          : 'border-white/60 bg-white/40 text-purple-400 hover:bg-white/60 shadow-[3px_3px_10px_rgba(160,100,200,0.15)]'
                      } ${(isSubmitting || !currentAudio) ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <span className="font-bold text-sm">{level}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Optional Notes */}
            <div className="mt-6">
              <label className="block text-sm font-bold text-purple-600 mb-3">
                Notes (Optional)
                <span className="text-purple-400 font-normal ml-2">Any additional observations?</span>
              </label>
              <div className="relative">
                <MessageSquare className="absolute left-4 top-3 w-5 h-5 text-purple-400" />
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  disabled={isSubmitting || !currentAudio}
                  placeholder="Anything notable about accent, tone, background noise, or emotion?"
                  className="w-full pl-12 pr-4 py-3 border-2 border-white/60 bg-white/40 rounded-2xl focus:border-purple-400 focus:outline-none resize-none disabled:opacity-50 disabled:cursor-not-allowed text-purple-600 placeholder:text-purple-300 shadow-[inset_2px_2px_8px_rgba(160,100,200,0.1)]"
                  rows={2}
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-6">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-pink-300 via-purple-300 to-blue-300 rounded-full blur-xl opacity-60"></div>
                <button
                  onClick={handleSaveAndNext}
                  disabled={!canSubmit || isSubmitting || !currentAudio}
                  className={`relative w-full py-4 rounded-full font-bold text-lg transition-all flex items-center justify-center gap-2 ${
                    canSubmit && !isSubmitting && currentAudio
                      ? 'bg-gradient-to-r from-pink-300 via-purple-300 to-blue-300 text-white shadow-[inset_2px_2px_5px_rgba(255,255,255,0.5)] hover:shadow-[inset_4px_4px_10px_rgba(160,100,200,0.4)]'
                      : 'bg-white/40 text-purple-300 cursor-not-allowed'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit Label & Continue
                      <ChevronRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            </div>

            <p className="text-xs text-purple-400 mt-4 text-center font-medium">
              Your label will be recorded on Blockchain and contribute to AI training
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataLabelingInterface;