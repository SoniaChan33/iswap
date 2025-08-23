import {
  IswapAccount,
  getCloseInstruction,
  getIswapProgramAccounts,
  getIswapProgramId,
  getDecrementInstruction,
  getIncrementInstruction,
  getInitializeInstruction,
  getSetInstruction,
} from '@project/anchor'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import { toast } from 'sonner'
import { generateKeyPairSigner } from 'gill'
import { useWalletUi } from '@wallet-ui/react'
import { useWalletTransactionSignAndSend } from '../solana/use-wallet-transaction-sign-and-send'
import { useClusterVersion } from '@/components/cluster/use-cluster-version'
import { toastTx } from '@/components/toast-tx'
import { useWalletUiSigner } from '@/components/solana/use-wallet-ui-signer'
import { install as installEd25519 } from '@solana/webcrypto-ed25519-polyfill'

// polyfill ed25519 for browsers (to allow `generateKeyPairSigner` to work)
installEd25519()

export function useIswapProgramId() {
  const { cluster } = useWalletUi()
  return useMemo(() => getIswapProgramId(cluster.id), [cluster])
}

export function useIswapProgram() {
  const { client, cluster } = useWalletUi()
  const programId = useIswapProgramId()
  const query = useClusterVersion()

  return useQuery({
    retry: false,
    queryKey: ['get-program-account', { cluster, clusterVersion: query.data }],
    queryFn: () => client.rpc.getAccountInfo(programId).send(),
  })
}

export function useIswapInitializeMutation() {
  const { cluster } = useWalletUi()
  const queryClient = useQueryClient()
  const signer = useWalletUiSigner()
  const signAndSend = useWalletTransactionSignAndSend()

  return useMutation({
    mutationFn: async () => {
      const iswap = await generateKeyPairSigner()
      return await signAndSend(getInitializeInstruction({ payer: signer, iswap }), signer)
    },
    onSuccess: async (tx) => {
      toastTx(tx)
      await queryClient.invalidateQueries({ queryKey: ['iswap', 'accounts', { cluster }] })
    },
    onError: () => toast.error('Failed to run program'),
  })
}

export function useIswapDecrementMutation({ iswap }: { iswap: IswapAccount }) {
  const invalidateAccounts = useIswapAccountsInvalidate()
  const signer = useWalletUiSigner()
  const signAndSend = useWalletTransactionSignAndSend()

  return useMutation({
    mutationFn: async () => await signAndSend(getDecrementInstruction({ iswap: iswap.address }), signer),
    onSuccess: async (tx) => {
      toastTx(tx)
      await invalidateAccounts()
    },
  })
}

export function useIswapIncrementMutation({ iswap }: { iswap: IswapAccount }) {
  const invalidateAccounts = useIswapAccountsInvalidate()
  const signAndSend = useWalletTransactionSignAndSend()
  const signer = useWalletUiSigner()

  return useMutation({
    mutationFn: async () => await signAndSend(getIncrementInstruction({ iswap: iswap.address }), signer),
    onSuccess: async (tx) => {
      toastTx(tx)
      await invalidateAccounts()
    },
  })
}

export function useIswapSetMutation({ iswap }: { iswap: IswapAccount }) {
  const invalidateAccounts = useIswapAccountsInvalidate()
  const signAndSend = useWalletTransactionSignAndSend()
  const signer = useWalletUiSigner()

  return useMutation({
    mutationFn: async (value: number) =>
      await signAndSend(
        getSetInstruction({
          iswap: iswap.address,
          value,
        }),
        signer,
      ),
    onSuccess: async (tx) => {
      toastTx(tx)
      await invalidateAccounts()
    },
  })
}

export function useIswapCloseMutation({ iswap }: { iswap: IswapAccount }) {
  const invalidateAccounts = useIswapAccountsInvalidate()
  const signAndSend = useWalletTransactionSignAndSend()
  const signer = useWalletUiSigner()

  return useMutation({
    mutationFn: async () => {
      return await signAndSend(getCloseInstruction({ payer: signer, iswap: iswap.address }), signer)
    },
    onSuccess: async (tx) => {
      toastTx(tx)
      await invalidateAccounts()
    },
  })
}

export function useIswapAccountsQuery() {
  const { client } = useWalletUi()

  return useQuery({
    queryKey: useIswapAccountsQueryKey(),
    queryFn: async () => await getIswapProgramAccounts(client.rpc),
  })
}

function useIswapAccountsInvalidate() {
  const queryClient = useQueryClient()
  const queryKey = useIswapAccountsQueryKey()

  return () => queryClient.invalidateQueries({ queryKey })
}

function useIswapAccountsQueryKey() {
  const { cluster } = useWalletUi()

  return ['iswap', 'accounts', { cluster }]
}
