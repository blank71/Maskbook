import { useMemo } from 'react'
import { Trade, Pair } from '@uniswap/sdk'
import { toUniswapCurrencyAmount, toUniswapCurrency } from '../../helpers'
import { useChainId } from '@dimensiondev/web3-shared'
import { TradeStrategy } from '../../types'
import { useAllCommonPairs } from './useAllCommonPairs'
import type { FungibleTokenDetailed } from '@dimensiondev/web3-shared'
import { MAX_HOP } from '../../constants'
import { isGreaterThan, isZero } from '@dimensiondev/maskbook-shared'

export function useV2Trade(
    strategy: TradeStrategy = TradeStrategy.ExactIn,
    inputAmount: string,
    outputAmount: string,
    inputToken?: FungibleTokenDetailed,
    outputToken?: FungibleTokenDetailed,
) {
    const isExactIn = strategy === TradeStrategy.ExactIn
    const isTradable = !isZero(inputAmount) || !isZero(outputAmount)
    const { value: pairs, ...asyncResult } = useAllCommonPairs(inputToken, outputToken)
    const bestTradeExactIn = useBestTradeExactIn(inputAmount, inputToken, outputToken, pairs)
    const bestTradeExactOut = useBestTradeExactOut(outputAmount, inputToken, outputToken, pairs)

    if (
        !isTradable ||
        !inputToken ||
        !outputToken ||
        (inputAmount === '0' && isExactIn) ||
        (outputAmount === '0' && !isExactIn)
    )
        return {
            ...asyncResult,
            error: void 0,
            loading: false,
            value: null,
        }
    return {
        ...asyncResult,
        value: isExactIn ? bestTradeExactIn : bestTradeExactOut,
    }
}

export function useBestTradeExactIn(
    amount: string,
    inputToken?: FungibleTokenDetailed,
    outputToken?: FungibleTokenDetailed,
    pairs: Pair[] = [],
) {
    const chainId = useChainId()
    return useMemo(() => {
        if (isGreaterThan(amount, '0') && inputToken && outputToken && pairs.length > 0)
            return (
                Trade.bestTradeExactIn(
                    pairs,
                    toUniswapCurrencyAmount(chainId, inputToken, amount),
                    toUniswapCurrency(chainId, outputToken),
                    {
                        maxHops: MAX_HOP,
                        maxNumResults: 1,
                    },
                )[0] ?? null
            )
        return null
    }, [pairs, amount, chainId, inputToken?.address, outputToken?.address])
}

export function useBestTradeExactOut(
    amount: string,
    inputToken?: FungibleTokenDetailed,
    outputToken?: FungibleTokenDetailed,
    pairs: Pair[] = [],
) {
    const chainId = useChainId()
    return useMemo(() => {
        if (isGreaterThan(amount, '0') && inputToken && outputToken && pairs.length > 0)
            return (
                Trade.bestTradeExactOut(
                    pairs,
                    toUniswapCurrency(chainId, inputToken),
                    toUniswapCurrencyAmount(chainId, outputToken, amount),
                    {
                        maxHops: MAX_HOP,
                        maxNumResults: 1,
                    },
                )[0] ?? null
            )
        return null
    }, [pairs, amount, chainId, inputToken?.address, outputToken?.address])
}
