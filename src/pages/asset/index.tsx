import React, { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Tippy from '@tippyjs/react'
import 'tippy.js/dist/tippy.css'
import { ItemsTabs } from '../../components/component'
import Meta from '../../components/Meta'
import { useDispatch } from 'react-redux'
import { sellModalShow, buyModalShow, refreshItem } from '../../redux/counterSlice'
import { useItem } from 'lib/api/useItem'
import { formatAddress, formatDigitNumber } from 'lib/format'
import Loading from 'components/Loading'
import { utils } from 'ethers'
import { CHAIN, getAddressUrl } from 'config/networkSetup'
import { useEtherProvider } from 'components/EtherProvider/EtherProvider'
import { useCancelItem } from 'lib/api/useCancelItem'
import { getSeaport } from 'config/getNetworkData'
import swal from 'lib/swal'
import toast from 'lib/toast'

const Item = () => {
	const dispatch = useDispatch()
	const router = useRouter()
	const { collection: collectionAddress, id } = router.query
	const [imageModal, setImageModal] = useState(false)

	const { address, provider, networkId } = useEtherProvider()

	const { item, isLoading, error, refetchToken } = useItem(
		collectionAddress as string,
		id as string,
	)
	const { cancelItem } = useCancelItem()
	const { collection, sellOrder, owner } = item || {}
	console.log('item', item)

	const handleCancel = useCallback(async () => {
		if (!address || !item.parameters || !item.signature) {
			return
		}
		const isConfirm = await swal.confirm()
		if (!isConfirm) {
			return
		}
		try {
			await cancelItem({
				address: address,
				contractAddress: getSeaport(networkId),
				provider,
				order: {
					parameters: JSON.parse(item.parameters),
					signature: item.signature,
				},
			})
			toast.success('Cancel success')
			dispatch(refreshItem())
		} catch (error) {
			console.error(error)
			const errorMessage = error.message || 'Internal Error'
			toast.error(errorMessage)
		}
	}, [address, cancelItem, dispatch, item, networkId, provider])

	return (
		<>
			<Meta title={`#${id || 'Asset'} | ${collection?.name || ''} | KITSUNE - NFT Marketplace `} />
			{/*  <!-- Item --> */}
			<section className="relative lg:mt-24 lg:pt-24 lg:pb-48 mt-24 pt-12 pb-24">
				<picture className="pointer-events-none absolute inset-0 -z-10 dark:hidden">
					<img src="/images/gradient_light.jpg" alt="gradient" className="h-full" />
				</picture>
				<div className="container">
					{/* <!-- Item --> */}
					{isLoading && !item && <Loading className="my-6" />}
					{error && (
						<div className="bg-reds-100/20 border border-reds-400 text-red px-4 py-3 rounded break-words mb-6">
							{error}
						</div>
					)}
					{item && (
						<div className="md:flex md:flex-wrap" key={item.tokenId}>
							{/* <!-- Image --> */}
							<figure className="mb-8 md:w-2/5 md:flex-shrink-0 md:flex-grow-0 md:basis-auto lg:w-1/2 w-full">
								<button className=" w-full" onClick={() => setImageModal(true)}>
									<img
										src={item.image}
										alt={item.name}
										className="rounded-2xl cursor-pointer  w-full"
									/>
								</button>

								{/* <!-- Modal --> */}
								<div className={imageModal ? 'modal fade show block' : 'modal fade'}>
									<div className="modal-dialog !my-0 flex h-full max-w-4xl items-center justify-center">
										<img
											src={item.image}
											alt={item.name}
											className="w-full h-full rounded-2xl object-contain overflow-hidden"
										/>
									</div>

									<button
										type="button"
										className="btn-close absolute top-6 right-6"
										onClick={() => setImageModal(false)}
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											viewBox="0 0 24 24"
											width="24"
											height="24"
											className="h-6 w-6 fill-white"
										>
											<path fill="none" d="M0 0h24v24H0z" />
											<path d="M12 10.586l4.95-4.95 1.414 1.414-4.95 4.95 4.95 4.95-1.414 1.414-4.95-4.95-4.95 4.95-1.414-1.414 4.95-4.95-4.95-4.95L7.05 5.636z" />
										</svg>
									</button>
								</div>
								{/* <!-- end modal --> */}
							</figure>

							{/* <!-- Details --> */}
							<div className="md:w-3/5 md:basis-auto md:pl-8 lg:w-1/2 lg:pl-[3.75rem]">
								{/* <!-- Collection / Likes / Actions --> */}
								<div className="mb-3 flex">
									{/* <!-- Collection --> */}
									<div className="flex items-center">
										<Link href={`/collection?collection=${collectionAddress}`}>
											<a className="mr-2 p-1 flex items-center gap-2 rounded-full border border-accent hover:bg-light-base dark:hover:bg-accent-dark/20">
												<img src={item.image} alt="collection" className="h-7 w-7 rounded-full" />
												<div className="text-accent text-sm font-bold mr-2">{collection.name}</div>
											</a>
										</Link>
									</div>

									{/* <!-- Likes / Actions --> */}
									<div className="ml-auto flex items-stretch space-x-2 relative">
										{/* <Likes
											like={11}
											classes="dark:bg-jacarta-700 dark:border-jacarta-600 border-jacarta-100 flex items-center space-x-1 rounded-xl border bg-white py-2 px-4"
										/> */}

										{/* <!-- Actions --> */}
										{/* <Auctions_dropdown classes="dark:border-jacarta-600 dark:hover:bg-jacarta-600 border-jacarta-100 dropdown hover:bg-jacarta-100 dark:bg-jacarta-700 rounded-xl border bg-white" /> */}
									</div>
								</div>

								<h1 className="font-display text-jacarta-700 mb-4 text-4xl font-semibold dark:text-white">
									{item.name} #{item.tokenId}
								</h1>
								{sellOrder ? (
									<div className="mb-8 flex items-center space-x-4 whitespace-nowrap">
										<div className="flex items-center">
											<img src="/images/tokens/REI.svg" alt="REI" className=" mr-1 h-4 w-4" />
											<span className="text-green text-sm font-medium tracking-tight">
												{utils.commify(utils.formatEther(sellOrder?.eth_price?.toString()))} REI
											</span>
										</div>
									</div>
								) : null}

								<p className="dark:text-jacarta-300 mb-10">{collection.description}</p>

								{/* <!-- Creator / Owner --> */}
								<div className="mb-8 flex flex-wrap">
									<div className="mr-8 mb-4 flex">
										<div className="flex flex-col justify-center">
											<span className="text-jacarta-400 block text-sm dark:text-white">
												Creator{' '}
												<strong>
													{collection.royalty_per_mille
														? formatDigitNumber(collection.royalty_per_mille / 100)
														: 0}
													% royalties
												</strong>
											</span>
											<a
												className="text-accent block"
												href={getAddressUrl(CHAIN.REI)(collection.payout_address)}
												target="_blank"
												rel="noreferrer"
											>
												<span className="text-sm font-bold">
													{formatAddress(collection.payout_address)}
												</span>
											</a>
										</div>
									</div>
									<div className="mb-4 flex">
										<div className="flex flex-col justify-center">
											<span className="text-jacarta-400 block text-sm dark:text-white">
												Owned by
											</span>
											<a
												className="text-accent block"
												href={getAddressUrl(CHAIN.REI)(item.collection.address)}
												target="_blank"
												rel="noreferrer"
											>
												<span className="text-sm font-bold">{formatAddress(owner)}</span>
											</a>
										</div>
									</div>
								</div>

								{address.toLowerCase() === owner.toLowerCase() ? (
									sellOrder ? (
										<button
											className="bg-accent shadow-accent-volume hover:bg-accent-dark inline-block w-full rounded-full py-3 px-8 text-center font-semibold text-white transition-all"
											onClick={handleCancel}
										>
											Cancel Listing
										</button>
									) : (
										<button
											className="bg-accent shadow-accent-volume hover:bg-accent-dark inline-block w-full rounded-full py-3 px-8 text-center font-semibold text-white transition-all"
											onClick={() =>
												dispatch(
													sellModalShow({
														item,
													}),
												)
											}
										>
											Sell
										</button>
									)
								) : sellOrder ? (
									<button
										className="bg-accent shadow-accent-volume hover:bg-accent-dark inline-block w-full rounded-full py-3 px-8 text-center font-semibold text-white transition-all"
										onClick={() => dispatch(buyModalShow({ item }))}
									>
										Buy now
									</button>
								) : null}
							</div>
							{/* <!-- end details --> */}
						</div>
					)}
					<ItemsTabs item={item} />
				</div>
			</section>
			{/* <!-- end item --> */}

			{/* <More_items /> */}
		</>
	)
}

export default Item
