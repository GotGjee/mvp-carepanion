import json
import os
import hashlib
import struct
from typing import Optional

from solana.rpc.types import TxOpts
from solana.rpc.async_api import AsyncClient
from solana.rpc.commitment import Confirmed
from solana.publickey import PublicKey
from solana.keypair import Keypair
from solana.transaction import Transaction, TransactionInstruction
from dotenv import load_dotenv

load_dotenv()

# Configuration
SOLANA_RPC_URL = os.getenv("SOLANA_RPC_URL", "https://api.devnet.solana.com")
SOLANA_PROGRAM_ID = os.getenv("SOLANA_PROGRAM_ID")
TREASURY_PRIVATE_KEY_ENV = os.getenv("TREASURY_PRIVATE_KEY")

class SolanaService:
    def __init__(self):
        self.client = AsyncClient(SOLANA_RPC_URL, commitment=Confirmed)

        if not SOLANA_PROGRAM_ID:
            print("⚠️ Solana Program ID not configured")

        self.program_id = PublicKey(SOLANA_PROGRAM_ID) if SOLANA_PROGRAM_ID else None

        if TREASURY_PRIVATE_KEY_ENV:
            try:
                private_key_list = json.loads(TREASURY_PRIVATE_KEY_ENV)
                # private_key_list is expected like [int, int, ...] (64 bytes)
                sk_bytes = bytes(private_key_list)
                self.treasury = Keypair.from_secret_key(sk_bytes)
                print(f"✅ Treasury keypair loaded successfully: {self.treasury.public_key}")
            except Exception as e:
                print(f"❌ FAILED TO LOAD TREASURY KEYPAIR from ENV variable")
                print(f"   Error: {e}")
                print("   Generating new treasury keypair as fallback...")
                self.treasury = Keypair()
        else:
            self.treasury = Keypair()
            print(f"⚠️ Generated new treasury keypair: {self.treasury.public_key}")
            print(f"   Please fund this account on devnet")

    def generate_label_hash(self, label_data: dict) -> bytes:
        """Generate SHA-256 hash of label data"""
        data_string = f"{label_data['audio_id']}{label_data['comfort_level']}{label_data['clarity']}{label_data['speaking_rate']}{label_data['perceived_empathy']}{label_data.get('notes', '')}"
        return hashlib.sha256(data_string.encode()).digest()

    def derive_user_stats_pda(self, user_pubkey: PublicKey) -> tuple[PublicKey, int]:
        """Derive PDA for user stats account using solana PublicKey.find_program_address"""
        seeds = [b"user_stats", bytes(user_pubkey)]
        pda, bump = PublicKey.find_program_address(seeds, self.program_id)
        return pda, bump

    async def record_label_on_chain(self, user_wallet: str, label_data: dict) -> Optional[str]:
        """Record label on Solana blockchain using solana-py types"""
        try:
            if not self.program_id:
                print("⚠️  Solana Program ID not configured")
                return None

            user_pubkey = PublicKey(user_wallet)
            label_hash = self.generate_label_hash(label_data)
            user_stats_pda, _ = self.derive_user_stats_pda(user_pubkey)

            # instruction data: 1 byte (instruction id) + 32 bytes hash + 8 bytes audio_id (u64 little-endian)
            instruction_data = struct.pack('B', 0) + label_hash + struct.pack('<Q', int(label_data['audio_id']))

            # Build TransactionInstruction from solana-py
            keys = [
                {"pubkey": self.treasury.public_key, "is_signer": True, "is_writable": True},
                {"pubkey": user_stats_pda, "is_signer": False, "is_writable": True},
                {"pubkey": PublicKey("11111111111111111111111111111111"), "is_signer": False, "is_writable": False},
                {"pubkey": PublicKey("SysvarC1ock11111111111111111111111111111111"), "is_signer": False, "is_writable": False},
            ]

            instr = TransactionInstruction(
                keys=[(k["pubkey"], k["is_signer"], k["is_writable"]) for k in keys],
                program_id=self.program_id,
                data=instruction_data
            )

            # get latest blockhash
            latest_blockhash_resp = await self.client.get_latest_blockhash()
            recent_blockhash = latest_blockhash_resp.value.blockhash

            # Create Transaction, set fee_payer and recent_blockhash
            tx = Transaction()
            tx.add(instr)
            tx.recent_blockhash = recent_blockhash
            tx.fee_payer = self.treasury.public_key

            # Sign transaction with treasury Keypair
            tx.sign(self.treasury)

            # Send transaction
            resp = await self.client.send_transaction(tx, self.treasury, opts=TxOpts(skip_preflight=True))
            signature = getattr(resp, "value", None) or resp
            print(f"✅ Label recorded on-chain: {signature}")
            return str(signature)

        except Exception as e:
            # print full exception for debugging
            print(f"❌ Error recording label on-chain: {e}")
            return None

    async def close(self):
        """Close the RPC client"""
        await self.client.close()

# Global instance
solana_service = SolanaService()
