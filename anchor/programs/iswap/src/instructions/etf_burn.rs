use crate::account_ix::EtfTokenTransaction;
use crate::states::etf_token::*;
use anchor_lang::prelude::*;
use anchor_spl::token::{burn, Burn};
use anchor_spl::{
    associated_token::get_associated_token_address,
    token::{transfer, Transfer},
};
use std::collections::HashMap;

pub fn etf_token_burn<'info>(
    ctx: Context<'_, '_, '_, 'info, EtfTokenTransaction<'info>>,
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

        let from_ata: &AccountInfo<'info> = accounts
            .get(&get_associated_token_address(
                &ctx.accounts.etf_token_info.key(),
                &x.token,
            ))
            .ok_or(TokenMintError::InvalidAccount)?;

        let to_ata = accounts
            .get(&get_associated_token_address(
                &ctx.accounts.authority.key(),
                &x.token,
            ))
            .ok_or(TokenMintError::InvalidAccount)?;

        let amount = x.weight as u64 * lamports / 100;
        let binding = ctx.accounts.etf_token_mint_account.key();
        let signer_seeds: &[&[&[u8]]] = &[&[
            EtfToken::SEEDS_PREFIX.as_bytes(),
            binding.as_ref(),
            &[ctx.bumps.etf_token_info],
        ]];
        // 进行转账
        transfer(
            CpiContext::new_with_signer(
                ctx.accounts.token_program.to_account_info(),
                Transfer {
                    from: from_ata.to_account_info(),
                    to: to_ata.to_account_info(),
                    authority: ctx.accounts.etf_token_info.to_account_info(),
                },
                signer_seeds,
            ),
            amount,
        )?;
    }

    burn(
        CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            Burn {
                mint: ctx.accounts.etf_token_mint_account.to_account_info(),
                from: ctx.accounts.etf_token_ata.to_account_info(),
                authority: ctx.accounts.authority.to_account_info(),
            },
        ),
        lamports,
    )?;
    Ok(())
}
