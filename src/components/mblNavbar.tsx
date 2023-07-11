import React, { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { closeMblMenu } from '../redux/counterSlice'
import { useSelector, useDispatch } from 'react-redux'
import { useRouter } from 'next/router'
import UserId from './userId'
import { Metamask_comp_text, Metamask_comp_icon } from './metamask/Metamask'
import { socialIcons } from '../data/footer_data'
import { createWeb3Modal, useEtherProvider } from './EtherProvider/EtherProvider'
import { formatAddress } from 'lib/format'
import { CHAIN, networkList, networkSettings } from 'config/networkSetup'
import { switchNetwork } from 'lib/switchNetwork'

const MblNavbar = ({ theme }) => {
	const { mblMenu } = useSelector((state) => state.counter)
	const dispatch = useDispatch()
	const [profileShow, setProfileShow] = useState(false)
	const router = useRouter()
	const [navItemValue, setNavItemValue] = useState(1)
	const [navText, setnavText] = useState('')
	const { connected, address, provider, connectWallet, disconnectWallet, networkId } =
		useEtherProvider()
	const isSupportNetwork = networkList.includes(networkId)
	const handleItemDropdown = (e) => {
		const target = e.target.closest('li')

		if (!target.classList.contains('show')) {
			target.classList.add('show')
		} else {
			target.classList.remove('show')
		}
	}

	const navBarList = [
		{
			name: 'Home',
			href: '/',
		},
		{
			name: 'Recently Listed',
			href: '/listing',
		},
		{
			name: 'Import/Create',
			href: '/import',
		},
		{
			name: 'Wallet',
			href: '/wallet',
		},
	]

	const handleSwitchNetwork = useCallback(() => {
		const network = networkSettings[CHAIN.REI]
		switchNetwork({ provider, network })
	}, [provider])

	return (
		<div
			className={
				mblMenu
					? 'js-mobile-menu dark:bg-jacarta-800 invisible fixed inset-0 z-10 ml-auto items-center bg-white opacity-0 lg:visible lg:relative lg:inset-auto lg:flex lg:bg-transparent lg:opacity-100 dark:lg:bg-transparent nav-menu--is-open'
					: 'js-mobile-menu dark:bg-jacarta-800 invisible fixed inset-0 z-10 ml-auto items-center bg-white opacity-0 lg:visible lg:relative lg:inset-auto lg:flex lg:bg-transparent lg:opacity-100 dark:lg:bg-transparent'
			}
		>
			{/* <!-- Mobile Logo / Menu Close --> */}
			<div className="t-0 dark:bg-jacarta-800 fixed left-0 z-10 flex w-full items-center justify-between bg-white p-6 lg:hidden">
				{/* <!-- Mobile Logo --> */}

				<Link href="/">
					<a>
						<img
							src="/images/logo.svg"
							className="max-h-7 dark:hidden"
							alt="KITSUNE | NFT Marketplace"
						/>

						<img
							src="/images/logo_white.svg"
							alt="KITSUNE | NFT Marketplace"
							className="max-h-7 dark:block hidden"
						/>
					</a>
				</Link>

				{/* <!-- Mobile Menu Close --> */}
				<button
					className="js-mobile-close border-jacarta-100 hover:bg-accent focus:bg-accent group dark:hover:bg-accent ml-2 flex h-10 w-10 items-center justify-center rounded-full border bg-white transition-colors hover:border-transparent focus:border-transparent dark:border-transparent dark:bg-white/[.15]"
					onClick={() => dispatch(closeMblMenu())}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						width="24"
						height="24"
						className="fill-jacarta-700 h-4 w-4 transition-colors group-hover:fill-white group-focus:fill-white dark:fill-white"
					>
						<path fill="none" d="M0 0h24v24H0z"></path>
						<path d="M12 10.586l4.95-4.95 1.414 1.414-4.95 4.95 4.95 4.95-1.414 1.414-4.95-4.95-4.95 4.95-1.414-1.414 4.95-4.95-4.95-4.95L7.05 5.636z"></path>
					</svg>
				</button>
			</div>

			{/* <!-- Mobile Search --> */}
			<form action="search" className="relative mt-24 mb-8 w-full lg:hidden">
				{/* <input type="search" className="text-jacarta-700 placeholder-jacarta-500 focus:ring-accent border-jacarta-100 w-full rounded-2xl border py-3 px-4 pl-10 dark:border-transparent dark:bg-white/[.15] dark:text-white dark:placeholder-white" placeholder="Search"> */}
				<input
					type="search"
					className="text-jacarta-700 placeholder-jacarta-500 focus:ring-accent border-jacarta-100 w-full rounded-2xl border py-3 px-4 pl-10 dark:border-transparent dark:bg-white/[.15] dark:text-white dark:placeholder-white"
					placeholder="Search"
				/>
				<span className="absolute left-0 top-0 flex h-full w-12 items-center justify-center rounded-2xl">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						width="24"
						height="24"
						className="fill-jacarta-500 h-4 w-4 dark:fill-white"
					>
						<path fill="none" d="M0 0h24v24H0z"></path>
						<path d="M18.031 16.617l4.283 4.282-1.415 1.415-4.282-4.283A8.96 8.96 0 0 1 11 20c-4.968 0-9-4.032-9-9s4.032-9 9-9 9 4.032 9 9a8.96 8.96 0 0 1-1.969 5.617zm-2.006-.742A6.977 6.977 0 0 0 18 11c0-3.868-3.133-7-7-7-3.868 0-7 3.132-7 7 0 3.867 3.132 7 7 7a6.977 6.977 0 0 0 4.875-1.975l.15-.15z"></path>
					</svg>
				</span>
			</form>

			{/* <!-- Primary Nav --> */}
			<nav className="navbar w-full">
				<ul className="flex flex-col lg:flex-row">
					{navBarList.map((item) => (
						<li className="group" key={item.name + item.href}>
							<Link href={item.href}>
								<a
									onClick={() => {
										dispatch(closeMblMenu())
									}}
								>
									<button className="text-jacarta-700 font-display hover:text-accent focus:text-accent dark:hover:text-accent dark:focus:text-accent flex items-center justify-between py-3.5 text-base dark:text-white lg:px-5">
										<span className={router.asPath === item.href ? 'text-accent-dark' : ''}>
											{item.name}
										</span>
									</button>
								</a>
							</Link>
						</li>
					))}
				</ul>
			</nav>

			{/* <!-- Mobile Connect Wallet / Socials --> */}
			<div className="mt-10 w-full lg:hidden">
				<button
					onClick={connected ? disconnectWallet : connectWallet}
					className="js-wallet bg-accent shadow-accent-volume hover:bg-accent-dark block w-full rounded-full py-3 px-8 text-center font-semibold text-white transition-all"
				>
					{connected ? formatAddress(address) : 'Connect Wallet'}
				</button>

				<hr className="dark:bg-jacarta-600 bg-jacarta-100 my-5 h-px border-0" />

				{/* <!-- Socials --> */}
				<div className="flex space-x-5 item-center justify-center">
					{socialIcons.map((item) => {
						const { id, href, text } = item
						return (
							<Link href={href} key={id}>
								<a target="_blank" rel="noopener noreferrer" className="group cursor-pointer">
									<svg className="icon group-hover:fill-accent fill-jacarta-300 h-5 w-5 dark:group-hover:fill-white">
										<use xlinkHref={`/icons.svg#icon-${text}`}></use>
									</svg>
								</a>
							</Link>
						)
					})}
				</div>
			</div>

			{/* <!-- Actions --> */}
			<div className="ml-8 hidden lg:flex xl:ml-12">
				{/* <!-- Wallet --> */}

				{connected ? (
					<button
						onClick={disconnectWallet}
						className="js-wallet border-jacarta-100 hover:bg-accent focus:bg-accent group dark:hover:bg-accent hover:text-white active:text-white flex px-6 items-center justify-center rounded-full border bg-white transition-colors hover:border-transparent focus:border-transparent dark:border-transparent dark:bg-white/[.15]"
					>
						<i className="fa-regular fa-wallet"></i>
						<div className="ml-2">{formatAddress(address)}</div>
					</button>
				) : (
					<button
						onClick={connectWallet}
						className="js-wallet border-jacarta-100 hover:bg-accent focus:bg-accent group dark:hover:bg-accent hover:text-white active:text-white flex h-10 w-10 items-center justify-center rounded-full border bg-white transition-colors hover:border-transparent focus:border-transparent dark:border-transparent dark:bg-white/[.15]"
					>
						<i className="fa-regular fa-wallet"></i>
					</button>
				)}

				{connected && !isSupportNetwork ? (
					<button
						onClick={handleSwitchNetwork}
						className={`js-wallet  border-jacarta-100 hover:bg-accent focus:bg-accent group dark:hover:bg-accent hover:text-white active:text-white flex px-6 items-center justify-center rounded-full border bg-white transition-colors hover:border-transparent focus:border-transparent dark:border-transparent dark:bg-white/[.15]
						ml-2 whitespace-nowrap
						${isSupportNetwork ? '' : 'text-red'}
					`}
					>
						<i className="fa fa-circle-nodes"></i>
						<span className="ml-2">
							{isSupportNetwork ? networkSettings[networkId]?.chainName : 'Wrong Network'}
						</span>
					</button>
				) : null}

				{/* <!-- Dark Mode --> */}
				<button
					className="border-jacarta-100 hover:bg-accent focus:bg-accent group dark:hover:bg-accent js-dark-mode-trigger ml-2 flex h-10 w-10 items-center justify-center rounded-full border bg-white transition-colors hover:border-transparent focus:border-transparent dark:border-transparent dark:bg-white/[.15]"
					aria-label="dark"
					onClick={theme}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						width="24"
						height="24"
						className="fill-jacarta-700 dark-mode-light h-4 w-4 transition-colors group-hover:fill-white group-focus:fill-white dark:hidden"
					>
						<path fill="none" d="M0 0h24v24H0z"></path>
						<path d="M11.38 2.019a7.5 7.5 0 1 0 10.6 10.6C21.662 17.854 17.316 22 12.001 22 6.477 22 2 17.523 2 12c0-5.315 4.146-9.661 9.38-9.981z"></path>
					</svg>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						width="24"
						height="24"
						className="fill-jacarta-700 dark-mode-dark hidden h-4 w-4 transition-colors group-hover:fill-white group-focus:fill-white dark:block dark:fill-white"
					>
						<path fill="none" d="M0 0h24v24H0z"></path>
						<path d="M12 18a6 6 0 1 1 0-12 6 6 0 0 1 0 12zM11 1h2v3h-2V1zm0 19h2v3h-2v-3zM3.515 4.929l1.414-1.414L7.05 5.636 5.636 7.05 3.515 4.93zM16.95 18.364l1.414-1.414 2.121 2.121-1.414 1.414-2.121-2.121zm2.121-14.85l1.414 1.415-2.121 2.121-1.414-1.414 2.121-2.121zM5.636 16.95l1.414 1.414-2.121 2.121-1.414-1.414 2.121-2.121zM23 11v2h-3v-2h3zM4 11v2H1v-2h3z"></path>
					</svg>
				</button>
			</div>
		</div>
	)
}

export default MblNavbar
