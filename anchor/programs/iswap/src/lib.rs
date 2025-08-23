#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

declare_id!("JAVuBXeBZqXNtS73azhBDAoYaaAFfo4gWXoZe2e7Jf8H");

#[program]
pub mod iswap {
    use super::*;

    pub fn close(_ctx: Context<CloseIswap>) -> Result<()> {
        Ok(())
    }

    pub fn decrement(ctx: Context<Update>) -> Result<()> {
        ctx.accounts.iswap.count = ctx.accounts.iswap.count.checked_sub(1).unwrap();
        Ok(())
    }

    pub fn increment(ctx: Context<Update>) -> Result<()> {
        ctx.accounts.iswap.count = ctx.accounts.iswap.count.checked_add(1).unwrap();
        Ok(())
    }

    pub fn initialize(_ctx: Context<InitializeIswap>) -> Result<()> {
        Ok(())
    }

    pub fn set(ctx: Context<Update>, value: u8) -> Result<()> {
        ctx.accounts.iswap.count = value.clone();
        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializeIswap<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,

    #[account(
  init,
  space = 8 + Iswap::INIT_SPACE,
  payer = payer
    )]
    pub iswap: Account<'info, Iswap>,
    pub system_program: Program<'info, System>,
}
#[derive(Accounts)]
pub struct CloseIswap<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,

    #[account(
  mut,
  close = payer, // close account and return lamports to payer
    )]
    pub iswap: Account<'info, Iswap>,
}

#[derive(Accounts)]
pub struct Update<'info> {
    #[account(mut)]
    pub iswap: Account<'info, Iswap>,
}

#[account]
#[derive(InitSpace)]
pub struct Iswap {
    count: u8,
}
