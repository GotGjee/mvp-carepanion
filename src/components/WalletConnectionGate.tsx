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
    <div className="min-h-screen bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Carepanion</h1>
              <p className="text-sm text-gray-600">Empathy-Powered Eldercare AI</p>
            </div>
          </div>
          <Shield className="w-8 h-8 text-blue-600" />
        </div>

        {/* Main Horizontal Layout */}
        <div className="grid grid-cols-2 gap-8 items-start">
          
          {/* Left Column - Hero Content */}
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Globe className="w-4 h-4" />
              Verified by World ID
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Help Build Better Eldercare AI
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Your voice helps companion robots understand comfort, clarity, and emotional nuance—making eldercare more empathetic and effective.
            </p>

            <button
              onClick={handleWalletLogin}
              disabled={isConnecting}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-2xl font-semibold text-lg hover:shadow-lg transition-all flex items-center justify-center gap-2 mb-6"
            >
              {isConnecting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <Shield className="w-5 h-5" />
                  Verify with World ID
                </>
              )}
            </button>

            <div className="space-y-4">
              <div className="bg-gray-50 rounded-2xl p-4">
                <h4 className="font-semibold text-gray-900 mb-2">🌍 Global Impact</h4>
                <p className="text-sm text-gray-600">
                  Starting in Thailand with hospital partners, expanding worldwide to help millions of seniors feel less lonely.
                </p>
              </div>
              <div className="bg-gray-50 rounded-2xl p-4">
                <h4 className="font-semibold text-gray-900 mb-2">🔒 Data Security</h4>
                <p className="text-sm text-gray-600">
                  All labels stored on World Chain. No personally identifiable information shared without consent.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Feature Cards */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-3xl border-2 border-blue-200">
              <Mic className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">Label Voice Samples</h3>
              <p className="text-gray-600">Rate comfort, clarity, and speaking rate in short audio clips</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-8 rounded-3xl border-2 border-purple-200">
              <Users className="w-12 h-12 text-purple-600 mb-4" />
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">Privacy Protected</h3>
              <p className="text-gray-600">World ID verification without revealing personal identity</p>
            </div>
            <div className="bg-gradient-to-br from-pink-50 to-pink-100 p-8 rounded-3xl border-2 border-pink-200">
              <Heart className="w-12 h-12 text-pink-600 mb-4" />
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">Earn Rewards</h3>
              <p className="text-gray-600">Get tokens on World Chain for quality contributions</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletConnectionGate;
