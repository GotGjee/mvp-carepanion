import json
import os
import hashlib
import pkg_resources
import struct
from solana.rpc.types import TxOpts
from typing import Optional
from solana.rpc.async_api import AsyncClient
from solana.rpc.commitment import Confirmed
from solders.pubkey import Pubkey
from solders.keypair import Keypair
from solders.system_program import TransferParams, transfer
from solders.transaction import Transaction
from solders.instruction import Instruction, AccountMeta
from solders.hash import Hash
from dotenv import load_dotenv

print("Solders version:", pkg_resources.get_distribution("solders").version)
print("Solana version:", pkg_resources.get_distribution("solana").version)
load_dotenv()

# Configuration
SOLANA_RPC_URL = os.getenv("SOLANA_RPC_URL", "https://api.devnet.solana.com")
SOLANA_PROGRAM_ID = os.getenv("SOLANA_PROGRAM_ID")  
TREASURY_PRIVATE_KEY_ENV = os.getenv("TREASURY_PRIVATE_KEY")  # ตอนนี้เป็น JSON array

class SolanaService:
    def __init__(self):
        self.client = AsyncClient(SOLANA_RPC_URL, commitment=Confirmed)
        
        if not SOLANA_PROGRAM_ID:
            print("⚠️ Solana Program ID not configured")
            
        self.program_id = Pubkey.from_string(SOLANA_PROGRAM_ID) if SOLANA_PROGRAM_ID else None
        
        # --- 💡 โหลด treasury keypair จาก ENV variable แทน path 💡 ---
        if TREASURY_PRIVATE_KEY_ENV:
            try:
                # แปลง JSON array เป็น list ของ int
                private_key_list = json.loads(TREASURY_PRIVATE_KEY_ENV)
                self.treasury = Keypair.from_bytes(private_key_list)
                print(f"✅ Treasury keypair loaded successfully: {self.treasury.pubkey()}")
            except Exception as e:
                print(f"❌ FAILED TO LOAD TREASURY KEYPAIR from ENV variable")
                print(f"   Error: {e}")
                print("   Generating new treasury keypair as fallback...")
                self.treasury = Keypair()
        else:
            self.treasury = Keypair()
            print(f"⚠️ Generated new treasury keypair: {self.treasury.pubkey()}")
            print(f"   Please fund this account on devnet")
    
    def generate_label_hash(self, label_data: dict) -> bytes:
        """Generate SHA-256 hash of label data"""
        data_string = f"{label_data['audio_id']}{label_data['comfort_level']}{label_data['clarity']}{label_data['speaking_rate']}{label_data['perceived_empathy']}{label_data.get('notes', '')}"
        return hashlib.sha256(data_string.encode()).digest()
    
    def derive_user_stats_pda(self, user_pubkey: Pubkey) -> tuple[Pubkey, int]:
        """Derive PDA for user stats account"""
        seeds = [b"user_stats", bytes(user_pubkey)]
        pda, bump = Pubkey.find_program_address(seeds, self.program_id)
        return pda, bump
    
    async def record_label_on_chain(
        self,
        user_wallet: str,
        label_data: dict
    ) -> Optional[str]:
        """Record label on Solana blockchain"""
        try:
            if not self.program_id:
                print("⚠️  Solana Program ID not configured")
                return None
            
            user_pubkey = Pubkey.from_string(user_wallet)
            label_hash = self.generate_label_hash(label_data)
            user_stats_pda, _ = self.derive_user_stats_pda(user_pubkey)
            
            instruction_data = struct.pack('B', 0) + label_hash + struct.pack('<Q', label_data['audio_id'])
            
            instruction = Instruction(
                program_id=self.program_id,
                data=instruction_data,
                accounts=[
                    AccountMeta(pubkey=self.treasury.pubkey(), is_signer=True, is_writable=True),
                    AccountMeta(pubkey=user_stats_pda, is_signer=False, is_writable=True),
                    AccountMeta(pubkey=Pubkey.from_string("11111111111111111111111111111111"), is_signer=False, is_writable=False),
                    AccountMeta(pubkey=Pubkey.from_string("SysvarC1ock11111111111111111111111111111111"), is_signer=False, is_writable=False),
                ]
            )
            
            recent_blockhash_resp = await self.client.get_latest_blockhash()
            recent_blockhash = recent_blockhash_resp.value.blockhash
            
            transaction = Transaction.new_with_payer(
                instructions=[instruction],
                payer=self.treasury.pubkey(),
            )
            transaction.message.recent_blockhash = recent_blockhash
            transaction.sign([self.treasury])
            
            response = await self.client.send_transaction(transaction, opts=TxOpts(skip_preflight=True))
            signature = response.value
            
            print(f"✅ Label recorded on-chain: {signature}")
            return str(signature)
            
        except Exception as e:
            print(f"❌ Error recording label on-chain: {e}")
            return None
    
    async def close(self):
        """Close the RPC client"""
        await self.client.close()

# Global instance
solana_service = SolanaService()
