use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct EtfToken {
    pub mint_account: Pubkey,
    pub creator: Pubkey,
    pub create_at: i64,

    #[max_len(50)]
    pub descriptor: String,
    #[max_len(10)]
    pub assets: Vec<EtfAsset>,
}

#[account]
#[derive(InitSpace)]
pub struct EtfAsset {
    pub token: Pubkey,
    pub weight: u16,
}

impl EtfToken {
    pub const SEEDS_PREFIX: &'static str = "ETF_TOKEN";
    pub fn new(
        mint_account: Pubkey,
        creator: Pubkey,
        create_at: i64,
        descriptor: String,
        assets: Vec<EtfAsset>,
    ) -> Self {
        Self {
            mint_account,
            creator,
            create_at,
            descriptor,
            assets,
        }
    }
}

impl EtfAsset {
    pub fn new(token: Pubkey, weight: u16) -> Self {
        Self { token, weight }
    }
}
