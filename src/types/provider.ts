import { ethers } from 'ethers'

export type SupportProvider =
    | ethers.providers.Web3Provider
    | ethers.providers.JsonRpcProvider

export function isWeb3Provider(
    provider: SupportProvider
): provider is ethers.providers.Web3Provider {
    return provider instanceof ethers.providers.Web3Provider
}

export function isJsonRpcProvider(
    provider: SupportProvider
): provider is ethers.providers.JsonRpcProvider {
    return provider instanceof ethers.providers.JsonRpcProvider
}
