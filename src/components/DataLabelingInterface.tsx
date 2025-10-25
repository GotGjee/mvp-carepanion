import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Play, Pause, Globe } from "lucide-react";

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
  const [comfortLevel, setComfortLevel] = useState<number[]>([5]);
  const [emotionalIntensity, setEmotionalIntensity] = useState<number[]>([5]);
  const [clarityOfSpeech, setClarityOfSpeech] = useState<number[]>([5]);
  const [appropriatenessForElderly, setAppropriatenessForElderly] = useState<number[]>([5]);
  const [perceivedEmpathy, setPerceivedEmpathy] = useState<number[]>([5]);
  const [speakingRate, setSpeakingRate] = useState<string>("slow");
  const [genderPerceived, setGenderPerceived] = useState<string>("");
  const [agePerceived, setAgePerceived] = useState<string>("");
  const [culturalFit, setCulturalFit] = useState<string>("");
  const [accent, setAccent] = useState<string>("");
  const [filterValue, setFilterValue] = useState<string>("all");

  const emotions = ["Calm", "Happy", "Sad", "Anxious", "Lonely"];

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
    setComfortLevel([5]);
    setEmotionalIntensity([5]);
    setClarityOfSpeech([5]);
    setAppropriatenessForElderly([5]);
    setPerceivedEmpathy([5]);
    setSpeakingRate("slow");
    setGenderPerceived("");
    setAgePerceived("");
    setCulturalFit("");
    setAccent("");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border shadow-sm">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Empathy Data Labeling</h1>

          <div className="flex items-center gap-6">
            {/* World ID Badge */}
            <div className="flex items-center gap-2">
              <div className="bg-primary/10 p-1.5 rounded-full">
                <Globe className="w-4 h-4 text-primary" />
              </div>
              <span className="text-sm font-medium text-foreground">World ID</span>
            </div>

            {/* Token Balance */}
            <div className="text-right">
              <div className="text-lg font-bold text-foreground">{Number(tokenBalance).toLocaleString()} CARE</div>
              <div className="text-xs text-muted-foreground">
                {walletAddress ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : "—"}
              </div>
            </div>
            
            {/* Logout */}
            <div>
              <Button variant="ghost" size="sm" onClick={onLogout} className="ml-2">
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-6">
        <div className="grid grid-cols-12 gap-6">

          {/* Left Column - Recording List */}
          <div className="col-span-3">
            <div className="space-y-4">
              {/* Filter Dropdown */}
              <Select value={filterValue} onValueChange={setFilterValue}>
                <SelectTrigger className="w-full bg-card">
                  <SelectValue placeholder="Filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Recordings</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="labeled">Labeled</SelectItem>
                  <SelectItem value="skipped">Skipped</SelectItem>
                </SelectContent>
              </Select>

              {/* Recording List */}
              <div className="space-y-2 max-h-[calc(100vh-240px)] overflow-y-auto">
                {filteredRecordings.map((recording) => (
                  <button
                    key={recording.id}
                    onClick={() => setCurrentRecordingId(recording.id)}
                    className={`w-full text-left p-3 rounded-lg transition-all border ${
                      currentRecordingId === recording.id 
                        ? "bg-primary/5 border-primary" 
                        : "bg-card border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-12">
                        <WaveformThumbnail />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-foreground truncate">{recording.filename}</p>
                        <p className="text-xs text-muted-foreground">{recording.duration} sec · {recording.timeAgo}</p>
                      </div>
                      <div className="ml-2">
                        {recording.status === "pending" ? (
                          <Badge variant="secondary">Pending</Badge>
                        ) : (
                          <Badge variant="outline">{recording.status}</Badge>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Center Column - Audio Player */}
          <div className="col-span-5">
            <Card className="p-6 shadow-sm">
              {/* Waveform Display */}
              <div className="mb-6">
                <WaveformDisplay />
              </div>

              {/* Recording Title */}
              <h2 className="text-xl font-semibold mb-4 text-foreground">
                {currentRecording ? currentRecording.filename : "No recording selected"}
              </h2>

              {/* Audio Player Controls */}
              <div className="flex items-center gap-4 mb-8">
                <Button 
                  variant="default" 
                  size="icon" 
                  onClick={handlePlayPause} 
                  className="h-12 w-12 rounded-full"
                  disabled={!currentRecording}
                >
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                </Button>

                <div className="flex-1 flex items-center gap-3">
                  <span className="text-sm text-muted-foreground font-mono">0:00</span>
                  <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary w-1/4 transition-all" />
                  </div>
                  <span className="text-sm text-muted-foreground font-mono">
                    {currentRecording ? `0:${String(currentRecording.duration).padStart(2, '0')}` : '0:00'}
                  </span>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column - Labeling Form */}
          <div className="col-span-4">
            <Card className="p-6 shadow-sm max-h-[calc(100vh-160px)] overflow-y-auto">
              {/* Emotion Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-3 text-foreground">What do you feel?</label>
                <div className="flex flex-wrap gap-2">
                  {emotions.map((emotion) => (
                    <Button 
                      key={emotion} 
                      variant={selectedEmotion === emotion ? "default" : "outline"} 
                      onClick={() => setSelectedEmotion(emotion)} 
                      size="sm"
                    >
                      {emotion}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Comfort Level */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-foreground">Comfort level</label>
                  <span className="text-sm font-semibold text-foreground">{comfortLevel[0]}</span>
                </div>
                <Slider value={comfortLevel} onValueChange={setComfortLevel} max={10} step={1} className="w-full" />
              </div>

              {/* Emotional Intensity */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-foreground">Emotional intensity</label>
                  <span className="text-sm font-semibold text-foreground">{emotionalIntensity[0]}</span>
                </div>
                <Slider value={emotionalIntensity} onValueChange={setEmotionalIntensity} max={10} step={1} className="w-full" />
              </div>

              {/* Clarity of Speech */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-foreground">Clarity of speech</label>
                  <span className="text-sm font-semibold text-foreground">{clarityOfSpeech[0]}</span>
                </div>
                <Slider value={clarityOfSpeech} onValueChange={setClarityOfSpeech} max={10} step={1} className="w-full" />
              </div>

              {/* Appropriateness for Elderly */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-foreground">Appropriateness for elderly</label>
                  <span className="text-sm font-semibold text-foreground">{appropriatenessForElderly[0]}</span>
                </div>
                <Slider value={appropriatenessForElderly} onValueChange={setAppropriatenessForElderly} max={10} step={1} className="w-full" />
              </div>

              {/* Perceived Empathy */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-foreground">Perceived empathy</label>
                  <span className="text-sm font-semibold text-foreground">{perceivedEmpathy[0]}</span>
                </div>
                <Slider value={perceivedEmpathy} onValueChange={setPerceivedEmpathy} max={10} step={1} className="w-full" />
              </div>

              {/* Speaking Rate */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-foreground">Speaking rate</label>
                <Select value={speakingRate} onValueChange={setSpeakingRate}>
                  <SelectTrigger className="w-full bg-background">
                    <SelectValue placeholder="Select rate" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="slow">Slow</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="fast">Fast</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Gender Perceived */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-foreground">Gender perceived</label>
                <Select value={genderPerceived} onValueChange={setGenderPerceived}>
                  <SelectTrigger className="w-full bg-background">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="non-binary">Non-binary</SelectItem>
                    <SelectItem value="unsure">Unsure</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Age Perceived */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-foreground">Age perceived</label>
                <Select value={agePerceived} onValueChange={setAgePerceived}>
                  <SelectTrigger className="w-full bg-background">
                    <SelectValue placeholder="Select age range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="child">Child (0-12)</SelectItem>
                    <SelectItem value="teen">Teen (13-19)</SelectItem>
                    <SelectItem value="young-adult">Young Adult (20-35)</SelectItem>
                    <SelectItem value="adult">Adult (36-55)</SelectItem>
                    <SelectItem value="senior">Senior (56+)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Cultural Fit */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-foreground">Cultural fit</label>
                <Select value={culturalFit} onValueChange={setCulturalFit}>
                  <SelectTrigger className="w-full bg-background">
                    <SelectValue placeholder="Select cultural fit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="very-appropriate">Very Appropriate</SelectItem>
                    <SelectItem value="appropriate">Appropriate</SelectItem>
                    <SelectItem value="neutral">Neutral</SelectItem>
                    <SelectItem value="inappropriate">Inappropriate</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Accent */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2 text-foreground">Accent</label>
                <Select value={accent} onValueChange={setAccent}>
                  <SelectTrigger className="w-full bg-background">
                    <SelectValue placeholder="Select accent" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No Accent</SelectItem>
                    <SelectItem value="british">British</SelectItem>
                    <SelectItem value="american">American</SelectItem>
                    <SelectItem value="australian">Australian</SelectItem>
                    <SelectItem value="asian">Asian</SelectItem>
                    <SelectItem value="european">European</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Save Button */}
              <Button 
                variant="default" 
                onClick={handleSaveAndNext} 
                disabled={!selectedEmotion || !currentRecording} 
                className="w-full" 
                size="lg"
              >
                Save & Next
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataLabelingInterface;