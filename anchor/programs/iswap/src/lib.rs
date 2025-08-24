#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;
pub mod instructions;
pub mod states;
use instructions::*;
use states::*;

declare_id!("JAVuBXeBZqXNtS73azhBDAoYaaAFfo4gWXoZe2e7Jf8H");

#[program]
pub mod iswap {
    use super::*;

    pub fn etf_create(ctx: Context<EtfTokenCreate>, args: EtfTokenArgs) -> Result<()> {
        instructions::etf_create::etf_token_create(ctx, args)
    }
}
