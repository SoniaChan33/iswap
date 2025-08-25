import { PublicKey } from "@solana/web3.js";
import { program } from "./const";
import * as anchor from "@coral-xyz/anchor";

export function deriveEtfTokenMintAccount(symbol: string) {
    return anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from("ETF_TOKEN"), Buffer.from(symbol)],
        program.programId
    )
}


// 保证两种参数类型都可以接收
export function deriveEtfInfoAccount(seeds: string | PublicKey) {

    let mintAccount: PublicKey;

    if (typeof seeds === "string") {
        [mintAccount,] = deriveEtfTokenMintAccount(seeds);
    } else {
        mintAccount = seeds;
    }


    return anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from("ETF_TOKEN"), mintAccount.toBuffer()],
        program.programId
    )
}