#!/bin/bash

echo "🚀 Building Carepanion Solana Program..."

# Build the program
cargo build-bpf

echo "✅ Build complete!"

# Configure for devnet
solana config set --url https://api.devnet.solana.com

echo "📡 Deploying to Devnet..."

# Deploy
solana program deploy target/deploy/carepanion_program.so

echo "✅ Deployment complete!"
echo ""
echo "⚠️  IMPORTANT: Copy the Program ID and update it in:"
echo "   1. src/lib.rs (declare_id! macro)"
echo "   2. Backend .env (SOLANA_PROGRAM_ID)"
echo ""