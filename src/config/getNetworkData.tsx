import WalletConnectProvider from '@walletconnect/web3-provider'
import { CHAIN, networkSettings } from 'config/networkSetup'
import { constants } from 'ethers'
import { connectors, ICoreOptions } from 'web3modal'

export const getNetworkConnectors = (): Partial<ICoreOptions> => {
	const rpcObj = Object.fromEntries(
		Object.entries(networkSettings).map(([networkID, settings]) => [
			networkID,
			(settings.rpcUrls && settings.rpcUrls[0]) || '',
		]),
	)
	return {
		network: 'binance',
		cacheProvider: true,
		providerOptions: {
			// injected: {
			//     package: 'injected',
			//     // display: {
			//     //     name: 'Meta',
			//     //     description: 'Browse rWallet',
			//     // },
			// },
			walletconnect: {
				package: WalletConnectProvider,
				options: {
					rpc: rpcObj,
				},
			},
		},
	}
}

export const getSeaport = (networkId: number) => {
	switch (networkId) {
		case CHAIN.REI:
			return '0x070CaAeac85CCaA7E8DCd88421904C2259Abed34'
		default:
			return constants.AddressZero
	}
}
