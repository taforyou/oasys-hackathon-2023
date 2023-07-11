import { CHAIN, getRpcUrl } from 'config/networkSetup'
import { toast } from 'react-toastify'
import { ethers } from 'ethers'
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { SupportProvider } from 'types/provider'
import Web3Modal from 'web3modal'
import { getNetworkConnectors } from 'config/getNetworkData'

export const web3ModalInstance =
	typeof window !== 'undefined' ? new Web3Modal(getNetworkConnectors()) : null

export const createWeb3Modal = () => web3ModalInstance

export const EtherProviderContext = createContext<
	| {
			provider: SupportProvider | undefined
			address: string
			networkId: number
			connectWalletPending: boolean
			connected: boolean
			connectWallet: () => Promise<void>
			disconnectWallet: () => Promise<void>
			web3Modal: Web3Modal
	  }
	| undefined
>(undefined)

// eslint-disable-next-line react/prop-types
const EtherProvider = ({ children }: React.PropsWithChildren<{}>) => {
	const [provider, setProvider] = useState<SupportProvider | undefined>(undefined)
	const [address, setAddress] = useState('')
	const [networkId, setNetworkId] = useState(0)
	const [connectWalletPending, setConnectWalletPending] = useState(false)
	const [connected, setConnected] = useState(false)
	const [web3Modal, setWeb3Modal] = useState<Web3Modal | null>(null)
	useEffect(() => {
		setWeb3Modal(createWeb3Modal())
	}, [])

	useEffect(() => {
		if (process.env.DEV || process.env.NODE_ENV !== 'production') {
			;(window as any).setAddress = setAddress
			;(window as any).ethers = ethers
			;(window as any).provider = provider
		}
	}, [provider])

	const disconnectWallet = useCallback(async () => {
		try {
			if (web3Modal) {
				web3Modal.clearCachedProvider()
			}
			setProvider(undefined)
			setAddress('')
			setConnected(false)
		} catch (e) {
			toast.error(`Disconnect Wallet Error: ${e?.message || e}`)
		}
	}, [web3Modal])

	const connectWallet = useCallback(async () => {
		setConnectWalletPending(true)
		try {
			console.log('start connectWallet')

			const web3Provider = await web3Modal.connect()
			const provider = new ethers.providers.Web3Provider(web3Provider)

			const subscribeProvider = (provider) => {
				if (!provider) {
					return
				}

				provider.on('close', () => {
					disconnectWallet()
				})

				provider.on('disconnect', async () => {
					disconnectWallet()
				})

				provider.on('accountsChanged', async (accounts: string[]) => {
					if (accounts.length > 0) {
						setAddress(ethers.utils.getAddress(accounts[0]))
					} else {
						disconnectWallet()
					}
				})

				provider.on('chainChanged', async () => {
					/* NOTE: Force reload to initate all state */
					if (typeof window !== 'undefined') {
						window.location.reload()
					}
				})
			}
			subscribeProvider(web3Provider)

			const accounts = await provider.listAccounts()
			const address = ethers.utils.getAddress(accounts[0])
			let selectNetworkId = await provider.getNetwork().then((x) => x.chainId)
			if (selectNetworkId === 86) {
				// Trust provider returns an incorrect chainId for BSC.
				selectNetworkId = 56
			}

			if (networkId > 0 && selectNetworkId !== selectNetworkId) {
				if (typeof window !== 'undefined') {
					window.location.reload()
				}
			}

			setProvider(provider)
			setAddress(address)
			setConnected(true)
			setNetworkId(selectNetworkId)
		} catch (e) {
			if (
				e?.indexOf?.('Modal closed by user') > -1 ||
				e?.message?.indexOf?.('User closed modal') > -1 ||
				e?.indexOf?.('SHOULD_CLOSE_SILENTLY') > -1
			) {
			} else if (e?.message?.indexOf?.('No CLV Wallet found') > -1) {
				toast.error(e?.message || e)
			} else {
				toast.error(`Connect Wallet Error: ${e?.message || e}`)
			}
			if (e) {
				console.error(e)
				// throw e
			}
		} finally {
			setConnectWalletPending(false)
		}
	}, [disconnectWallet, networkId, web3Modal])

	return (
		<EtherProviderContext.Provider
			value={{
				provider,
				address,
				networkId,
				connectWalletPending,
				connectWallet,
				disconnectWallet,
				connected,
				web3Modal,
			}}
		>
			{children}
		</EtherProviderContext.Provider>
	)
}

export const useEtherProvider = () => {
	const context = useContext(EtherProviderContext)
	if (context === undefined) {
		throw new Error('useEtherProvider must be used within a EtherProvider')
	}
	return context
}

export default EtherProvider
