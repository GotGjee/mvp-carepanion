import { useState } from "react";
import WalletConnectionGate from "@/components/WalletConnectionGate";
import DataLabelingInterface from "@/components/DataLabelingInterface";

interface UserData {
  address: string;
  balance: number;
}

const Index = () => {
  const [user, setUser] = useState<UserData | null>(null);

  const handleWalletConnected = (userData: UserData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <>
      {!user ? (
        <WalletConnectionGate onWalletConnected={handleWalletConnected} />
      ) : (
        <DataLabelingInterface 
          walletAddress={user.address}
          tokenBalance={user.balance}
          onLogout={handleLogout}
        />
      )}
    </>
  );
};

export default Index;
