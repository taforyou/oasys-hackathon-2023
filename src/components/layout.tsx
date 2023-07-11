import Navbar from './navbar'
import Footer from './footer'
import Wallet_modal from './modal/wallet_modal'
import BidsModal from './modal/bidsModal'
import BuyModal from './modal/buyModal'
import SellModal from './modal/sellModal'
import { useEffect } from 'react'
import { useEtherProvider } from './EtherProvider/EtherProvider'

export default function Layout({ children }) {
	const { connectWallet, provider, web3Modal } = useEtherProvider()

	useEffect(() => {
		;(async () => {
			if (provider) {
				// already initalized provider
				return
			}

			if (web3Modal) {
				// connectGuestWallet()

				if (web3Modal.cachedProvider || window.ethereum) {
					try {
						await connectWallet()
						return // connect wallet successfully
					} catch (e) {}
				}
			}
		})()
	}, [web3Modal, connectWallet, provider])

	return (
		<>
			<Navbar />
			<Wallet_modal />
			<BidsModal />
			<BuyModal />
			<SellModal />
			<main>{children}</main>
			<Footer />
		</>
	)
}
