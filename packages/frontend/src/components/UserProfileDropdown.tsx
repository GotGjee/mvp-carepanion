import { useState } from "react";
import { ChevronDown, LogOut, Wallet } from "lucide-react";

interface UserProfileDropdownProps {
  walletAddress: string;
  tokenBalance: number;
  onLogout: () => void;
}

const UserProfileDropdown = ({ walletAddress, tokenBalance, onLogout }: UserProfileDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Truncate wallet address for display
  const displayAddress = `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`;

  return (
    <div className="relative">
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 border-2 border-blue-200 transition-all shadow-sm"
      >
        <Wallet className="w-5 h-5 text-blue-600" />
        <div className="text-left">
          <div className="text-sm font-bold text-gray-900">{tokenBalance} CARE</div>
          <div className="text-xs text-gray-600 font-mono">{displayAddress}</div>
        </div>
        <ChevronDown 
          className={`w-4 h-4 text-gray-600 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-white border-2 border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="p-4 border-b border-gray-100">
            <p className="text-xs text-gray-500 mb-1">Wallet Address</p>
            <p className="text-sm font-mono text-gray-900 break-all">{walletAddress}</p>
          </div>
          
          <button
            onClick={() => {
              setIsOpen(false);
              onLogout();
            }}
            className="w-full px-4 py-3 text-left text-red-600 hover:bg-red-50 transition-all flex items-center gap-3"
          >
            <LogOut className="w-4 h-4" />
            <span className="font-medium">Logout</span>
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