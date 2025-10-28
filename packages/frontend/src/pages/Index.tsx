import { useState, useEffect } from "react";
import WalletConnectionGate from "@/components/WalletConnectionGate";
import ProfileSetup from "@/components/ProfileSetup";
import DataLabelingInterface from "@/components/DataLabelingInterface";
import { logout as apiLogout } from "@/services/api";

type AppStep = "login" | "profile" | "labeling";

interface UserData {
  address: string;
  balance: number;
  isNewUser: boolean;
}

const Index = () => {
  const [currentStep, setCurrentStep] = useState<AppStep>("login");
  const [userData, setUserData] = useState<UserData | null>(null);

  // Check if user is already logged in (has token)
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    const wallet = localStorage.getItem('wallet_address');
    
    if (token && wallet) {
      // User is logged in, go to labeling
      // In production, you should call getProfile() to check if profile is complete
      setUserData({
        address: wallet,
        balance: 0,
        isNewUser: false
      });
      setCurrentStep("labeling");
    }
  }, []);

  const handleWalletConnected = (data: UserData) => {
    setUserData(data);
    if (data.isNewUser) {
      setCurrentStep("profile");
    } else {
      setCurrentStep("labeling");
    }
  };

  const handleProfileComplete = () => {
    setCurrentStep("labeling");
  };

  const handleLogout = () => {
    apiLogout();
    setUserData(null);
    setCurrentStep("login");
  };

  return (
    <>
      {currentStep === "login" && (
        <WalletConnectionGate onWalletConnected={handleWalletConnected} />
      )}
      
      {currentStep === "profile" && userData && (
        <ProfileSetup
          walletAddress={userData.address}
          onProfileComplete={handleProfileComplete}
        />
      )}
      
      {currentStep === "labeling" && userData && (
        <DataLabelingInterface
          walletAddress={userData.address}
          tokenBalance={userData.balance}
          onLogout={handleLogout}
        />
      )}
    </>
  );
};

export default Index;