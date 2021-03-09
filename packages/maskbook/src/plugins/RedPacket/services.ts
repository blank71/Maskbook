import type { RedPacketRecord, RedPacketHistory } from './types'
import { RedPacketMessage } from './messages'
import * as database from './database'
import { getChainId } from '../../extension/background-script/EthereumService'
import * as subgraph from './apis'

export async function discoverRedPacket(record: RedPacketRecord) {
    if (record.contract_version === 1) {
        const txid = await subgraph.getRedPacketTxid(record.id)
        if (!txid) return
        record.id = txid
    }
    database.addRedPacket(record)
    RedPacketMessage.events.redPacketUpdated.sendToAll(undefined)
}

export async function getRedPacketHistory(address: string) {
    const chainId = await getChainId()
    const historys = await subgraph.getRedPacketHistory(address)
    const historysWithPassword = []
    for (const history of historys) {
        const record = await database.getRedPacket(history.txid)
        if (history.chain_id === chainId && record) {
            history.payload.password = history.password = record.password
            history.payload.contract_version = history.contract_version = record.contract_version
            historysWithPassword.push(history)
        }
    }
    return historysWithPassword
}
