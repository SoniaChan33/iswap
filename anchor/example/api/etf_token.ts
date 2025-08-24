import { program, provider } from "./const";
import * as anchor from "@coral-xyz/anchor";
import { deriveEtfInfoAccount } from "./address";
import { PublicKey } from "@solana/web3.js";
import { createAssociatedTokenAccountInstruction, getAccount, getAssociatedTokenAddressSync, TokenAccountNotFoundError } from "@solana/spl-token";
export async function createETF(wallet: anchor.Wallet, name: string,
    symbol: string,
    description: string,
    url: string,
    assets: { token: PublicKey, weight: number }[],
) {
    // 获取etfinfo account地址
    const [etfTokenInfoAddress,] = deriveEtfInfoAccount(symbol)

    // 创建一个交易来保证两个创建操作的原子性
    let tx = new anchor.web3.Transaction();
    // 创建ata
    for (const { token, } of assets) {
        const address = await getAssociatedTokenAddressSync(
            token,
            etfTokenInfoAddress,
            true,
        );

        // 如果token account不存在就创建
        try {
            await getAccount(provider.connection, address);
        } catch (e) {
            if (e instanceof TokenAccountNotFoundError) {
                tx.add(createAssociatedTokenAccountInstruction(
                    wallet.payer.publicKey,
                    address,
                    etfTokenInfoAddress,
                    token,
                ));
            }
            console.log("Token account does not exist, creating...");
        }

    }

    tx.add(await program.methods.etfCreate({
        name,
        symbol,
        description,
        url,
        assets
    }).transaction());


    return await anchor.web3.sendAndConfirmTransaction(
        provider.connection,
        tx,
        [wallet.payer],
    );
}