import { useState, useEffect } from "react";
import UserProfileDropdown from "@/components/UserProfileDropdown";
import { Play, Pause, Volume2, Mic, Heart, ChevronRight, MessageSquare, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getNextAudio, submitLabel, AudioResponse, LabelSubmission } from "@/services/api";

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
    if (currentAudio) {
      const audio = new Audio(currentAudio.file_url);
      audio.play();
      setIsPlaying(true);
    }
    fetchNextAudio();
  }, [currentAudio]);

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
    <div className="min-h-screen bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">Carepanion</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-purple-100 text-purple-700 px-3 py-1.5 rounded-full text-sm font-medium">
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
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-1">
            <div className="h-2 flex-1 bg-blue-600 rounded-full" />
            <div className="h-2 flex-1 bg-blue-600 rounded-full" />
            <div className="h-2 flex-1 bg-blue-600 rounded-full" />
          </div>
          <p className="text-sm text-gray-600">Step 3 of 3: Voice Labeling</p>
        </div>

        {/* Horizontal Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 md:gap-6">
          {/* Left Side - Audio Player (2 columns) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-3xl shadow-xl p-4 md:p-6 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-2">Label Voice Sample</h2>
              <p className="text-sm text-gray-600 mb-6">Listen to the audio clip and rate the voice characteristics.</p>

              {isLoadingAudio ? (
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 mb-4 border-2 border-blue-100 flex items-center justify-center h-64">
                  <div className="text-center">
                    <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-3" />
                    <p className="text-gray-600">Loading audio...</p>
                  </div>
                </div>
              ) : currentAudio ? (
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 mb-4 border-2 border-blue-100">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Volume2 className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="font-semibold text-sm text-gray-900">
                          Audio #{currentAudio.id}
                        </p>
                        <p className="text-xs text-gray-600">
                          {currentAudio.duration_seconds} seconds
                        </p>
                      </div>
                    </div>
                    <Mic className="w-5 h-5 text-purple-600" />
                  </div>
                  
                  {/* Waveform */}
                  <div className="bg-white rounded-xl p-4 mb-4">
                    <div className="flex items-center gap-1 h-12 justify-center">
                      {[...Array(30)].map((_, i) => (
                        <div
                          key={i}
                          className={`w-1 rounded-full transition-all ${
                            isPlaying ? 'bg-blue-600 animate-pulse' : 'bg-gray-300'
                          }`}
                          style={{
                            height: `${Math.random() * 60 + 20}%`,
                            animationDelay: `${i * 50}ms`
                          }}
                        />
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={handlePlayPause}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
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
              ) : (
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 mb-4 border-2 border-gray-200 text-center">
                  <p className="text-gray-600 font-medium">No more audio files available</p>
                  <p className="text-sm text-gray-500 mt-2">You've completed all available labels!</p>
                </div>
              )}
            </div>

            {/* Info Card */}
            <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl p-6 border border-blue-200">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                  <Heart className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Making a Difference!</h3>
                  <p className="text-sm text-gray-700">
                    Each label helps companion robots better understand comfort and clarity for elderly users worldwide.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Rating Form (3 columns) */}
          <div className="lg:col-span-3 bg-white rounded-3xl shadow-xl p-4 md:p-6 border border-gray-100 flex flex-col">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Comfort Rating */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-semibold text-gray-900">Comfort Level</label>
                  <span className="text-xs text-gray-600">
                    {comfortLevel > 0 ? comfortLevel + ' / 5' : 'Not rated'}
                  </span>
                </div>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => setComfortLevel(rating)}
                      disabled={isSubmitting || !currentAudio}
                      className={`flex-1 py-3 rounded-xl border-2 transition-all font-semibold ${
                        comfortLevel === rating
                          ? 'border-blue-600 bg-blue-600 text-white'
                          : 'border-gray-200 hover:border-blue-300 text-gray-700'
                      } ${(isSubmitting || !currentAudio) ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {rating}
                    </button>
                  ))}
                </div>
                <div className="flex justify-between mt-2 px-1">
                  <span className="text-xs text-gray-500">Uncomfortable</span>
                  <span className="text-xs text-gray-500">Very Comfortable</span>
                </div>
              </div>

              {/* Clarity Rating */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-semibold text-gray-900">Clarity</label>
                  <span className="text-xs text-gray-600">
                    {clarity > 0 ? clarity + ' / 5' : 'Not rated'}
                  </span>
                </div>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => setClarity(rating)}
                      disabled={isSubmitting || !currentAudio}
                      className={`flex-1 py-3 rounded-xl border-2 transition-all font-semibold ${
                        clarity === rating
                          ? 'border-purple-600 bg-purple-600 text-white'
                          : 'border-gray-200 hover:border-purple-300 text-gray-700'
                      } ${(isSubmitting || !currentAudio) ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {rating}
                    </button>
                  ))}
                </div>
                <div className="flex justify-between mt-2 px-1">
                  <span className="text-xs text-gray-500">Hard to Understand</span>
                  <span className="text-xs text-gray-500">Crystal Clear</span>
                </div>
              </div>

              {/* Speaking Rate */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">Speaking Rate</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Slow', 'Medium', 'Fast'] as const).map((rate) => (
                    <button
                      key={rate}
                      onClick={() => setSpeakingRate(rate)}
                      disabled={isSubmitting || !currentAudio}
                      className={`p-3 rounded-xl border-2 transition-all ${
                        speakingRate === rate
                          ? 'border-blue-600 bg-blue-50 text-blue-900'
                          : 'border-gray-200 hover:border-gray-300 text-gray-700'
                      } ${(isSubmitting || !currentAudio) ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <span className="font-medium text-sm">{rate}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Perceived Empathy */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">Perceived Empathy</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Low', 'Medium', 'High'] as const).map((level) => (
                    <button
                      key={level}
                      onClick={() => setPerceivedEmpathy(level)}
                      disabled={isSubmitting || !currentAudio}
                      className={`p-3 rounded-xl border-2 transition-all ${
                        perceivedEmpathy === level
                          ? 'border-purple-600 bg-purple-50 text-purple-900'
                          : 'border-gray-200 hover:border-gray-300 text-gray-700'
                      } ${(isSubmitting || !currentAudio) ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <span className="font-medium text-sm">{level}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Optional Notes */}
            <div className="mt-6">
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Notes (Optional)
                <span className="text-gray-500 font-normal ml-2">Any additional observations?</span>
              </label>
              <div className="relative">
                <MessageSquare className="absolute left-4 top-3 w-5 h-5 text-gray-400" />
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  disabled={isSubmitting || !currentAudio}
                  placeholder="Anything notable about accent, tone, background noise, or emotion?"
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-600 focus:outline-none resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                  rows={2}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSaveAndNext}
              disabled={!canSubmit || isSubmitting || !currentAudio}
              className={`w-full py-4 rounded-2xl font-semibold text-lg transition-all flex items-center justify-center gap-2 mt-6 ${
                canSubmit && !isSubmitting && currentAudio
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Submitting....
                </>
              ) : (
                <>
                  Submit Label & Continue
                  <ChevronRight className="w-5 h-5" />
                </>
              )}
            </button>

            <p className="text-xs text-gray-500 mt-4 text-center">
              Your label will be recorded on Block Chain and contribute to AI training
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataLabelingInterface;