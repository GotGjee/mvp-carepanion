import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, SkipForward, Globe, Coins } from "lucide-react";

// Mock data types
interface AudioRecording {
  id: string;
  filename: string;
  duration: number;
  status: "pending" | "labeled" | "skipped";
}

interface EmotionLabel {
  primary: string;
  arousal: number;
  valence: number;
  dominance: number;
}

const DataLabelingInterface = () => {
  // State management
  const [currentRecordingId, setCurrentRecordingId] = useState<string>("rec_001");
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedEmotion, setSelectedEmotion] = useState<string>("");
  const [arousal, setArousal] = useState<number[]>([50]);
  const [valence, setValence] = useState<number[]>([50]);
  const [dominance, setDominance] = useState<number[]>([50]);

  // Mock data - in real implementation, this would come from backend
  const recordings: AudioRecording[] = [
    { id: "rec_001", filename: "conversation_001.wav", duration: 45, status: "pending" },
    { id: "rec_002", filename: "conversation_002.wav", duration: 32, status: "pending" },
    { id: "rec_003", filename: "conversation_003.wav", duration: 58, status: "labeled" },
  ];

  const emotions = ["Calm", "Happy", "Sad", "Angry", "Fearful", "Surprised", "Neutral"];

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    // TODO: Implement audio player controls
    // - Connect to HTML5 Audio API or use a library like Howler.js
    // - Play/pause the current audio recording
    // - Update playback position in real-time
  };

  const handleSaveAndNext = async () => {
    // TODO: Implement state update and API call to backend
    // This should:
    // 1. Validate that all required fields are filled
    // 2. Create emotion label object with current form values
    // 3. Send POST request to backend API with label data
    // 4. Update recording status to "labeled"
    // 5. Load next pending recording
    // 6. Reset form to default values
    // 7. Show success toast notification
    // 8. Handle errors and show error toast if needed

    const label: EmotionLabel = {
      primary: selectedEmotion,
      arousal: arousal[0],
      valence: valence[0],
      dominance: dominance[0],
    };

    console.log("Saving label:", label, "for recording:", currentRecordingId);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));

    // Move to next recording
    await fetchNextAudioClip();
    
    // Reset form
    setSelectedEmotion("");
    setArousal([50]);
    setValence([50]);
    setDominance([50]);
  };

  const fetchNextAudioClip = async () => {
    // TODO: Fetch next audio clip from the backend API
    // This should:
    // 1. Send GET request to /api/recordings/next
    // 2. Receive next pending recording data
    // 3. Update currentRecordingId state
    // 4. Preload audio file for smooth playback
    // 5. Handle case when no more recordings are available
    
    console.log("Fetching next audio clip...");
  };

  const handleSkip = () => {
    // TODO: Implement skip functionality
    // - Mark current recording as "skipped"
    // - Load next recording
    // - Optionally send skip event to backend for analytics
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border shadow-soft">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Empathy Data Labeling</h1>
          
          <div className="flex items-center gap-6">
            {/* World ID Badge */}
            <div className="flex items-center gap-2 bg-secondary px-4 py-2 rounded-lg">
              <Globe className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium text-secondary-foreground">World ID</span>
            </div>
            
            {/* Token Balance */}
            <div className="flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-lg">
              <Coins className="w-5 h-5 text-primary" />
              <span className="text-sm font-semibold text-primary">1,250 CARE</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column - Recording List */}
          <div className="lg:col-span-4">
            <Card className="p-4 shadow-soft">
              <h2 className="text-lg font-semibold mb-4 text-card-foreground">Audio Recordings</h2>
              <div className="space-y-2">
                {recordings.map((recording) => (
                  <button
                    key={recording.id}
                    onClick={() => setCurrentRecordingId(recording.id)}
                    className={`w-full text-left p-3 rounded-lg transition-smooth ${
                      currentRecordingId === recording.id
                        ? "bg-primary text-primary-foreground shadow-soft"
                        : "bg-secondary hover:bg-secondary/80 text-secondary-foreground"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">{recording.filename}</p>
                        <p className="text-xs opacity-80">{recording.duration}s</p>
                      </div>
                      <Badge 
                        variant={recording.status === "labeled" ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {recording.status}
                      </Badge>
                    </div>
                  </button>
                ))}
              </div>
            </Card>
          </div>

          {/* Right Column - Labeling Form */}
          <div className="lg:col-span-8">
            <Card className="p-6 shadow-soft">
              <h2 className="text-xl font-semibold mb-6 text-card-foreground">Label Emotions</h2>
              
              {/* Audio Player */}
              <div className="bg-secondary rounded-lg p-6 mb-6">
                <div className="flex items-center justify-center gap-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handlePlayPause}
                    className="h-12 w-12"
                  >
                    {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                  </Button>
                  
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary w-1/3 transition-smooth" />
                  </div>
                  
                  <span className="text-sm text-muted-foreground font-mono">00:15 / 00:45</span>
                </div>
              </div>

              {/* Primary Emotion Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-3 text-card-foreground">
                  Primary Emotion
                </label>
                <div className="flex flex-wrap gap-2">
                  {emotions.map((emotion) => (
                    <Button
                      key={emotion}
                      variant={selectedEmotion === emotion ? "default" : "pill"}
                      onClick={() => setSelectedEmotion(emotion)}
                      size="sm"
                    >
                      {emotion}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Arousal Slider */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-3 text-card-foreground">
                  Arousal (Energy Level): <span className="text-primary font-semibold">{arousal[0]}%</span>
                </label>
                <Slider
                  value={arousal}
                  onValueChange={setArousal}
                  max={100}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>Calm</span>
                  <span>Excited</span>
                </div>
              </div>

              {/* Valence Slider */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-3 text-card-foreground">
                  Valence (Positivity): <span className="text-primary font-semibold">{valence[0]}%</span>
                </label>
                <Slider
                  value={valence}
                  onValueChange={setValence}
                  max={100}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>Negative</span>
                  <span>Positive</span>
                </div>
              </div>

              {/* Dominance Slider */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-3 text-card-foreground">
                  Dominance (Control): <span className="text-primary font-semibold">{dominance[0]}%</span>
                </label>
                <Slider
                  value={dominance}
                  onValueChange={setDominance}
                  max={100}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>Submissive</span>
                  <span>Dominant</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between items-center pt-4">
                <Button
                  variant="outline"
                  onClick={handleSkip}
                  className="gap-2"
                >
                  <SkipForward className="w-4 h-4" />
                  Skip
                </Button>
                
                <Button
                  variant="default"
                  onClick={handleSaveAndNext}
                  disabled={!selectedEmotion}
                  className="gap-2 shadow-soft hover:shadow-glow"
                  size="lg"
                >
                  Save & Next
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataLabelingInterface;
