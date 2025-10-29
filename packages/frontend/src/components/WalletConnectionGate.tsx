import { useState, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { Loader2, Heart, Mic, Users, Shield, Globe } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { login } from "@/services/api";
import logo from "../assets/carepanion-logo1.png";

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
    <div className="fixed inset-0 w-full h-full bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 flex items-center justify-center p-6 overflow-auto">
      <div className="w-full max-w-xl my-auto">

        <div className="bg-white/60 backdrop-blur-sm rounded-[3rem] p-12 shadow-[20px_20px_60px_rgba(140,100,180,0.5),-20px_-20px_60px_rgba(255,255,255,0.95)] border-2 border-white/70">
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-pink-200 to-purple-300 rounded-full flex items-center justify-center shadow-[inset_5px_5px_15px_rgba(160,100,200,0.4),inset_-5px_-5px_15px_rgba(255,255,255,0.9)]">
               <img src={logo} alt="Project Logo" className="object-contain w-[130%] h-[130%]"/>
            </div>
          </div>

 
          <h1 className="text-4xl font-bold text-center mb-3 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 bg-clip-text text-transparent">
            Carepanion
          </h1>


          <p className="text-center text-purple-500 text-sm font-medium mb-8">
            Empathy-Powered Eldercare AI
          </p>

  
          <div className="bg-white/50 rounded-3xl p-6 mb-8 shadow-[inset_5px_5px_15px_rgba(160,100,200,0.25),inset_-5px_-5px_15px_rgba(255,255,255,0.6)] border border-purple-200/30">
            <h2 className="text-xl font-semibold text-purple-600 mb-3 text-center">
              Help Build Better Eldercare AI
            </h2>
            <p className="text-purple-600/90 text-center text-sm leading-relaxed">
              Your voice helps companion robots understand comfort, clarity, and
              emotional nuance—making eldercare more empathetic and effective.
            </p>
          </div>

  
          <div className="space-y-4">
            <label className="block text-center text-purple-600 font-semibold text-sm mb-4">
              Connect Your Solana Wallet
            </label>

         
            <div className="w-full flex">
              <div className="relative w-full flex">
                <div className="absolute -inset-1 bg-gradient-to-r from-pink-300 via-purple-300 to-blue-300 rounded-full blur-xl opacity-60"></div>
                <div className="relative w-full bg-white/60 rounded-full shadow-[10px_10px_30px_rgba(140,100,180,0.4),-10px_-10px_30px_rgba(255,255,255,0.9)] p-1 flex">
                  <WalletMultiButton className="w-full" />
                </div>
              </div>
            </div>

            {isConnecting && (
              <div className="flex items-center justify-center gap-2 text-purple-500 mt-4">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="text-sm font-medium">Logging in...</span>
              </div>
            )}

            <p className="text-xs text-purple-500/70 text-center mt-4 font-medium">
              Supported wallets: Phantom, Solflare, and more
            </p>
          </div>
        </div>

        <p className="text-center text-purple-600/70 text-xs mt-6 font-medium">
          Web3 Data Platform for Eldercare AI Training
        </p>
      </div>

  
      <style>{`
        /* ===== WALLET BUTTON - FULL WIDTH 100% ===== */
        .wallet-adapter-button-trigger {
          width: 100% !important;
          min-width: 100% !important;
          max-width: 100% !important;
          display: flex !important;
          flex: 1 !important;
          overflow: hidden !important;    
          white-space: nowrap !important;
          text-overflow: ellipsis !important; 
        }

        .wallet-adapter-button {
          max-width: 281% !important;
          width: 280% !important;
          min-width: 100% !important;
          flex: 1 !important;
          background: linear-gradient(to right, #f9a8d4, #c084fc, #93c5fd) !important;
          border: none !important;
          font-weight: 600 !important;
          padding: 1.1rem 2rem !important;
          border-radius: 9999px !important;
          box-shadow: inset 2px 2px 5px rgba(255,255,255,0.5), inset -2px -2px 5px rgba(160,100,200,0.3) !important;
          transition: all 0.3s ease !important;
          color: white !important;
          font-size: 1rem !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          text-align: center !important;
          overflow: hidden !important;    
          white-space: nowrap !important;
          text-overflow: ellipsis !important; 
        }

        @media (max-width: 640px) {
          .wallet-adapter-button {
            width: 198% !important;
          }
        }

        .wallet-adapter-button:not([disabled]):hover {
          transform: scale(0.98);
          box-shadow: inset 4px 4px 10px rgba(160,100,200,0.4), inset -4px -4px 10px rgba(255,255,255,0.6) !important;
        }

        .wallet-adapter-button-start-icon {
          margin-right: 0.75rem !important;
          display: inline-flex !important;
        }

        /* ===== WALLET MODAL - CUSTOM SOFT UI ===== */
        /* Modal Backdrop - TRUE CENTER */
        .wallet-adapter-modal-wrapper {
          position: fixed !important;
          left: 37%; !important;
          width: 100% !important;
          height: 35% !important;
          z-index: 9999 !important;
          background: rgba(200, 180, 220, 0.5) !important;
          backdrop-filter: blur(10px) !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          padding: 1rem !important;
          border-top-left-radius: 2rem !important; 
          border-top-right-radius: 2rem !important;
          border-bottom-left-radius: 2rem !important; 
          border-bottom-right-radius: 2rem !important;
        }

        /* Modal Container - Compact Size, Centered, Auto Height */
        .wallet-adapter-modal {
          background: linear-gradient(135deg, rgba(255, 240, 250, 0.98), rgba(243, 232, 255, 0.98)) !important;
          border-radius: 1.75rem !important;
          padding: 1.5rem !important;
          width: fit-content !important;  
          height: fit-content !important; 
          max-width: 90vw !important;  
          max-height: 80vh !important; 
          min-width: auto !important;
          min-height: auto !important;
          box-shadow: 20px 20px 60px rgba(140, 100, 180, 0.5), -20px -20px 60px rgba(255, 255, 255, 0.9), inset 2px 2px 10px rgba(255, 255, 255, 0.6) !important;
          border: 2px solid rgba(255, 255, 255, 0.7) !important;
          position: static !important;
          margin: 0 auto !important;
          left: auto !important;
          right: auto !important;
          top: auto !important;
          bottom: auto !important;
          transform: none !important;
        }

        /* Hide the title "Connect a wallet..." */
        .wallet-adapter-modal-title {
          display: none !important;
        }

        /* Close Button */
        .wallet-adapter-modal-button-close {
          position: absolute !important;
          top: 1rem !important;
          right: 1rem !important;
          background: rgba(255, 255, 255, 0.8) !important;
          border-radius: 50% !important;
          width: 2rem !important;
          height: 2rem !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          box-shadow: 5px 5px 15px rgba(160, 100, 200, 0.3), -5px -5px 15px rgba(255, 255, 255, 0.8) !important;
          transition: all 0.2s ease !important;
          border: none !important;
          padding: 0 !important;
          cursor: pointer !important;
        }

        .wallet-adapter-modal-button-close:hover {
          background: rgba(255, 255, 255, 0.95) !important;
          transform: scale(0.95) !important;
        }

        .wallet-adapter-modal-button-close svg {
          width: 1rem !important;
          height: 1rem !important;
          color: #9333ea !important;
        }

        /* Wallet List - Compact */
        .wallet-adapter-modal-list {
          margin: 0 !important;
          padding: 0 !important;
          display: flex !important;
          flex-direction: column !important;
          gap: 0.65rem !important;
          list-style: none !important;
          max-height: none !important;
          overflow-y: visible !important;
        }

        .wallet-adapter-modal-list-more {
          display: none !important;
        }

        /* Individual Wallet Items */
        .wallet-adapter-modal-list li {
          margin: 0 !important;
          padding: 0 !important;
          list-style: none !important;
          width: 100% !important;
        }

        /* Individual Wallet Button - Compact */
        .wallet-adapter-modal-list .wallet-adapter-button {
          width: 100% !important;
          background: rgba(255, 255, 255, 0.85) !important;
          border-radius: 1rem !important;
          padding: 0.9rem 1.25rem !important;
          display: flex !important;
          align-items: center !important;
          justify-content: flex-start !important;
          gap: 0.85rem !important;
          box-shadow: 5px 5px 20px rgba(160, 100, 200, 0.25), -5px -5px 20px rgba(255, 255, 255, 0.8), inset 1px 1px 3px rgba(255, 255, 255, 0.6) !important;
          transition: all 0.25s ease !important;
          color: #7c3aed !important;
          font-weight: 600 !important;
          font-size: 0.95rem !important;
          border: none !important;
          text-align: left !important;
          cursor: pointer !important;
        }

        .wallet-adapter-modal-list .wallet-adapter-button:hover {
          background: rgba(255, 255, 255, 0.95) !important;
          transform: translateY(-2px) !important;
          box-shadow: 5px 5px 25px rgba(160, 100, 200, 0.35), -5px -5px 25px rgba(255, 255, 255, 0.9), inset 1px 1px 3px rgba(255, 255, 255, 0.7) !important;
        }

        /* Wallet Icon */
        .wallet-adapter-modal-list .wallet-adapter-button-start-icon {
          width: 2.5rem !important;
          height: 2.5rem !important;
          margin: 0 !important;
          flex-shrink: 0 !important;
        }

        .wallet-adapter-modal-list .wallet-adapter-button-start-icon img {
          width: 100% !important;
          height: 100% !important;
          border-radius: 0.5rem !important;
        }

        /* Wallet Name Text */
        .wallet-adapter-modal-middle {
          flex: 1 !important;
          text-align: left !important;
          font-size: 1rem !important;
          color: #7c3aed !important;
          font-weight: 600 !important;
        }

        /* "Detected" Badge - Beautiful Gradient */
        .wallet-adapter-modal-list .wallet-adapter-button-end-icon {
          margin-left: auto !important;
          background: linear-gradient(135deg, #f9a8d4 0%, #d8b4fe 50%, #c084fc 100%) !important;
          color: white !important;
          padding: 0.4rem 1rem !important;
          border-radius: 9999px !important;
          font-size: 0.7rem !important;
          font-weight: 700 !important;
          text-transform: uppercase !important;
          letter-spacing: 0.05em !important;
          flex-shrink: 0 !important;
          box-shadow: 0 2px 8px rgba(192, 132, 252, 0.4) !important;
        }

        /* Remove any extra content */
        .wallet-adapter-modal-list .wallet-adapter-button::after,
        .wallet-adapter-modal-list .wallet-adapter-button::before {
          display: none !important;
          content: none !important;
        }

        /* Collapse/Expand buttons */
        .wallet-adapter-collapse {
          display: none !important;
        }

        /* Ensure modal is always centered */
        .wallet-adapter-modal-container {
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          width: 100% !important;
          height: 100% !important;
        }

        /* Remove any margins that might offset the modal */
        .wallet-adapter-modal-wrapper > * {
          margin: 0 !important;
        }
      `}</style>
    </div>
  );
};

export default WalletConnectionGate;