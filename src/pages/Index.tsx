import { useState } from "react";
import WalletConnectionGate from "@/components/WalletConnectionGate";
import DataLabelingInterface from "@/components/DataLabelingInterface";

const Index = () => {
  const [isWalletConnected, setIsWalletConnected] = useState(false);

  const handleWalletConnected = () => {
    setIsWalletConnected(true);
  };

  return (
    <>
      {!isWalletConnected ? (
        <WalletConnectionGate onWalletConnected={handleWalletConnected} />
      ) : (
        <DataLabelingInterface />
      )}
    </>
  );
};

export default Index;
