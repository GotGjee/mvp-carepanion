import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Globe, Lock, Heart, Mic, Users, Shield } from "lucide-react";
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
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/10 relative overflow-hidden">
      {/* Sci-Fi Background Effects */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="absolute top-20 left-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse delay-1000"></div>

      {/* Header */}
      <header className="relative z-10 container mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 gradient-purple rounded-xl flex items-center justify-center shadow-glow-purple">
            <Heart className="w-6 h-6 text-white" fill="white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Carepanion</h1>
            <p className="text-sm text-muted-foreground">Empathy-Powered Eldercare AI</p>
          </div>
        </div>
        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center border border-primary/20 shadow-glow-blue">
          <Shield className="w-5 h-5 text-primary" />
        </div>
      </header>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          
          {/* Left Column */}
          <div className="space-y-8">
            {/* Main Card */}
            <Card className="p-8 shadow-sci-fi glass-effect backdrop-blur-xl border-primary/20 animate-in fade-in slide-in-from-bottom-4 duration-700">
              {/* Verified Badge */}
              <Badge 
                variant="secondary" 
                className="mb-6 bg-primary/10 text-primary border-primary/20 shadow-glow-blue"
              >
                <Globe className="w-3 h-3 mr-1" />
                Verified by World ID
              </Badge>

              {/* Main Heading */}
              <h2 className="text-4xl font-bold mb-4 text-foreground bg-gradient-to-r from-foreground to-primary bg-clip-text">
                Help Build Better Eldercare AI
              </h2>

              {/* Description */}
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Your voice helps companion robots understand comfort, clarity, and emotional nuance—making eldercare more empathetic and effective.
              </p>

              {/* CTA Button */}
              <Button
                variant="hero"
                size="xl"
                onClick={handleConnectWallet}
                disabled={isConnecting}
                className="w-full font-semibold gradient-sci-fi shadow-glow hover:shadow-glow-purple hover:scale-[1.02] transition-smooth mb-8"
              >
                {isConnecting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <Shield className="mr-2 h-5 w-5" />
                    Verify with World ID
                  </>
                )}
              </Button>

              {/* Info Sections */}
              <div className="space-y-6">
                {/* Global Impact */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shadow-glow-blue">
                    <Globe className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Global Impact</h3>
                    <p className="text-sm text-muted-foreground">
                      Starting in Thailand with hospital partners, expanding worldwide to help millions of seniors feel less lonely.
                    </p>
                  </div>
                </div>

                {/* Data Security */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shadow-glow-blue">
                    <Lock className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Data Security</h3>
                    <p className="text-sm text-muted-foreground">
                      All labels stored on World Chain. No personally identifiable information shared without consent.
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column - Feature Cards */}
          <div className="space-y-6">
            {/* Label Voice Samples Card */}
            <Card className="p-8 glass-effect backdrop-blur-xl border-blue-500/30 shadow-glow-blue hover:shadow-glow transition-smooth animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150 group hover:scale-[1.02]">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center mb-6 shadow-glow-blue group-hover:shadow-glow transition-smooth">
                <Mic className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-3">Label Voice Samples</h3>
              <p className="text-muted-foreground">
                Rate comfort, clarity, and speaking rate in short audio clips
              </p>
            </Card>

            {/* Privacy Protected Card */}
            <Card className="p-8 glass-effect backdrop-blur-xl border-purple-500/30 shadow-glow-purple hover:shadow-glow transition-smooth animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300 group hover:scale-[1.02]">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-violet-400 flex items-center justify-center mb-6 shadow-glow-purple group-hover:shadow-glow transition-smooth">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-3">Privacy Protected</h3>
              <p className="text-muted-foreground">
                World ID verification without revealing personal identity
              </p>
            </Card>

            {/* Earn Rewards Card */}
            <Card className="p-8 glass-effect backdrop-blur-xl border-pink-500/30 shadow-glow-pink hover:shadow-glow transition-smooth animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500 group hover:scale-[1.02]">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-400 flex items-center justify-center mb-6 shadow-glow-pink group-hover:shadow-glow transition-smooth">
                <Heart className="w-8 h-8 text-white" fill="white" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-3">Earn Rewards</h3>
              <p className="text-muted-foreground">
                Get tokens on World Chain for quality contributions
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletConnectionGate;
