import { useState } from "react";
import { Check, ChevronRight, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { setupProfile, ProfileData } from "@/services/api";
import logo from "../assets/carepanion-logo1.png";

interface ProfileSetupProps {
  walletAddress: string;
  onProfileComplete: (profileData: ProfileData) => void;
}

const ProfileSetup = ({ walletAddress, onProfileComplete }: ProfileSetupProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    gender: '',
    age_bracket: '',
    hearing_ability: '',
    nationality: ''
  });

  const genderOptions = ['Female', 'Male', 'Non-binary', 'Prefer not to say'];
  const ageBrackets = ['60-69', '70-79', '80-89', '90+'];
  const hearingOptions = ['Normal', 'Mild loss', 'Moderate loss', 'Severe loss', 'Profound'];
  
  const popularCountries = [
    { code: 'TH', name: 'Thailand', flag: '🇹🇭' },
    { code: 'US', name: 'United States', flag: '🇺🇸' },
    { code: 'JP', name: 'Japan', flag: '🇯🇵' },
    { code: 'KR', name: 'South Korea', flag: '🇰🇷' },
    { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
    { code: 'AU', name: 'Australia', flag: '🇦🇺' }
  ];

  const handleInputChange = (field: keyof ProfileData, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const canProceed = () => {
    return profileData.gender && profileData.age_bracket && profileData.hearing_ability && profileData.nationality;
  };

  const handleSubmit = async () => {
    if (!canProceed()) return;

    setIsSubmitting(true);

    try {
      // Call backend API to save profile
      await setupProfile(profileData);

      toast({
        title: "Profile Saved!",
        description: "Your profile has been saved successfully.",
      });

      // Proceed to next step
      onProfileComplete(profileData);
      
    } catch (error) {
      console.error("Profile setup failed:", error);
      toast({
        variant: "destructive",
        title: "Failed to Save Profile",
        description: error instanceof Error ? error.message : "Please try again",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 w-full h-full bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 flex items-center justify-center p-6 overflow-auto">
      <div className="w-full max-w-3xl my-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-pink-200 to-purple-300 rounded-full flex items-center justify-center shadow-[inset_3px_3px_10px_rgba(160,100,200,0.3)]">
              <img src={logo} alt="Project Logo" className="object-contain w-[130%] h-[130%]"/>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 bg-clip-text text-transparent">Carepanion</h1>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 text-sm text-green-600 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full shadow-[3px_3px_10px_rgba(16,185,129,0.2)] font-semibold">
              <Check className="w-4 h-4" />
              Wallet Connected
            </div>
            <div className="text-xs text-purple-600 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full font-mono font-semibold shadow-[3px_3px_10px_rgba(160,100,200,0.2)]">
              {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-2.5 flex-1 bg-gradient-to-r from-pink-300 to-purple-400 rounded-full shadow-[inset_2px_2px_5px_rgba(160,100,200,0.3)]" />
            <div className="h-2.5 flex-1 bg-white/40 rounded-full" />
            <div className="h-2.5 flex-1 bg-white/40 rounded-full" />
          </div>
          <p className="text-sm text-purple-600 font-semibold">Step 2 of 3: Profile Setup</p>
        </div>

        {/* Main Card */}
        <div className="bg-white/60 backdrop-blur-sm rounded-[3rem] p-10 shadow-[20px_20px_60px_rgba(140,100,180,0.5),-20px_-20px_60px_rgba(255,255,255,0.95)] border-2 border-white/70">
          <h2 className="text-2xl font-bold text-purple-600 mb-2 text-center">Tell Us About Yourself</h2>
          <p className="text-purple-500 mb-8 text-center">This helps us understand diverse perspectives and improve our AI models for everyone.</p>

          <div className="space-y-6">
            {/* Gender */}
            <div>
              <label className="block text-sm font-bold text-purple-600 mb-3">Gender</label>
              <div className="grid grid-cols-2 gap-3">
                {genderOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleInputChange('gender', option)}
                    disabled={isSubmitting}
                    className={`p-4 rounded-2xl border-2 transition-all text-sm font-semibold ${
                      profileData.gender === option
                        ? 'border-purple-400 bg-gradient-to-br from-purple-50 to-pink-50 text-purple-700 shadow-[inset_3px_3px_10px_rgba(160,100,200,0.2)]'
                        : 'border-white/70 bg-white/40 text-purple-400 hover:bg-white/60 shadow-[3px_3px_10px_rgba(160,100,200,0.15)]'
                    } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            {/* Age */}
            <div>
              <label className="block text-sm font-bold text-purple-600 mb-3">Age Bracket</label>
              <div className="grid grid-cols-4 gap-3">
                {ageBrackets.map((bracket) => (
                  <button
                    key={bracket}
                    onClick={() => handleInputChange('age_bracket', bracket)}
                    disabled={isSubmitting}
                    className={`p-4 rounded-2xl border-2 transition-all font-semibold ${
                      profileData.age_bracket === bracket
                        ? 'border-blue-400 bg-gradient-to-br from-blue-50 to-purple-50 text-blue-700 shadow-[inset_3px_3px_10px_rgba(100,120,200,0.2)]'
                        : 'border-white/70 bg-white/40 text-purple-400 hover:bg-white/60 shadow-[3px_3px_10px_rgba(160,100,200,0.15)]'
                    } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {bracket}
                  </button>
                ))}
              </div>
            </div>

            {/* Hearing Ability */}
            <div>
              <label className="block text-sm font-bold text-purple-600 mb-3">Hearing Ability</label>
              <div className="space-y-2">
                {hearingOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleInputChange('hearing_ability', option)}
                    disabled={isSubmitting}
                    className={`w-full p-4 rounded-2xl border-2 transition-all text-left flex items-center justify-between ${
                      profileData.hearing_ability === option
                        ? 'border-pink-400 bg-gradient-to-r from-pink-50 to-purple-50 text-pink-700 shadow-[inset_3px_3px_10px_rgba(200,100,180,0.2)]'
                        : 'border-white/70 bg-white/40 text-purple-400 hover:bg-white/60 shadow-[3px_3px_10px_rgba(160,100,200,0.15)]'
                    } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <span className="font-semibold text-sm">{option}</span>
                    {profileData.hearing_ability === option && <Check className="w-5 h-5 text-pink-500" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Nationality */}
            <div>
              <label className="block text-sm font-bold text-purple-600 mb-3">Nationality</label>
              <div className="grid grid-cols-3 gap-3">
                {popularCountries.map((country) => (
                  <button
                    key={country.code}
                    onClick={() => handleInputChange('nationality', country.code)}
                    disabled={isSubmitting}
                    className={`p-3 rounded-2xl border-2 transition-all ${
                      profileData.nationality === country.code
                        ? 'border-purple-400 bg-gradient-to-br from-purple-50 to-blue-50 text-purple-700 shadow-[inset_3px_3px_10px_rgba(120,100,200,0.2)]'
                        : 'border-white/70 bg-white/40 text-purple-400 hover:bg-white/60 shadow-[3px_3px_10px_rgba(160,100,200,0.15)]'
                    } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{country.flag}</span>
                      <span className="font-semibold text-xs truncate">{country.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-8">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-pink-300 via-purple-300 to-blue-300 rounded-full blur-xl opacity-60"></div>
              <button
                onClick={handleSubmit}
                disabled={!canProceed() || isSubmitting}
                className={`relative w-full py-4 rounded-full font-bold text-lg transition-all flex items-center justify-center gap-3 ${
                  canProceed() && !isSubmitting
                    ? 'bg-gradient-to-r from-pink-300 via-purple-300 to-blue-300 text-white shadow-[inset_2px_2px_5px_rgba(255,255,255,0.5),inset_-2px_-2px_5px_rgba(160,100,200,0.3)] hover:shadow-[inset_4px_4px_10px_rgba(160,100,200,0.4),inset_-4px_-4px_10px_rgba(255,255,255,0.6)]'
                    : 'bg-white/40 text-purple-300 cursor-not-allowed'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    <span>Saving Profile...</span>
                  </>
                ) : (
                  <>
                    <span>Continue to Voice Labeling</span>
                    <ChevronRight className="w-6 h-6" />
                  </>
                )}
              </button>
            </div>
          </div>

          <p className="text-xs text-purple-400 mt-6 text-center font-medium">
            Your data is encrypted and stored securely. We never share personally identifiable information.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetup;