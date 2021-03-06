import { useAsyncRetry } from 'react-use'
import { useAccount, useBlockNumber } from '@dimensiondev/web3-shared'
import { PluginSnapshotRPC } from '../messages'
import type { ProposalIdentifier } from '../types'
import { useProposal } from './useProposal'

export function usePower(identifier: ProposalIdentifier) {
    const {
        payload: { message },
    } = useProposal(identifier.id)

    const account = useAccount()
    const blockNumber = useBlockNumber()
    return useAsyncRetry(async () => {
        if (!account) return 0
        const scores = await PluginSnapshotRPC.getScores(message, [account], blockNumber)
        return scores[0]![account]!
    }, [blockNumber, account])
}
