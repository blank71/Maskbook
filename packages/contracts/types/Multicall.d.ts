/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import BN from 'bn.js'
import { ContractOptions } from 'web3-eth-contract'
import { EventLog } from 'web3-core'
import { EventEmitter } from 'events'
import {
    Callback,
    PayableTransactionObject,
    NonPayableTransactionObject,
    BlockType,
    ContractEventLog,
    BaseContract,
} from './types'

interface EventOptions {
    filter?: object
    fromBlock?: BlockType
    topics?: string[]
}

export interface Multicall extends BaseContract {
    constructor(jsonInterface: any[], address?: string, options?: ContractOptions): Multicall
    clone(): Multicall
    methods: {
        getCurrentBlockTimestamp(): NonPayableTransactionObject<string>

        aggregate(calls: [string, string | number[]][]): NonPayableTransactionObject<{
            blockNumber: string
            returnData: string[]
            0: string
            1: string[]
        }>

        getLastBlockHash(): NonPayableTransactionObject<string>

        getEthBalance(addr: string): NonPayableTransactionObject<string>

        getCurrentBlockDifficulty(): NonPayableTransactionObject<string>

        getCurrentBlockGasLimit(): NonPayableTransactionObject<string>

        getCurrentBlockCoinbase(): NonPayableTransactionObject<string>

        getBlockHash(blockNumber: number | string | BN): NonPayableTransactionObject<string>
    }
    events: {
        allEvents(options?: EventOptions, cb?: Callback<EventLog>): EventEmitter
    }
}
