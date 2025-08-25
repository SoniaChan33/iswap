use std::collections::HashMap;

use crate::states::etf_token::*;
use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::{get_associated_token_address, AssociatedToken},
    token::{self, mint_to, transfer, Mint, MintTo, Token, TokenAccount, Transfer},
};

// 指令参数： 指令，购买etf的数量
pub fn etf_token_mint<'info>(
    ctx: Context<'_, '_, '_, 'info, EtfTokenMintTransaction<'info>>,
    lamports: u64,
) -> Result<()> {
    // 创建账户的映射
    let accounts = ctx
        .remaining_accounts
        .iter()
        .map(|x| (x.key(), x.to_owned()))
        .collect::<HashMap<_, _>>();

    for x in &ctx.accounts.etf_token_info.assets {
        // 获取每个资产的源ATA
        let from_ata = accounts
            .get(&get_associated_token_address(
                &ctx.accounts.authority.key(),
                &x.token,
            ))
            .ok_or(TokenMintError::InvalidAccount)?;

        let to_ata: &AccountInfo<'info> = accounts
            .get(&get_associated_token_address(
                &ctx.accounts.etf_token_info.key(),
                &x.token,
            ))
            .ok_or(TokenMintError::InvalidAccount)?;

        let amount = x.weight as u64 * lamports / 100;

        // 进行转账
        transfer(
            CpiContext::new(
                ctx.accounts.token_program.to_account_info(),
                Transfer {
                    from: from_ata.to_account_info(),
                    to: to_ata.to_account_info(),
                    authority: ctx.accounts.authority.to_account_info(),
                },
            ),
            amount,
        )?;
    }

    let binding = ctx.accounts.etf_token_mint_account.key();
    let signer_seeds: &[&[&[u8]]] = &[&[
        EtfToken::SEEDS_PREFIX.as_bytes(),
        binding.as_ref(),
        &[ctx.bumps.etf_token_info],
    ]];
    mint_to(
        CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            MintTo {
                mint: ctx.accounts.etf_token_mint_account.to_account_info(),
                to: ctx.accounts.etf_token_ata.to_account_info(),
                authority: ctx.accounts.etf_token_info.to_account_info(),
            },
            signer_seeds,
        ),
        lamports,
    )?;
    Ok(())
}

#[derive(Accounts)]
pub struct EtfTokenMintTransaction<'info> {
    #[account(
        seeds = [
            EtfToken::SEEDS_PREFIX.as_bytes(),
            etf_token_mint_account.key().as_ref()
        ],
        bump,
    )]
    pub etf_token_info: Account<'info, EtfToken>,

    #[account(mut)]
    pub etf_token_mint_account: Account<'info, Mint>,

    #[account(
        init_if_needed,
        payer = authority,
        associated_token::mint = etf_token_mint_account,
        associated_token::authority = authority,
    )]
    pub etf_token_ata: Account<'info, TokenAccount>,

    #[account(mut)]
    pub authority: Signer<'info>,

    pub system_program: Program<'info, System>,

    pub token_program: Program<'info, Token>,

    pub associated_token_program: Program<'info, AssociatedToken>,
}
