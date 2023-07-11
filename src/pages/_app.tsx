import '../styles/globals.css'
import '../styles/main.scss'
import 'react-toastify/dist/ReactToastify.min.css'
import 'rc-pagination/assets/index.css'
import { ToastContainer } from 'react-toastify'
import { ThemeProvider } from 'next-themes'
import Layout from '../components/layout'
import { Provider } from 'react-redux'
import { store } from '../redux/store'
import { useRouter } from 'next/router'
import { MetaMaskProvider } from 'metamask-react'
import Meta from '../components/Meta'
import UserContext from '../components/UserContext'
import { useRef } from 'react'
import EtherProvider from 'components/EtherProvider/EtherProvider'

function MyApp({ Component, pageProps }) {
	const router = useRouter()
	const pid = router.asPath
	const scrollRef = useRef({
		scrollPos: 0,
	})

	return (
		<>
			<Meta title="Home 1 | KITSUNE - NFT Marketplace" />

			<Provider store={store}>
				<EtherProvider>
					<ThemeProvider enableSystem={true} attribute="class">
						<MetaMaskProvider>
							<UserContext.Provider value={{ scrollRef: scrollRef }}>
								{pid === '/login' ? (
									<Component {...pageProps} />
								) : (
									<Layout>
										<Component {...pageProps} />
									</Layout>
								)}
							</UserContext.Provider>
						</MetaMaskProvider>
					</ThemeProvider>
				</EtherProvider>
			</Provider>
			<ToastContainer />
		</>
	)
}

export default MyApp
