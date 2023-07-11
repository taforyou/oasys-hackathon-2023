export type EthereumNetwork = {
	chainId: string
	blockExplorerUrls?: string[]
	chainName?: string
	chainShortName?: string
	iconUrls?: string[]
	nativeCurrency?: {
		name: string
		symbol: string
		decimals: number
	}
	rpcUrls?: string[]
}

export const CHAIN = {
	DEFAULT: 55555,
	REI: 55555,
	REI_TESTNET: 55556,
	BSC: 56,
}

export const networkList = [CHAIN.REI]
export const newNetworkList = []

export const networkSettings: {
	[key: number]: EthereumNetwork
} = {
	[CHAIN.REI]: {
		chainId: `0x${parseInt('55555', 10).toString(16)}`,
		chainName: 'REI',
		nativeCurrency: {
			name: 'REI',
			symbol: 'REI',
			decimals: 18,
		},
		rpcUrls: ['https://rei-rpc.moonrhythm.io'],
		blockExplorerUrls: ['https://reiscan.com'],
	},
	[CHAIN.REI_TESTNET]: {
		chainId: `0x${parseInt('55556', 10).toString(16)}`,
		chainName: 'REI Testnet',
		nativeCurrency: {
			name: 'tREI',
			symbol: 'tREI',
			decimals: 18,
		},
		rpcUrls: ['https://rei-testnet-rpc.moonrhythm.io'],
		blockExplorerUrls: ['https://testnet.reiscan.com'],
	},
	[CHAIN.BSC]: {
		chainId: `0x${parseInt('56', 10).toString(16)}`,
		chainName: 'Binance Smart Chain',
		chainShortName: 'BSC',
		nativeCurrency: {
			name: 'Binance Coin',
			symbol: 'BNB',
			decimals: 18,
		},
		rpcUrls: ['https://bsc-dataseed.binance.org'],
		blockExplorerUrls: ['https://bscscan.com/'],
	},
}

const networkTxUrls: { [key: number]: (hash: string) => string } = {
	[CHAIN.REI]: (hash: string) => `${networkSettings[CHAIN.REI]?.blockExplorerUrls?.[0]}/tx/${hash}`,
	[CHAIN.REI_TESTNET]: (hash: string) =>
		`${networkSettings[CHAIN.REI_TESTNET]?.blockExplorerUrls?.[0]}/tx/${hash}`,
}

const networkAddressUrls: { [key: number]: (hash: string) => string } = {
	[CHAIN.REI]: (hash: string) =>
		`${networkSettings[CHAIN.REI]?.blockExplorerUrls?.[0]}/address/${hash}`,
	[CHAIN.REI_TESTNET]: (hash: string) =>
		`${networkSettings[CHAIN.REI_TESTNET]?.blockExplorerUrls?.[0]}/address/${hash}`,
}

const networkTokenUrls: { [key: number]: (hash: string) => string } = {
	[CHAIN.REI]: (hash: string) =>
		`${networkSettings[CHAIN.REI]?.blockExplorerUrls?.[0]}/token/${hash}`,
	[CHAIN.REI_TESTNET]: (hash: string) =>
		`${networkSettings[CHAIN.REI_TESTNET]?.blockExplorerUrls?.[0]}/token/${hash}`,
}

export const getChainLogo = (chainId: number) => {
	switch (chainId) {
		case CHAIN.REI:
		case CHAIN.REI_TESTNET:
			return '/images/chains/REI.png'
		default:
			break
	}
}

export const getChainName = (chainId: number) => networkSettings[chainId]?.chainName || ''

export const getChainShortName = (chainId: number) =>
	networkSettings[chainId]?.chainShortName || getChainName(chainId)

export const getRpcUrl = (chainId: number) => networkSettings[chainId]?.rpcUrls?.[0] || ''

export const getTxUrl = (chainId: number) => networkTxUrls[chainId]

export const getAddressUrl = (chainId: number) => networkAddressUrls[chainId]
