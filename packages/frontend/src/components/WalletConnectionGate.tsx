import { useState, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
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
  const { publicKey, connected } = useWallet();
  const { toast } = useToast();

  // Auto-login when wallet is connected
  useEffect(() => {
    if (connected && publicKey) {
      handleWalletLogin();
    }
  }, [connected, publicKey]);

  const handleWalletLogin = async () => {
    if (!publicKey) {
      toast({
        variant: "destructive",
        title: "Wallet Not Connected",
        description: "Please connect your wallet first",
      });
      return;
    }

    setIsConnecting(true);
    
    try {
      const walletAddress = publicKey.toBase58();
      
      // Call backend login API
      const response = await login(walletAddress);
      
      toast({
        title: "Login Successful",
        description: response.is_new_user 
          ? "Welcome! Please complete your profile." 
          : "Welcome back!",
      });

      // Pass user data to parent component
      onWalletConnected({
        address: walletAddress,
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
            
            {/* Wallet Connect Button */}
            <div className="mb-3">
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Connect Your Solana Wallet
              </label>
              
              {/* Custom styled wallet button */}
              <div className="wallet-adapter-button-wrapper">
                <WalletMultiButton className="!w-full !bg-gradient-to-r !from-blue-600 !to-purple-600 !text-white !py-3 !rounded-xl !font-semibold !text-base hover:!shadow-lg !transition-all !flex !items-center !justify-center !gap-2" />
              </div>
              
              {isConnecting && (
                <div className="mt-3 flex items-center justify-center gap-2 text-blue-600">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span className="text-sm">Logging in....</span>
                </div>
              )}
              
              <p className="text-xs text-gray-500 mt-2">
                Supported wallets: Phantom, Solflare, and more
              </p>
            </div>

            <div className="space-y-3 mt-6">
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

      {/* Custom CSS for wallet button */}
      <style>{`
        .wallet-adapter-button-wrapper .wallet-adapter-button {
          width: 100% !important;
          background: linear-gradient(to right, #2563eb, #9333ea) !important;
          border-radius: 0.75rem !important;
          padding: 0.75rem 1rem !important;
          font-weight: 600 !important;
          transition: all 0.2s !important;
        }
        
        .wallet-adapter-button-wrapper .wallet-adapter-button:hover {
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1) !important;
        }
        
        .wallet-adapter-button-wrapper .wallet-adapter-button-start-icon {
          margin-right: 0.5rem !important;
        }
      `}</style>
    </div>
  );
};

export default WalletConnectionGate;