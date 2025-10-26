import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heart, Check, ChevronRight } from "lucide-react";

interface ProfileData {
  gender: string;
  age: string;
  hearingAbility: string;
  nationality: string;
}

interface ProfileSetupProps {
  walletAddress: string;
  onProfileComplete: (profileData: ProfileData) => void;
}

const ProfileSetup = ({ walletAddress, onProfileComplete }: ProfileSetupProps) => {
  const [profileData, setProfileData] = useState<ProfileData>({
    gender: '',
    age: '',
    hearingAbility: '',
    nationality: ''
  });

  const genderOptions = ['Female', 'Male', 'Non-binary', 'Prefer not to say'];
  const ageBrackets = ['60–69', '70–79', '80–89', '90+'];
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
    return profileData.gender && profileData.age && profileData.hearingAbility && profileData.nationality;
  };

  const handleSubmit = async () => {
    if (!canProceed()) return;

    // TODO: Save profile to backend
    // POST /api/profiles
    // Body: { walletAddress, ...profileData }
    // Backend must link this profile to the wallet address
    console.log("Saving profile for wallet:", walletAddress, profileData);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));

    onProfileComplete(profileData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">Carepanion</h1>
          </div>
          <div className="flex items-center gap-2 text-sm text-green-700 bg-green-100 px-3 py-1.5 rounded-full">
            <Check className="w-4 h-4" />
            World ID Verified
          </div>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-2 flex-1 bg-blue-600 rounded-full" />
            <div className="h-2 flex-1 bg-gray-200 rounded-full" />
            <div className="h-2 flex-1 bg-gray-200 rounded-full" />
          </div>
          <p className="text-sm text-gray-600">Step 1 of 3: Profile Setup</p>
        </div>

        {/* Horizontal Form Layout */}
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
          <div className="grid grid-cols-2 gap-8">
            {/* Left Column */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Tell Us About Yourself</h2>
              <p className="text-gray-600 mb-6">This helps us understand diverse perspectives and improve our AI models for everyone.</p>

              {/* Gender */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-900 mb-3">Gender</label>
                <div className="grid grid-cols-2 gap-3">
                  {genderOptions.map((option) => (
                    <button
                      key={option}
                      onClick={() => handleInputChange('gender', option)}
                      className={`p-3 rounded-xl border-2 transition-all text-sm ${
                        profileData.gender === option
                          ? 'border-blue-600 bg-blue-50 text-blue-900'
                          : 'border-gray-200 hover:border-gray-300 text-gray-700'
                      }`}
                    >
                      <span className="font-medium">{option}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Age */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-900 mb-3">Age Bracket</label>
                <div className="grid grid-cols-4 gap-3">
                  {ageBrackets.map((bracket) => (
                    <button
                      key={bracket}
                      onClick={() => handleInputChange('age', bracket)}
                      className={`p-3 rounded-xl border-2 transition-all ${
                        profileData.age === bracket
                          ? 'border-blue-600 bg-blue-50 text-blue-900'
                          : 'border-gray-200 hover:border-gray-300 text-gray-700'
                      }`}
                    >
                      <span className="font-medium">{bracket}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div>
              {/* Hearing Ability */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-900 mb-3">Hearing Ability</label>
                <div className="space-y-2">
                  {hearingOptions.map((option) => (
                    <button
                      key={option}
                      onClick={() => handleInputChange('hearingAbility', option)}
                      className={`w-full p-3 rounded-xl border-2 transition-all text-left flex items-center justify-between ${
                        profileData.hearingAbility === option
                          ? 'border-blue-600 bg-blue-50 text-blue-900'
                          : 'border-gray-200 hover:border-gray-300 text-gray-700'
                      }`}
                    >
                      <span className="font-medium text-sm">{option}</span>
                      {profileData.hearingAbility === option && <Check className="w-4 h-4 text-blue-600" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Nationality */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-900 mb-3">Nationality</label>
                <div className="grid grid-cols-2 gap-3">
                  {popularCountries.map((country) => (
                    <button
                      key={country.code}
                      onClick={() => handleInputChange('nationality', country.code)}
                      className={`p-3 rounded-xl border-2 transition-all text-left ${
                        profileData.nationality === country.code
                          ? 'border-blue-600 bg-blue-50 text-blue-900'
                          : 'border-gray-200 hover:border-gray-300 text-gray-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{country.flag}</span>
                        <span className="font-medium text-xs">{country.name}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button - Full Width */}
          <button
            onClick={handleSubmit}
            disabled={!canProceed()}
            className={`w-full py-4 rounded-2xl font-semibold text-lg transition-all flex items-center justify-center gap-2 mt-6 ${
              canProceed()
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            Continue to Voice Labeling
            <ChevronRight className="w-5 h-5" />
          </button>

          <p className="text-xs text-gray-500 mt-4 text-center">
            Your data is encrypted and stored securely on World Chain. We never share personally identifiable information.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetup;
