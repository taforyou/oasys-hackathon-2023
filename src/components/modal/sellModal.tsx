import { Seaport } from '@opensea/seaport-js'
import { ItemType } from '@opensea/seaport-js/lib/constants'
import { ethers } from 'ethers'
import Link from 'next/link'
import { toast } from 'react-toastify'
import React, { useCallback, useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from 'redux/hooks'
import { refreshItem, sellModalHide } from '../../redux/counterSlice'
import Loading from 'components/Loading'
import { useSellItem } from 'lib/api/useSellItem'
import { useEtherProvider } from 'components/EtherProvider/EtherProvider'
import { getSeaport } from 'config/getNetworkData'

const BidsModal = () => {
	const { sellModal, sellModalItem } = useAppSelector((state) => state.counter)
	const { sellItem, isLoading, error, clearError } = useSellItem()
	const { address, provider, networkId, connected, connectWallet } = useEtherProvider()
	const dispatch = useAppDispatch()
	const [form, setForm] = useState({
		price: 0.05,
	})

	useEffect(() => {
		clearError()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [sellModal])

	const submit = useCallback(async () => {
		if (!sellModalItem) {
			return
		}

		try {
			const result = await sellItem({
				address: address,
				contractAddress: getSeaport(networkId),
				provider,
				collectionAddress: sellModalItem?.collection?.address,
				tokenId: sellModalItem?.tokenId,
				amount: ethers.utils.parseEther(form.price.toString()),
			})
			console.log('result', result)
			toast.success('Sell success')
			dispatch(sellModalHide())
			dispatch(refreshItem())
		} catch (error) {
			console.error(error)
			const errorMessage = error.message || 'Internal Error'
			toast.error(errorMessage)
		}
	}, [address, dispatch, form.price, networkId, provider, sellItem, sellModalItem])
	const handleSubmit = useCallback(
		(event) => {
			event.preventDefault()
			submit()
		},
		[submit],
	)
	return (
		<div>
			<div className={sellModal ? 'modal fade show block' : 'modal fade'}>
				<div className="modal-dialog max-w-2xl">
					<form className="modal-content" onSubmit={handleSubmit}>
						<div className="modal-header">
							<h5 className="modal-title" id="placeBidLabel">
								Sell NFT
							</h5>
							<button
								type="button"
								className="btn-close"
								onClick={() => !isLoading && dispatch(sellModalHide())}
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 24 24"
									width="24"
									height="24"
									className="fill-jacarta-700 h-6 w-6 dark:fill-white"
								>
									<path fill="none" d="M0 0h24v24H0z"></path>
									<path d="M12 10.586l4.95-4.95 1.414 1.414-4.95 4.95 4.95 4.95-1.414 1.414-4.95-4.95-4.95 4.95-1.414-1.414 4.95-4.95-4.95-4.95L7.05 5.636z"></path>
								</svg>
							</button>
						</div>

						{error && (
							<div className="bg-reds-100/20 border border-reds-400 text-red px-4 py-3 rounded break-words max-h-[100px] overflow-auto mb-6">
								{error}
							</div>
						)}
						{/* <!-- Body --> */}
						<div className="modal-body p-6">
							<div className="mb-2 flex items-center justify-between">
								<span className="font-display text-jacarta-700 text-sm font-semibold dark:text-white">
									Price
								</span>
							</div>

							<div className="dark:border-jacarta-600 border-jacarta-100 relative mb-2 flex items-center overflow-hidden rounded-lg border">
								<div className="border-jacarta-100 bg-jacarta-50 flex flex-1 items-center self-stretch border-r px-2">
									<span>
										<img src="/images/tokens/REI.svg" alt="REI" className=" mr-1 h-5 w-5" />
									</span>
									<span className="font-display text-jacarta-700 text-sm">REI</span>
								</div>

								<input
									type="number"
									className="focus:ring-accent h-12 w-full flex-[3] border-0 focus:ring-inse dark:text-jacarta-700"
									placeholder="Amount"
									value={form.price}
									onChange={(e) => setForm({ price: Number(e.target.value) })}
									required
									step="any"
								/>

								{/* <div className="bg-jacarta-50 border-jacarta-100 flex flex-1 justify-end self-stretch border-l dark:text-jacarta-700">
									<span className="self-center px-2 text-sm">$130.82</span>
								</div> */}
							</div>

							{/* <div className="text-right">
								<span className="dark:text-jacarta-400 text-sm">Balance: 0.0000 REI</span>
							</div> */}

							{/* <!-- Terms --> */}
							<div className="mt-4 flex items-center space-x-2">
								<input
									type="checkbox"
									id="sell-modal-terms"
									required
									className="checked:bg-accent dark:bg-jacarta-600 text-accent border-jacarta-200 focus:ring-accent/20 dark:border-jacarta-500 h-5 w-5 self-start rounded focus:ring-offset-0"
								/>
								<label
									htmlFor="sell-modal-terms"
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
										Sell
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

export default BidsModal
