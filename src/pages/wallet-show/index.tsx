import React, { useCallback, useEffect, useMemo, useState } from 'react'
import Pagination from 'rc-pagination'
import paginationEnLocale from 'rc-pagination/lib/locale/en_US'
import { useRouter } from 'next/router'
import Meta from '../../components/Meta'
import Loading from 'components/Loading'
import { ItemCardContainer } from 'components/collectrions/ItemCard'
import HeadLine from 'components/headLine'
import { useOrderList } from 'lib/api/useOrderList'
import type { Liff } from '@line/liff'
import { useLine } from 'lib/api/useLine'
import { useEtherProvider } from 'components/EtherProvider/EtherProvider'
import { CollectionFilter } from 'types'
import { toast } from 'react-toastify'
import { signAPI } from 'lib/eth/signAPI'

const Collection = () => {
	const router = useRouter()
	const page = +router.query.page || 1
	const slug = router.query.slug
	const isLineLogin = router.query.line === 'true'
	const [shouldConnectAgain, setShouldConnectAgain] = useState(false)
	const { connected, address, connectWallet, provider, networkId } = useEtherProvider()

	const { isLoading: isLineLoading, error: lineError, addWallet } = useLine()

	const connectLine = useCallback(async () => {
		const lineLogin = async () => {
			try {
				setShouldConnectAgain(false)

				const liff = (await import('@line/liff')) as unknown as Liff
				await liff.init({
					liffId: process.env.NEXT_PUBLIC_LIFF_ID,
				})
				if (liff.isLoggedIn()) {
					const lineToken = liff.getAccessToken()
					const userProfile = await liff.getProfile()

					const {
						signature,
						deadline,
					} = await signAPI({
						method: 'line.addWallet',
						domain: 'rnft.reichain.io',
						provider,
						chainId: networkId,
						address,
					})

					await addWallet({
						lineAccessToken: lineToken,
						wallet: address,
						slug,
						chainId: networkId,
						signature,
						deadline,
					})

					const a = new URLSearchParams(window.location.search)
					const b = new URLSearchParams(a.get('liff.state'))

					liff.closeWindow()
					// const isClose = b.get('close') === 'true' || a.get('close') === 'true'
					// if (isClose) {
					// 	liff.closeWindow()
					// }
				} else {
					liff.login()
				}
			} catch (error) {
				setShouldConnectAgain(true)
				if ((error as Error)?.message.includes("User denied message signature")) {
					toast.warning('Connect wallet not success, please sign request again.')
					return
				}
				toast.error('Line Login Error')
				console.log(error)
			}
		}
		if (isLineLogin && address) {
			lineLogin()
		}
	}, [addWallet, address, isLineLogin, slug, provider, networkId])

	useEffect(() => {
		connectLine()
	}, [connectLine])

	const { orderList, paginate, isLoading, error, refetchToken } = useOrderList({
		paginateParams: { page },
	})

	const onChangePage = useCallback(
		(page) => {
			router.push({
				query: { page },
			})
		},
		[router],
	)
	const totalPage = paginate?.next ? paginate?.page + 1 : paginate?.page

	const errors = [error, lineError].filter((i) => i)

	return (
		<>
			<Meta title={`Wallet | KITSUNE - NFT Marketplace `} />

			<section className="relative mt-24 lg:pb-48 pb-24">
				<picture className="pointer-events-none absolute inset-0 -z-10 dark:hidden">
					<img src="/images/gradient_light.jpg" alt="gradient" className="h-full" />
				</picture>

				<div className="container">
					<HeadLine
						text="Wallet"
						classes="font-display text-jacarta-700 py-16 text-center text-4xl font-medium dark:text-white"
						image={undefined}
						pera={undefined}
					/>
					
					{
						!shouldConnectAgain ? (
						<div className="w-full flex justify-center items-center mb-12">
							<button
								className="bg-accent shadow-accent-volume hover:bg-accent-dark rounded-full py-3 px-8 text-center font-semibold text-white transition-all"
								onClick={connectLine}
							>
								Connnet Line
							</button>
						</div>
						) : null
					}

					{/* <!-- Collection --> */}
					{isLoading && !orderList && <Loading className="my-6" />}
					{errors.length
						? errors.map((item, index) => (
								<div
									className="bg-reds-100/20 border border-reds-400 text-red px-4 py-3 rounded break-words mb-6"
									key={index}
								>
									{item}
								</div>
						  ))
						: null}
					{!isLoading && orderList.length === 0 && (
						<div className="bg-accent-lighter/10 text-jacarta-600 border-accent-lighter border  px-4 py-3 rounded break-words mb-6">
							No Result
						</div>
					)}
					{connected ? (
						<>
							<div className="grid grid-cols-1 gap-[1.875rem] md:grid-cols-2 lg:grid-cols-4">
								{orderList &&
									orderList.map((item) => (
										<ItemCardContainer
											key={item.address + item.token_id}
											tokenId={item.token_id}
											collectionAddress={item.address}
											filterList={[CollectionFilter.MyOwn]}
											hideIfError
										/>
									))}
							</div>
							<div className="flex justify-center items-center mt-8">
								<Pagination
									onChange={onChangePage}
									current={page}
									pageSize={1}
									total={totalPage}
									locale={paginationEnLocale}
								/>
							</div>
						</>
					) : (
						<div className="w-full flex justify-center items-center">
							<button
								className="bg-accent shadow-accent-volume hover:bg-accent-dark rounded-full py-3 px-8 text-center font-semibold text-white transition-all"
								onClick={connectWallet}
							>
								Connnet Wallet
							</button>
						</div>
					)}
					{/* <!-- end Collection --> */}
				</div>
			</section>
		</>
	)
}

export default Collection
