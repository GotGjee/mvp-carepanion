import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import logo from "@/assets/carepanion-logo.png";

interface WalletConnectionGateProps {
  onWalletConnected: () => void;
}

const WalletConnectionGate = ({ onWalletConnected }: WalletConnectionGateProps) => {
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnectWallet = async () => {
    setIsConnecting(true);
    
    try {
      // TODO: Implement Solana Wallet Adapter connection logic here.
      // This should:
      // 1. Initialize Solana wallet adapter
      // 2. Request wallet connection from user
      // 3. Handle wallet selection and approval
      // 4. Store wallet public key in state
      // 5. Handle connection errors gracefully
      
      // Simulate connection delay for UI purposes
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // After successful connection, notify parent component
      onWalletConnected();
    } catch (error) {
      console.error("Wallet connection failed:", error);
      // TODO: Show error toast to user
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center gradient-blue p-4">
      <div className="text-center space-y-8 max-w-md">
        {/* Logo */}
        <div className="flex justify-center">
          <img 
            src={logo} 
            alt="Carepanion Logo" 
            className="w-32 h-32 drop-shadow-2xl animate-in fade-in zoom-in duration-700"
          />
        </div>

        {/* Project Name */}
        <h1 className="text-5xl font-bold text-primary-foreground tracking-tight animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
          Carepanion
        </h1>

        {/* Tagline */}
        <p className="text-xl text-primary-foreground/90 font-light animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
          Helping robots understand emotions.<br />One label at a time.
        </p>

        {/* CTA Button */}
        <div className="pt-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500">
          <Button
            variant="hero"
            size="xl"
            onClick={handleConnectWallet}
            disabled={isConnecting}
            className="font-semibold"
          >
            {isConnecting ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Connecting...
              </>
            ) : (
              "Connect Wallet to Start Labeling"
            )}
          </Button>
        </div>

        {/* Additional Info */}
        <p className="text-sm text-primary-foreground/70 animate-in fade-in duration-700 delay-700">
          Secure connection powered by Solana
        </p>
      </div>
    </div>
  );
};

export default WalletConnectionGate;
