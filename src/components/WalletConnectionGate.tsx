import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Globe, Lock, Heart, Mic, Users, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import logo from "@/assets/carepanion-logo.png";

interface WalletConnectionGateProps {
  onWalletConnected: (userData: { address: string; balance: number }) => void;
}

// Placeholder function to fetch challenge from backend
const fetchChallenge = async (publicKey: string): Promise<string> => {
  // TODO: Implement API call to GET /api/auth/challenge?wallet=[publicKey]
  // Backend must generate a unique, single-use message (nonce) for this user.
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Return dummy challenge message
  return `Welcome to Carepanion! Please sign this message to verify your wallet ownership.\n\nNonce: ${Math.random().toString(36).substring(7)}`;
};

// Placeholder function to verify signature with backend
const verifySignature = async (
  message: string, 
  signature: Uint8Array, 
  publicKey: string
): Promise<{ success: boolean; user?: { address: string; balance: number }; jwt?: string }> => {
  // TODO: Implement API call to POST /api/auth/verify
  // Body should include: { message, signature: base64(signature), publicKey }
  // Backend must verify the signature, create a JWT, fetch user balance, and return session data.
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Return dummy verification result
  return {
    success: true,
    user: {
      address: publicKey,
      balance: 1250
    },
    jwt: 'dummy.jwt.token'
  };
};

const WalletConnectionGate = ({ onWalletConnected }: WalletConnectionGateProps) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const { publicKey, connect, signMessage } = useWallet();
  const { toast } = useToast();

  const handleWalletLogin = async () => {
    setIsConnecting(true);
    
    try {
      // 1. Create a hardcoded, dummy user object.
      const mockUser = {
        address: '5xAbc...789Yz', // A fake, truncated wallet address
        balance: 1250 // A fake token balance
      };

      // 2. Add a TODO comment for future implementation.
      // TODO: This is a mock login. Replace with real Solana Wallet Adapter and SIWS logic.

      // Simulate loading delay
      await new Promise(resolve => setTimeout(resolve, 800));

      toast({
        title: "Login Successful",
        description: `Welcome! Your balance: ${mockUser.balance} CARE`,
      });

      // 3. Immediately call the onWalletConnected prop to proceed.
      onWalletConnected(mockUser);
      
    } catch (error) {
      console.error("Wallet login failed:", error);
      toast({
        variant: "destructive",
        title: "Unexpected Error",
        description: error instanceof Error ? error.message : "An unexpected error occurred.",
      });
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
                onClick={handleWalletLogin}
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
