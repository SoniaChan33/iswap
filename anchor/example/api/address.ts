import { program } from "./const";
import * as anchor from "@coral-xyz/anchor";

export function deriveEtfTokenMintAccount(symbol: string) {
    return anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from("etf_token"), Buffer.from(symbol)],
        program.programId
    )
}


export function deriveEtfInfoAccount(symbol: string) {
    const [mintAccount,] = deriveEtfTokenMintAccount(symbol);

    return anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from("etf_token"), mintAccount.toBuffer()],
        program.programId
    )
}