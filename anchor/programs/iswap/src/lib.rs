#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;
pub mod instructions;
pub mod states;
use instructions::*;

declare_id!("2vjDGp1wRYdiHeZae7p1h6KphvTMaGZ7RvVZWmN8mvsK");

#[program]
pub mod iswap {
    use super::*;

    pub fn etf_create(ctx: Context<EtfTokenCreate>, args: EtfTokenArgs) -> Result<()> {
        instructions::etf_create::etf_token_create(ctx, args)
    }

    pub fn etf_token_mint<'info>(
        ctx: Context<'_, '_, '_, 'info, EtfTokenTransaction<'info>>,
        lamports: u64,
    ) -> Result<()> {
        instructions::etf_mint::etf_token_mint(ctx, lamports)
    }

    pub fn etf_token_burn<'info>(
        ctx: Context<'_, '_, '_, 'info, EtfTokenTransaction<'info>>,
        lamports: u64,
    ) -> Result<()> {
        instructions::etf_burn::etf_token_burn(ctx, lamports)
    }
}
