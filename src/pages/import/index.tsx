import React, { useCallback, useState } from 'react'
import Tippy from '@tippyjs/react'
import 'tippy.js/dist/tippy.css' // optional
import Collection_dropdown2 from '../../components/dropdown/collection_dropdown2'
import { collectionDropdown2_data, EthereumDropdown2_data } from '../../data/dropdown'
import { FileUploader } from 'react-drag-drop-files'
import Proparties_modal from '../../components/modal/proparties_modal'
import { useDispatch } from 'react-redux'
import Meta from '../../components/Meta'
import { useRouter } from 'next/router'

const Create = () => {
	const [form, setForm] = useState({
		collectionAddress: '',
		tokenId: '',
	})
	const [showTokenInput, setShowTokenInput] = useState(false)
	const router = useRouter()

	const submit = useCallback(
		(event) => {
			event.preventDefault()
			if (form.tokenId.trim() !== '') {
				router.push({
					pathname: '/asset',
					query: { collection: form.collectionAddress, id: form.tokenId },
				})
			} else {
				router.push({
					pathname: '/collection',
					query: { collection: form.collectionAddress },
				})
			}
		},
		[form.collectionAddress, form.tokenId, router],
	)

	return (
		<div>
			<Meta title="Import | KITSUNE - NFT Marketplace" />
			{/* <!-- Import --> */}
			<section className="relative py-24">
				<picture className="pointer-events-none absolute inset-0 -z-10 dark:hidden">
					<img src="/images/gradient_light.jpg" alt="gradient" className="h-full w-full" />
				</picture>
				<form className="container" onSubmit={submit}>
					<h1 className="font-display text-jacarta-700 py-16 text-center text-4xl font-medium dark:text-white">
						Import
					</h1>

					<div className="mx-auto max-w-[48.125rem]">
						{/* <!-- Name --> */}
						<div className="mb-6">
							<label
								htmlFor="collection-address"
								className="font-display text-jacarta-700 mb-2 block dark:text-white"
							>
								Collection Address<span className="text-red">*</span>
							</label>
							<input
								type="text"
								id="collection-address"
								className="dark:bg-jacarta-700 border-jacarta-100 hover:ring-accent/10 focus:ring-accent dark:border-jacarta-600 dark:placeholder:text-jacarta-300 w-full rounded-lg py-3 px-3 hover:ring-2 dark:text-white"
								placeholder="Enter Collection Address"
								required
								onChange={(e) => setForm({ ...form, collectionAddress: e.target.value })}
							/>
							{!showTokenInput ? (
								<div className="">
									<button
										className={`rounded-full py-3 px-0 text-center font-semibold text-sm dark:text-white`}
										onClick={(e) => {
											e.preventDefault()
											setShowTokenInput(true)
										}}
									>
										+ Token ID
									</button>
								</div>
							) : null}
						</div>

						{showTokenInput ? (
							<div className="mb-6">
								<label
									htmlFor="token-id"
									className="font-display text-jacarta-700 mb-2 block dark:text-white"
								>
									Token ID of Collection
								</label>
								<input
									type="number"
									id="token-id"
									className="dark:bg-jacarta-700 border-jacarta-100 hover:ring-accent/10 focus:ring-accent dark:border-jacarta-600 dark:placeholder:text-jacarta-300 w-full rounded-lg py-3 px-3 hover:ring-2 dark:text-white"
									placeholder="Enter Token Id"
									onChange={(e) => setForm({ ...form, tokenId: e.target.value })}
								/>
							</div>
						) : null}
						{/* <!-- Submit --> */}
						<button
							type="submit"
							disabled={form.collectionAddress.trim() === ''}
							className={`rounded-full py-3 px-8 text-center font-semibold text-white transition-all ${
								form.collectionAddress.trim() === ''
									? 'bg-accent-lighter cursor-not-allowed'
									: 'bg-accent'
							}`}
						>
							Import
						</button>
					</div>
				</form>
			</section>
			{/* <!-- end create --> */}
		</div>
	)
}

export default Create
