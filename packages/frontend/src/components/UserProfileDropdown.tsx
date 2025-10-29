import { useState } from "react";
import { ChevronDown, LogOut, Wallet } from "lucide-react";
import { useWallet } from "@solana/wallet-adapter-react";

interface UserProfileDropdownProps {
  walletAddress: string;
  tokenBalance: number;
  onLogout: () => void;
}

const UserProfileDropdown = ({ walletAddress, tokenBalance, onLogout }: UserProfileDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { disconnect } = useWallet(); // <-- ใช้สำหรับ disconnect wallet

  // Truncate wallet address
  const displayAddress = `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`;

  // ฟังก์ชัน logout แบบสมบูรณ์
  const handleLogout = async () => {
    setIsOpen(false);

    try {
      // Disconnect wallet จาก Solana provider
      await disconnect();
    } catch (err) {
      console.error("Failed to disconnect wallet:", err);
    }

    // ล้าง state ของแอปเรา
    onLogout();
  };

  return (
    <div className="relative">
      {/* Toggle Button - Soft Neomorphic */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-4 py-2.5 rounded-full bg-white/70 backdrop-blur-sm border-2 border-white/60 shadow-[5px_5px_20px_rgba(160,100,200,0.2),-5px_-5px_20px_rgba(255,255,255,0.8),inset_1px_1px_3px_rgba(255,255,255,0.5)] hover:shadow-[5px_5px_25px_rgba(160,100,200,0.25),-5px_-5px_25px_rgba(255,255,255,0.9)] transition-all duration-300"
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-200 to-purple-300 flex items-center justify-center shadow-[inset_2px_2px_5px_rgba(160,100,200,0.3)]">
          <Wallet className="w-4 h-4 text-purple-600" />
        </div>
        <div className="text-left">
          <div className="text-sm font-bold text-purple-600">{tokenBalance} CARE</div>
          <div className="text-xs text-purple-400 font-mono">{displayAddress}</div>
        </div>
        <ChevronDown 
          className={`w-4 h-4 text-purple-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown Menu - Soft Pastel */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-3 w-72 bg-gradient-to-br from-pink-50/95 via-purple-50/95 to-blue-50/95 backdrop-blur-md border-2 border-white/70 rounded-3xl shadow-[20px_20px_60px_rgba(140,100,180,0.4),-10px_-10px_40px_rgba(255,255,255,0.9),inset_2px_2px_10px_rgba(255,255,255,0.5)] z-50 overflow-hidden">
          <div className="p-5 border-b border-purple-200/30">
            <p className="text-xs text-purple-400 font-semibold mb-2">Wallet Address</p>
            <p className="text-sm font-mono text-purple-600 break-all bg-white/50 rounded-2xl p-3 shadow-[inset_2px_2px_5px_rgba(160,100,200,0.15)]">{walletAddress}</p>
          </div>
          
          <button
            onClick={handleLogout}
            className="w-full px-5 py-4 text-left text-pink-500 hover:bg-white/40 transition-all flex items-center gap-3 font-semibold group"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-100 to-red-100 flex items-center justify-center shadow-[3px_3px_10px_rgba(239,68,68,0.2)] group-hover:shadow-[3px_3px_15px_rgba(239,68,68,0.3)] transition-all">
              <LogOut className="w-4 h-4" />
            </div>
            <span>Disconnect Wallet</span>
          </button>
        </div>
      )}

      {/* Click outside to close */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default UserProfileDropdown;