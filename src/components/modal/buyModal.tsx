import { ethers } from 'ethers'
import { toast } from 'react-toastify'
import { useBuyItem } from 'lib/api/useBuyItem'
import Link from 'next/link'
import React, { useCallback, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from 'redux/hooks'
import { buyModalHide, refreshItem } from '../../redux/counterSlice'
import { Confirm_checkout } from '../metamask/Metamask'
import Loading from 'components/Loading'
import { getSeaport } from 'config/getNetworkData'
import { useEtherProvider } from 'components/EtherProvider/EtherProvider'
import { formatAddress, formatDigitNumber } from 'lib/format'
import { formatUnits } from 'ethers/lib/utils'
import { CHAIN, getAddressUrl } from 'config/networkSetup'

const order = {
	parameters: {
		offerer: '0xada286F2d2Cb001b53DeEE492b61D288CfB90a35',
		zone: '0x0000000000000000000000000000000000000000',
		zoneHash: '0x3000000000000000000000000000000000000000000000000000000000000000',
		startTime: '1668411154',
		endTime: '115792089237316195423570985008687907853269984665640564039457584007913129639935',
		orderType: 0,
		offer: [
			{
				item_type: 2,
				token: '0xE0a3711D4286E628998d47beF524C292deFD1719',
				identifierOrCriteria: '1',
				startAmount: '1',
				endAmount: '1',
			},
		],
		consideration: [
			{
				item_type: 0,
				token: '0x0000000000000000000000000000000000000000',
				identifierOrCriteria: '0',
				startAmount: '100000000000000',
				endAmount: '100000000000000',
				recipient: '0xada286f2d2cb001b53deee492b61d288cfb90a35',
			},
		],
		totalOriginalConsiderationItems: 1,
		salt: '0x0000000056cf4dbdf5419f24',
		conduitKey: '0x0000000000000000000000000000000000000000000000000000000000000000',
		counter: 0,
	},
	signature:
		'0x871a3cb17dbec7de3bfcdfba41560c8b5ac0a8d800fe540fbedadca3a9a7cdf2f99cf658cf54efcd653090a01c43e52b851f181784b2787e6c95ecc7a79d151f',
}

const BuyModal = () => {
	const { buyModal, buyModalItem: item } = useAppSelector((state) => state.counter)
	const { buyItem, isLoading, error, clearError } = useBuyItem()
	const dispatch = useAppDispatch()
	const { address, provider, networkId, connected, connectWallet } = useEtherProvider()

	useEffect(() => {
		clearError()

		if (buyModal && !item) {
			toast.error('Something error, please try again')
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [buyModal])

	const submit = useCallback(async () => {
		try {
			if (!address || !item || !provider) {
				return
			}
			const result = await buyItem({
				address: address,
				contractAddress: getSeaport(networkId),
				provider,
				order: {
					parameters: JSON.parse(item.parameters),
					signature: item.signature,
				},
			})
			console.log('result', result)
			toast.success('Buy success')
			dispatch(buyModalHide())
			dispatch(refreshItem())
		} catch (error) {
			console.error(error)
			const errorMessage = error.message || 'Internal Error'
			toast.error(errorMessage)
		}
	}, [address, buyItem, item, dispatch, networkId, provider])
	const handleSubmit = useCallback(
		(event) => {
			event.preventDefault()
			submit()
		},
		[submit],
	)

	if (!item) return null

	return (
		<div>
			{/* <!-- Buy Now Modal --> */}
			<div className={buyModal ? 'modal fade show block' : 'modal fade'}>
				<div className="modal-dialog max-w-2xl">
					<form className="modal-content" onSubmit={handleSubmit}>
						<div className="modal-header">
							<h5 className="modal-title" id="buyNowModalLabel">
								Complete checkout
							</h5>
							<button type="button" className="btn-close" onClick={() => dispatch(buyModalHide())}>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 24 24"
									width="24"
									height="24"
									className="fill-jacarta-700 h-6 w-6 dark:fill-white"
								>
									<path fill="none" d="M0 0h24v24H0z" />
									<path d="M12 10.586l4.95-4.95 1.414 1.414-4.95 4.95 4.95 4.95-1.414 1.414-4.95-4.95-4.95 4.95-1.414-1.414 4.95-4.95-4.95-4.95L7.05 5.636z" />
								</svg>
							</button>
						</div>

						{error && (
							<div className="bg-reds-100/20 border border-reds-400 text-red px-4 py-3 rounded break-words max-h-[100px] overflow-auto mb-6">
								{error}
							</div>
						)}
						{/* <!-- Body --> */}
						{item ? (
							<div className="modal-body p-6">
								<div className="mb-2 flex items-center justify-between">
									<span className="font-display text-jacarta-700 text-sm font-semibold dark:text-white">
										Item
									</span>
									<span className="font-display text-jacarta-700 text-sm font-semibold dark:text-white">
										Subtotal
									</span>
								</div>

								<div className="dark:border-jacarta-600 border-jacarta-100 relative flex items-center border-t border-b py-4">
									<figure className="mr-5 self-start">
										<img src={item.image} alt={item.name} className="rounded-2lg" loading="lazy" />
									</figure>

									<div>
										<Link passHref href={`/collection?collection=${item.collection.address}`}>
											<a className="text-accent text-sm" target="_blank" rel="noreferrer">
												{item.name} #{item.tokenId}
											</a>
										</Link>
										<h3 className="font-display text-jacarta-700 mb-1 text-base font-semibold dark:text-white">
											<a
												className=""
												href={getAddressUrl(CHAIN.REI)(item.collection.payout_address)}
												target="_blank"
												rel="noreferrer"
											>
												{formatAddress(item.collection.payout_address)}
											</a>
										</h3>
										<div className="flex flex-wrap items-center">
											<span className="dark:text-jacarta-300 text-jacarta-500 mr-1 block text-sm">
												Creator Earnings:
												{item.collection.royalty_per_mille
													? formatDigitNumber(item.collection.royalty_per_mille / 100)
													: 0}
												%
											</span>
											<span data-tippy-content="The creator of this collection will receive 5% of the sale total from future sales of this item.">
												<svg
													xmlns="http://www.w3.org/2000/svg"
													viewBox="0 0 24 24"
													width="24"
													height="24"
													className="dark:fill-jacarta-300 fill-jacarta-700 h-4 w-4"
												>
													<path fill="none" d="M0 0h24v24H0z" />
													<path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM11 7h2v2h-2V7zm0 4h2v6h-2v-6z" />
												</svg>
											</span>
										</div>
									</div>

									<div className="ml-auto">
										<span className="mb-1 flex items-center whitespace-nowrap">
											<img src="/images/tokens/REI.svg" alt="REI" className=" mr-1 h-4 w-4" />
											<span className="dark:text-jacarta-100 text-sm font-medium tracking-tight">
												{formatUnits(item.sellOrder.eth_price.toString())} REI
											</span>
										</span>
										{/* <div className="dark:text-jacarta-300 text-right text-sm">$130.82</div> */}
									</div>
								</div>

								{/* <!-- Total --> */}
								<div className="dark:border-jacarta-600 border-jacarta-100 mb-2 flex items-center justify-between border-b py-2.5">
									<span className="font-display text-jacarta-700 hover:text-accent font-semibold dark:text-white">
										Total
									</span>
									<div className="ml-auto">
										<span className="flex items-center whitespace-nowrap">
											<img src="/images/tokens/REI.svg" alt="REI" className=" mr-1 h-4 w-4" />
											<span className="text-green font-medium tracking-tight">
												{formatUnits(item.sellOrder.eth_price.toString())} REI
											</span>
										</span>
										{/* <div className="dark:text-jacarta-300 text-right">$130.82</div> */}
									</div>
								</div>

								{/* <!-- Terms --> */}
								<div className="mt-4 flex items-center space-x-2">
									<input
										type="checkbox"
										id="buy-modal-terms"
										required
										className="checked:bg-accent dark:bg-jacarta-600 text-accent border-jacarta-200 focus:ring-accent/20 dark:border-jacarta-500 h-5 w-5 self-start rounded focus:ring-offset-0"
									/>
									<label
										htmlFor="buy-modal-terms"
										className="dark:text-jacarta-200 text-sm cursor-pointer"
									>
										By checking this box, I agree to {"KITSUNE's"}{' '}
										<Link href="/terms" passHref>
											<a target="_blank" rel="noopener noreferrer" className="text-accent">
												Terms of Service
											</a>
										</Link>
									</label>
								</div>
							</div>
						) : (
							'Not found item'
						)}
						{/* <!-- end body --> */}

						<div className="modal-footer">
							<div className="flex items-center justify-center space-x-4">
								{connected ? (
									<button
										type="submit"
										className="bg-accent shadow-accent-volume hover:bg-accent-dark rounded-full py-3 px-8 text-center font-semibold text-white transition-all"
										disabled={isLoading}
									>
										{isLoading && <Loading className="mr-3" size="small" />}
										Confirm Checkout
									</button>
								) : (
									<button
										className="bg-accent shadow-accent-volume hover:bg-accent-dark rounded-full py-3 px-8 text-center font-semibold text-white transition-all"
										onClick={connectWallet}
									>
										Connnet Wallet
									</button>
								)}
							</div>
						</div>
					</form>
				</div>
			</div>
		</div>
	)
}

export default BuyModal
