import { EthereumNetwork } from 'config/networkSetup'
import { ethers } from 'ethers'
import { SupportProvider } from 'types/provider'
import toast from './toast'

interface SwitchNetwork {
	provider: SupportProvider
	network: EthereumNetwork
}

export const switchNetwork = async ({ provider, network }: SwitchNetwork) => {
	try {
		await provider.send('wallet_switchEthereumChain', [{ chainId: network.chainId }])
	} catch (switchError) {
		const errorCode = switchError.code || switchError.data?.originalError?.code
		if (errorCode === 4902 || errorCode === -32603) {
			try {
				const addNetwork = {
					chainId: network.chainId,
					blockExplorerUrls: network.blockExplorerUrls,
					chainName: network.chainName,
					iconUrls: network.iconUrls,
					nativeCurrency: network.nativeCurrency
						? {
								name: network.nativeCurrency?.name,
								symbol: network.nativeCurrency?.symbol,
								decimals: network.nativeCurrency?.decimals,
						  }
						: undefined,
					rpcUrls: network.rpcUrls,
				}

				await provider.send('wallet_addEthereumChain', [addNetwork])
			} catch (addError) {
				toast.error(`Add network error: ${addError?.message || addError}`)
			}
		} else {
			toast.error(`Switch network error: You may need to switch from your wallet by yourself. \n
            [${switchError.code || ''}  ${switchError?.message || switchError}]`)
		}
	}
}
