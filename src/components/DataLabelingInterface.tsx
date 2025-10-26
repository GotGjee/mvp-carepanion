import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import UserProfileDropdown from "@/components/UserProfileDropdown";
import { Play, Pause, Volume2, Mic, Heart, ChevronRight, Check, MessageSquare } from "lucide-react";

// Mock data types
interface AudioRecording {
  id: string;
  filename: string;
  duration: number;
  timeAgo: string;
  status: "pending" | "labeled" | "skipped";
}

interface EmotionLabel {
  primary: string;
  comfortLevel: number;
  emotionalIntensity: number;
  clarityOfSpeech: number;
  appropriatenessForElderly: number;
  perceivedEmpathy: number;
  speakingRate: string;
  genderPerceived: string;
  agePerceived: string;
  culturalFit: string;
  accent: string;
}

// Props passed from parent
interface DataLabelingInterfaceProps {
  walletAddress: string;
  tokenBalance: number;
  onLogout: () => void;
}

// Helper to create mock recordings
const createMockRecordings = (): AudioRecording[] => {
  const items: AudioRecording[] = [];
  for (let i = 1; i <= 20; i++) {
    const id = `rec_${String(i).padStart(3, "0")}`;
    const duration = Math.floor(Math.random() * 120) + 3;
    const minutesAgo = Math.floor(Math.random() * 180);
    const timeAgo = minutesAgo < 60 ? `${minutesAgo} min ago` : `${Math.floor(minutesAgo / 60)} hours ago`;
    const status: AudioRecording["status"] = i % 7 === 0 ? "labeled" : "pending";
    items.push({ id, filename: `Voice Recording ${i}`, duration, timeAgo, status });
  }
  return items;
};

// Simple waveform visualization component
const WaveformThumbnail = () => (
  <div className="flex items-center gap-px h-8">
    {Array.from({ length: 30 }).map((_, i) => (
      <div key={i} className="w-0.5 bg-muted-foreground/30 rounded-full" style={{ height: `${Math.random() * 100}%` }} />
    ))}
  </div>
);

const WaveformDisplay = () => (
  <div className="flex items-center justify-center gap-px h-16">
    {Array.from({ length: 100 }).map((_, i) => (
      <div key={i} className="w-1 bg-muted-foreground/40 rounded-full" style={{ height: `${Math.random() * 100}%` }} />
    ))}
  </div>
);

