import { useState } from "react";
import { ChevronDown, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UserProfileDropdownProps {
  walletAddress: string;
  tokenBalance: number;
  onLogout: () => void;
}

const UserProfileDropdown = ({ walletAddress, tokenBalance, onLogout }: UserProfileDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-4 py-2 rounded-lg bg-primary/10 hover:bg-primary/20 border border-primary/20 transition-smooth shadow-glow-blue"
      >
        <div className="text-right">
          <div className="text-lg font-bold text-foreground">{tokenBalance.toLocaleString()} CARE</div>
          <div className="text-xs text-muted-foreground">{walletAddress}</div>
        </div>
        <ChevronDown 
          className={`w-4 h-4 text-primary transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-card border border-border rounded-lg shadow-sci-fi z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <Button
            onClick={() => {
              setIsOpen(false);
              onLogout();
            }}
            variant="ghost"
            className="w-full justify-start px-4 py-3 text-foreground hover:bg-primary/10 hover:text-primary transition-smooth"
          >
            <LogOut className="w-4 h-4 mr-3" />
            Logout
          </Button>
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
