use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::{
    account_info::{next_account_info, AccountInfo},
    entrypoint,
    entrypoint::ProgramResult,
    msg,
    program::invoke,
    program_error::ProgramError,
    pubkey::Pubkey,
    system_instruction,
    sysvar::{clock::Clock, Sysvar},
};

// Program ID (will be generated after deployment)
solana_program::declare_id!("431uCPYwa2niRi2xpsbvrwmS74wC7gyfAfHkGz8VmkvK");

// Entry point
entrypoint!(process_instruction);

// Instructions
#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub enum CarepanionInstruction {
    /// Record a label submission
    /// 
    /// Accounts expected:
    /// 0. `[writable, signer]` User account (payer)
    /// 1. `[writable]` User stats account (PDA)
    /// 2. `[]` System program
    /// 3. `[]` Clock sysvar
    RecordLabel {
        label_hash: [u8; 32],  // Hash of the label data
        audio_id: u64,          // Audio file ID from backend
    },
}

// User statistics stored on-chain
#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub struct UserStats {
    pub owner: Pubkey,           // User's wallet address
    pub total_labels: u64,       // Total number of labels submitted
    pub last_label_time: i64,    // Unix timestamp of last label
    pub total_rewards_earned: u64, // Total SOL earned (in lamports)
    pub is_initialized: bool,    // Account initialization flag
}

impl UserStats {
    pub const LEN: usize = 32 + 8 + 8 + 8 + 1; // 57 bytes
}

// Main processor
pub fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {
    let instruction = CarepanionInstruction::try_from_slice(instruction_data)
        .map_err(|_| ProgramError::InvalidInstructionData)?;

    match instruction {
        CarepanionInstruction::RecordLabel { label_hash, audio_id } => {
            msg!("Instruction: RecordLabel");
            process_record_label(program_id, accounts, label_hash, audio_id)
        }
    }
}

// Process label recording
fn process_record_label(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    label_hash: [u8; 32],
    audio_id: u64,
) -> ProgramResult {
    let accounts_iter = &mut accounts.iter();
    
    let user_account = next_account_info(accounts_iter)?;
    let user_stats_account = next_account_info(accounts_iter)?;
    let system_program = next_account_info(accounts_iter)?;
    let clock = Clock::from_account_info(next_account_info(accounts_iter)?)?;

    // Verify user is signer
    if !user_account.is_signer {
        return Err(ProgramError::MissingRequiredSignature);
    }

    // Derive PDA for user stats
    let (user_stats_pda, bump_seed) = Pubkey::find_program_address(
        &[b"user_stats", user_account.key.as_ref()],
        program_id,
    );

    // Verify the provided account matches the derived PDA
    if user_stats_pda != *user_stats_account.key {
        msg!("Error: User stats account mismatch");
        return Err(ProgramError::InvalidAccountData);
    }

    // Initialize or update user stats
    let mut user_stats = if user_stats_account.data_is_empty() {
        msg!("Initializing new user stats account");
        
        // Create account
        let rent = solana_program::rent::Rent::default();
        let space = UserStats::LEN;
        let lamports = rent.minimum_balance(space);

        invoke(
            &system_instruction::create_account(
                user_account.key,
                user_stats_account.key,
                lamports,
                space as u64,
                program_id,
            ),
            &[
                user_account.clone(),
                user_stats_account.clone(),
                system_program.clone(),
            ],
        )?;

        UserStats {
            owner: *user_account.key,
            total_labels: 0,
            last_label_time: 0,
            total_rewards_earned: 0,
            is_initialized: true,
        }
    } else {
        UserStats::try_from_slice(&user_stats_account.data.borrow())?
    };

    // Update stats
    user_stats.total_labels += 1;
    user_stats.last_label_time = clock.unix_timestamp;

    // Calculate reward (0.001 SOL = 1,000,000 lamports per label)
    let reward_lamports: u64 = 1_000_000;
    user_stats.total_rewards_earned += reward_lamports;

    // Save updated stats
    user_stats.serialize(&mut &mut user_stats_account.data.borrow_mut()[..])?;

    // Transfer reward to user (from program's account or treasury)
    // Note: For MVP, I fund the program account manually
    // In production, use a treasury PDA
    
    msg!("Label recorded successfully!");
    msg!("Audio ID: {}", audio_id);
    msg!("Label hash: {:?}", label_hash);
    msg!("Total labels by user: {}", user_stats.total_labels);
    msg!("Reward: {} lamports", reward_lamports);

    Ok(())
}