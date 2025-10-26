import { useState } from "react";
import WalletConnectionGate from "@/components/WalletConnectionGate";
import ProfileSetup from "@/pages/ProfileSetup";
import DataLabelingInterface from "@/components/DataLabelingInterface";

interface UserData {
  address: string;
  balance: number;
}

interface ProfileData {
  gender: string;
  age: string;
  hearingAbility: string;
  nationality: string;
}

const Index = () => {
  const [user, setUser] = useState<UserData | null>(null);
  const [hasProfile, setHasProfile] = useState<boolean>(false);

  const handleWalletConnected = async (userData: UserData) => {
    setUser(userData);
    
    // TODO: Check if wallet address already has a profile
    // GET /api/profiles?walletAddress=[userData.address]
    // If profile exists, setHasProfile(true)
    // For now, always show profile setup for new wallets
    console.log("Checking profile for wallet:", userData.address);
    
    // Simulate API check
    const profileExists = false; // TODO: Replace with actual API call
    setHasProfile(profileExists);
  };

  const handleProfileComplete = (profileData: ProfileData) => {
    console.log("Profile completed:", profileData);
    setHasProfile(true);
  };

  const handleLogout = () => {
    setUser(null);
    setHasProfile(false);
  };

  // Not logged in - show welcome/login
  if (!user) {
    return <WalletConnectionGate onWalletConnected={handleWalletConnected} />;
  }

  // Logged in but no profile - show profile setup
  if (!hasProfile) {
    return (
      <ProfileSetup 
        walletAddress={user.address}
        onProfileComplete={handleProfileComplete}
      />
    );
  }

  // Logged in and has profile - show labeling interface
  return (
    <DataLabelingInterface 
      walletAddress={user.address}
      tokenBalance={user.balance}
      onLogout={handleLogout}
    />
  );
};

export default Index;
