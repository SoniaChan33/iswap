// Here we export some useful types and functions for interacting with the Anchor program.
import { Account, address, getBase58Decoder, SolanaClient } from 'gill'
import { SolanaClusterId } from '@wallet-ui/react'
import { getProgramAccountsDecoded } from './helpers/get-program-accounts-decoded'
import { Iswap, ISWAP_DISCRIMINATOR, ISWAP_PROGRAM_ADDRESS, getIswapDecoder } from './client/js'
import IswapIDL from '../target/idl/iswap.json'

export type IswapAccount = Account<Iswap, string>

// Re-export the generated IDL and type
export { IswapIDL }

// This is a helper function to get the program ID for the Iswap program depending on the cluster.
export function getIswapProgramId(cluster: SolanaClusterId) {
  switch (cluster) {
    case 'solana:devnet':
    case 'solana:testnet':
      // This is the program ID for the Iswap program on devnet and testnet.
      return address('6z68wfurCMYkZG51s1Et9BJEd9nJGUusjHXNt4dGbNNF')
    case 'solana:mainnet':
    default:
      return ISWAP_PROGRAM_ADDRESS
  }
}

export * from './client/js'

export function getIswapProgramAccounts(rpc: SolanaClient['rpc']) {
  return getProgramAccountsDecoded(rpc, {
    decoder: getIswapDecoder(),
    filter: getBase58Decoder().decode(ISWAP_DISCRIMINATOR),
    programAddress: ISWAP_PROGRAM_ADDRESS,
  })
}