const DataLabelingInterface = ({ walletAddress, tokenBalance, onLogout }: DataLabelingInterfaceProps) => {
  const initialRecordings = createMockRecordings();
  
  // Recordings state
  const [recordings, setRecordings] = useState<AudioRecording[]>(initialRecordings);
  const [currentRecordingId, setCurrentRecordingId] = useState<string | null>(() => {
    const firstPending = initialRecordings.find((r) => r.status === "pending");
    return firstPending ? firstPending.id : null;
  });

  // UI state
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedEmotion, setSelectedEmotion] = useState<string>("");
  const [comfortLevel, setComfortLevel] = useState<number[]>([0]);
  const [emotionalIntensity, setEmotionalIntensity] = useState<number[]>([0]);
  const [clarityOfSpeech, setClarityOfSpeech] = useState<number[]>([0]);
  const [appropriatenessForElderly, setAppropriatenessForElderly] = useState<number[]>([0]);
  const [perceivedEmpathy, setPerceivedEmpathy] = useState<number[]>([0]);
  const [speakingRate, setSpeakingRate] = useState<string>("");
  const [genderPerceived, setGenderPerceived] = useState<string>("");
  const [agePerceived, setAgePerceived] = useState<string>("");
  const [culturalFit, setCulturalFit] = useState<string>("");
  const [accent, setAccent] = useState<string>("");
  const [filterValue, setFilterValue] = useState<string>("all");

  const currentRecording = recordings.find((r) => r.id === currentRecordingId) || null;

  const filteredRecordings = recordings.filter((r) => {
    if (filterValue === "all") return true;
    return r.status === (filterValue as AudioRecording["status"]);
  });

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleSaveAndNext = async () => {
    if (!currentRecordingId) return;

    const label: EmotionLabel = {
      primary: selectedEmotion,
      comfortLevel: comfortLevel[0],
      emotionalIntensity: emotionalIntensity[0],
      clarityOfSpeech: clarityOfSpeech[0],
      appropriatenessForElderly: appropriatenessForElderly[0],
      perceivedEmpathy: perceivedEmpathy[0],
      speakingRate,
      genderPerceived,
      agePerceived,
      culturalFit,
      accent,
    };

    console.log("Saving label:", label, "for recording:", currentRecordingId);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Update recording status to 'labeled' and advance to next pending
    setRecordings((prev) => {
      const updated = prev.map((r) => 
        r.id === currentRecordingId ? { ...r, status: "labeled" as AudioRecording["status"] } : r
      );
      const next = updated.find((r) => r.status === "pending" && r.id !== currentRecordingId);
      setCurrentRecordingId(next ? next.id : null);
      return updated;
    });

    // Reset form fields
    setSelectedEmotion("");
    setComfortLevel([0]);
    setEmotionalIntensity([0]);
    setClarityOfSpeech([0]);
    setAppropriatenessForElderly([0]);
    setPerceivedEmpathy([0]);
    setSpeakingRate(""); 
    setGenderPerceived("");
    setAgePerceived("");
    setCulturalFit("");
    setAccent("");
    
    // Reset UI selections for Speaking Rate and Perceived Empathy
    const speakingRateButtons = document.querySelectorAll('[data-speaking-rate]');
    speakingRateButtons.forEach(button => {
      if (button instanceof HTMLElement) {
        button.classList.remove('border-blue-600', 'bg-blue-50', 'text-blue-900');
        button.classList.add('border-gray-200', 'text-gray-700');
      }
    });

    const empathyButtons = document.querySelectorAll('[data-perceived-empathy]');
    empathyButtons.forEach(button => {
      if (button instanceof HTMLElement) {
        button.classList.remove('border-purple-600', 'bg-purple-50', 'text-purple-900');
        button.classList.add('border-gray-200', 'text-gray-700');
      }
    });
  };

  const [labelCount, setLabelCount] = useState(0);

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
            <div className="h-2 flex-1 bg-gray-200 rounded-full" />
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

              {/* Audio Player */}
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 mb-4 border-2 border-blue-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Volume2 className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="font-semibold text-sm text-gray-900">
                        {currentRecording ? currentRecording.filename : "Sample #1247"}
                      </p>
                      <p className="text-xs text-gray-600">
                        {currentRecording ? `${currentRecording.duration} seconds` : "15 seconds"}
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
                  disabled={!currentRecording}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
                    {comfortLevel[0] > 0 ? comfortLevel[0] + ' / 10' : 'Not rated'}
                  </span>
                </div>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => setComfortLevel([rating * 2])}
                      className={`flex-1 py-3 rounded-xl border-2 transition-all font-semibold ${
                        comfortLevel[0] === rating * 2
                          ? 'border-blue-600 bg-blue-600 text-white'
                          : 'border-gray-200 hover:border-blue-300 text-gray-700'
                      }`}
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
                    {clarityOfSpeech[0] > 0 ? Math.round(clarityOfSpeech[0] / 2) + ' / 5' : 'Not rated'}
                  </span>
                </div>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => setClarityOfSpeech([rating * 2])}
                      className={`flex-1 py-3 rounded-xl border-2 transition-all font-semibold ${
                        clarityOfSpeech[0] === rating * 2
                          ? 'border-purple-600 bg-purple-600 text-white'
                          : 'border-gray-200 hover:border-purple-300 text-gray-700'
                      }`}
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
                  {['slow', 'medium', 'fast'].map((rate) => (
                    <button
                      key={rate}
                      data-speaking-rate={rate}
                      onClick={() => setSpeakingRate(rate)}
                      className={`p-3 rounded-xl border-2 transition-all ${
                        speakingRate === rate
                          ? 'border-blue-600 bg-blue-50 text-blue-900'
                          : 'border-gray-200 hover:border-gray-300 text-gray-700'
                      }`}
                    >
                      <span className="font-medium text-sm capitalize">{rate}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Perceived Empathy as Volume */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">Perceived Empathy</label>
                <div className="grid grid-cols-3 gap-2">
                  {['Low', 'Medium', 'High'].map((vol, idx) => (
                    <button
                      key={vol}
                      data-perceived-empathy={vol.toLowerCase()}
                      onClick={() => setPerceivedEmpathy([idx === 0 ? 3 : idx === 1 ? 6 : 9])}
                      className={`p-3 rounded-xl border-2 transition-all ${
                        (perceivedEmpathy[0] === 3 && idx === 0) ||
                        (perceivedEmpathy[0] === 6 && idx === 1) ||
                        (perceivedEmpathy[0] === 9 && idx === 2)
                          ? 'border-purple-600 bg-purple-50 text-purple-900'
                          : 'border-gray-200 hover:border-gray-300 text-gray-700'
                      }`}
                    >
                      <span className="font-medium text-sm">{vol}</span>
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
                  value={accent}
                  onChange={(e) => setAccent(e.target.value)}
                  placeholder="Anything notable about accent, tone, background noise, or emotion?"
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-600 focus:outline-none resize-none"
                  rows={2}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={() => {
                handleSaveAndNext();
                setLabelCount(prev => prev + 1);
              }}
              disabled={comfortLevel[0] === 0 || clarityOfSpeech[0] === 0}
              className={`w-full py-4 rounded-2xl font-semibold text-lg transition-all flex items-center justify-center gap-2 mt-6 ${
                comfortLevel[0] > 0 && clarityOfSpeech[0] > 0
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              Submit Label & Continue
              <ChevronRight className="w-5 h-5" />
            </button>

            <p className="text-xs text-gray-500 mt-4 text-center">
              Your label will be recorded on World Chain and contribute to AI training
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataLabelingInterface;