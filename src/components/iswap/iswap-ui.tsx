import { ellipsify } from '@wallet-ui/react'
import {
  useIswapAccountsQuery,
  useIswapCloseMutation,
  useIswapDecrementMutation,
  useIswapIncrementMutation,
  useIswapInitializeMutation,
  useIswapProgram,
  useIswapProgramId,
  useIswapSetMutation,
} from './iswap-data-access'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ExplorerLink } from '../cluster/cluster-ui'
import { IswapAccount } from '@project/anchor'
import { ReactNode } from 'react'

export function IswapProgramExplorerLink() {
  const programId = useIswapProgramId()

  return <ExplorerLink address={programId.toString()} label={ellipsify(programId.toString())} />
}

export function IswapList() {
  const iswapAccountsQuery = useIswapAccountsQuery()

  if (iswapAccountsQuery.isLoading) {
    return <span className="loading loading-spinner loading-lg"></span>
  }

  if (!iswapAccountsQuery.data?.length) {
    return (
      <div className="text-center">
        <h2 className={'text-2xl'}>No accounts</h2>
        No accounts found. Initialize one to get started.
      </div>
    )
  }

  return (
    <div className="grid lg:grid-cols-2 gap-4">
      {iswapAccountsQuery.data?.map((iswap) => (
        <IswapCard key={iswap.address} iswap={iswap} />
      ))}
    </div>
  )
}

export function IswapProgramGuard({ children }: { children: ReactNode }) {
  const programAccountQuery = useIswapProgram()

  if (programAccountQuery.isLoading) {
    return <span className="loading loading-spinner loading-lg"></span>
  }

  if (!programAccountQuery.data?.value) {
    return (
      <div className="alert alert-info flex justify-center">
        <span>Program account not found. Make sure you have deployed the program and are on the correct cluster.</span>
      </div>
    )
  }

  return children
}

function IswapCard({ iswap }: { iswap: IswapAccount }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Iswap: {iswap.data.count}</CardTitle>
        <CardDescription>
          Account: <ExplorerLink address={iswap.address} label={ellipsify(iswap.address)} />
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 justify-evenly">
          <IswapButtonIncrement iswap={iswap} />
          <IswapButtonSet iswap={iswap} />
          <IswapButtonDecrement iswap={iswap} />
          <IswapButtonClose iswap={iswap} />
        </div>
      </CardContent>
    </Card>
  )
}

export function IswapButtonInitialize() {
  const mutationInitialize = useIswapInitializeMutation()

  return (
    <Button onClick={() => mutationInitialize.mutateAsync()} disabled={mutationInitialize.isPending}>
      Initialize Iswap {mutationInitialize.isPending && '...'}
    </Button>
  )
}

export function IswapButtonIncrement({ iswap }: { iswap: IswapAccount }) {
  const incrementMutation = useIswapIncrementMutation({ iswap })

  return (
    <Button variant="outline" onClick={() => incrementMutation.mutateAsync()} disabled={incrementMutation.isPending}>
      Increment
    </Button>
  )
}

export function IswapButtonSet({ iswap }: { iswap: IswapAccount }) {
  const setMutation = useIswapSetMutation({ iswap })

  return (
    <Button
      variant="outline"
      onClick={() => {
        const value = window.prompt('Set value to:', iswap.data.count.toString() ?? '0')
        if (!value || parseInt(value) === iswap.data.count || isNaN(parseInt(value))) {
          return
        }
        return setMutation.mutateAsync(parseInt(value))
      }}
      disabled={setMutation.isPending}
    >
      Set
    </Button>
  )
}

export function IswapButtonDecrement({ iswap }: { iswap: IswapAccount }) {
  const decrementMutation = useIswapDecrementMutation({ iswap })

  return (
    <Button variant="outline" onClick={() => decrementMutation.mutateAsync()} disabled={decrementMutation.isPending}>
      Decrement
    </Button>
  )
}

export function IswapButtonClose({ iswap }: { iswap: IswapAccount }) {
  const closeMutation = useIswapCloseMutation({ iswap })

  return (
    <Button
      variant="destructive"
      onClick={() => {
        if (!window.confirm('Are you sure you want to close this account?')) {
          return
        }
        return closeMutation.mutateAsync()
      }}
      disabled={closeMutation.isPending}
    >
      Close
    </Button>
  )
}
