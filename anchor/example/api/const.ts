import * as anchor from "@coral-xyz/anchor";
import { Iswap } from "../../target/types/iswap";

let provider = anchor.AnchorProvider.env();
anchor.setProvider(provider);


const program = anchor.workspace.Iswap as anchor.Program<Iswap>;

export { program, provider };

export function useDefaultWallet() {
    const wallet = anchor.Wallet.local();
    return wallet;
}