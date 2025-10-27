import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Heart, Mic, Users, Shield, Globe } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { login } from "@/services/api";

interface WalletConnectionGateProps {
  onWalletConnected: (userData: { 
    address: string; 
    balance: number;
    isNewUser: boolean;
  }) => void;
}

const WalletConnectionGate = ({ onWalletConnected }: WalletConnectionGateProps) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [walletInput, setWalletInput] = useState("");
  const { toast } = useToast();

  const handleWalletLogin = async () => {
    // Validate wallet address input
    const trimmedWallet = walletInput.trim();
    
    if (!trimmedWallet) {
      toast({
        variant: "destructive",
        title: "Wallet Address Required",
        description: "Please enter your Solana wallet address",
      });
      return;
    }

    // Basic validation (Solana addresses are typically 32-44 characters)
    if (trimmedWallet.length < 32) {
      toast({
        variant: "destructive",
        title: "Invalid Wallet Address",
        description: "Please enter a valid Solana wallet address",
      });
      return;
    }

    setIsConnecting(true);
    
    try {
      // Call backend login API
      const response = await login(trimmedWallet);
      
      toast({
        title: "Login Successful",
        description: response.is_new_user 
          ? "Welcome! Please complete your profile." 
          : "Welcome back!",
      });

      // Pass user data to parent component
      onWalletConnected({
        address: trimmedWallet,
        balance: 0, // You can fetch real balance from blockchain if needed
        isNewUser: response.is_new_user
      });
      
    } catch (error) {
      console.error("Wallet login failed:", error);
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: error instanceof Error ? error.message : "Unable to connect to server",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          
          {/* Left Column - Hero Content */}
          <div className="bg-white rounded-3xl shadow-xl p-4 md:p-6 border border-gray-100">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full text-sm font-medium mb-3">
              <Globe className="w-4 h-4" />
              Web3 Data Platform
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Help Build Better Eldercare AI
            </h2>
            <p className="text-base text-gray-600 mb-4">
              Your voice helps companion robots understand comfort, clarity, and emotional nuance—making eldercare more empathetic and effective.
            </p>
            
            {/* Wallet Input */}
            <div className="mb-3">
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Solana Wallet Address
              </label>
              <input
                type="text"
                value={walletInput}
                onChange={(e) => setWalletInput(e.target.value)}
                placeholder="Enter your wallet address (e.g., 5xot9PAtGJgL...)"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-600 focus:outline-none text-sm"
                disabled={isConnecting}
              />
              <p className="text-xs text-gray-500 mt-1">
                For testing: Use any string (e.g., "test_wallet_123")
              </p>
            </div>

            <button
              onClick={handleWalletLogin}
              disabled={isConnecting || !walletInput.trim()}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold text-base hover:shadow-lg transition-all flex items-center justify-center gap-2 mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isConnecting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <Shield className="w-5 h-5" />
                  Login with Wallet
                </>
              )}
            </button>

            <div className="space-y-3">
              <div className="bg-gray-50 rounded-xl p-3">
                <h4 className="font-semibold text-gray-900 mb-1">🌍 Global Impact</h4>
                <p className="text-sm text-gray-600">
                  Starting in Thailand with hospital partners, expanding worldwide to help millions of seniors feel less lonely.
                </p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3">
                <h4 className="font-semibold text-gray-900 mb-1">🔒 Data Security</h4>
                <p className="text-sm text-gray-600">
                  All labels stored securely. No personally identifiable information shared without consent.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Feature Cards */}
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-3xl border-2 border-blue-200">
              <Mic className="w-8 h-8 text-blue-600 mb-2" />
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Label Voice Samples</h3>
              <p className="text-sm text-gray-600">Rate comfort, clarity, and speaking rate in short audio clips</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-3xl border-2 border-purple-200">
              <Users className="w-12 h-12 text-purple-600 mb-4" />
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">Privacy Protected</h3>
              <p className="text-gray-600">Wallet-based authentication without revealing personal identity</p>
            </div>
            <div className="bg-gradient-to-br from-pink-50 to-pink-100 p-4 rounded-3xl border-2 border-pink-200">
              <Heart className="w-12 h-12 text-pink-600 mb-4" />
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">Earn Rewards</h3>
              <p className="text-gray-600">Get tokens for quality contributions to AI training</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletConnectionGate;