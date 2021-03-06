import { ECKeyIdentifier, Identifier, PersonaIdentifier } from '@dimensiondev/maskbook-shared'
import { head } from 'lodash-es'
import type { InternalSettings } from '../../settings/createSettings'
import {
    appearanceSettings,
    currentPersonaIdentifier,
    languageSettings,
    disableOpenNewTabInBackgroundSettings,
} from '../../settings/settings'
import { currentTrendingDataProviderSettings } from '../../plugins/Trader/settings'
import { queryMyPersonas } from './IdentityService'
import {
    currentBalanceSettings,
    currentBlockNumberSettings,
    currentAccountSettings,
    currentNetworkSettings,
    currentProviderSettings,
    currentChainIdSettings,
} from '../../plugins/Wallet/settings'
import { Flags } from '../../utils'

function create<T>(settings: InternalSettings<T>) {
    async function get() {
        await settings.readyPromise
        return settings.value
    }
    async function set(val: T) {
        await settings.readyPromise
        settings.value = val
    }
    return [get, set] as const
}
export const [getTheme, setTheme] = create(appearanceSettings)
export const [getLanguage, setLanguage] = create(languageSettings)
export const [getChainId, setChainId] = create(currentChainIdSettings)
export const [getBalance, setBalance] = create(currentBalanceSettings)
export const [getBlockNumber, setBlockNumber] = create(currentBlockNumberSettings)
export const [getTrendingDataSource, setTrendingDataSource] = create(currentTrendingDataProviderSettings)
export const [getAncientPostsCompatibiltyMode, setAncientPostsCompatibiltyMode] = create(
    disableOpenNewTabInBackgroundSettings,
)

export const [getCurrentSelectedWalletProvider, setCurrentSelectedWalletProvider] = create(currentProviderSettings)

export const [getCurrentSelectedWalletNetwork, setCurrentSelectedWalletNetwork] = create(currentNetworkSettings)

export const [getSelectedWalletAddress, setSelectedWalletAddress] = create(currentAccountSettings)

export async function getWalletAllowTestChain() {
    return Flags.wallet_allow_testnet
}

export async function getCurrentPersonaIdentifier(): Promise<PersonaIdentifier | undefined> {
    await currentPersonaIdentifier.readyPromise
    const personas = (await queryMyPersonas())
        .sort((a, b) => (a.createdAt > b.createdAt ? 1 : 0))
        .map((x) => x.identifier)
    const newVal = Identifier.fromString<PersonaIdentifier>(currentPersonaIdentifier.value, ECKeyIdentifier).unwrapOr(
        head(personas),
    )
    if (!newVal) return undefined
    if (personas.find((x) => x.equals(newVal))) return newVal
    if (personas[0]) currentPersonaIdentifier.value = personas[0].toText()
    return personas[0]
}
export async function setCurrentPersonaIdentifier(x: PersonaIdentifier) {
    await currentPersonaIdentifier.readyPromise
    currentPersonaIdentifier.value = x.toText()
}
