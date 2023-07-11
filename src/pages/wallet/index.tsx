import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import Meta from '../../components/Meta'
import Loading from 'components/Loading'
import HeadLine from 'components/headLine'
import type { Liff } from '@line/liff'
import { useLine } from 'lib/api/useLine'
import { useEtherProvider } from 'components/EtherProvider/EtherProvider'
import { toast } from 'react-toastify'
import { signAPI } from 'lib/eth/signAPI'

const Collection = () => {
	const router = useRouter()
	const slug = router.query.slug
	const shoudConnectLine = router.query.line === 'true'
	const [shouldConnectAgain, setShouldConnectAgain] = useState(false)
	const [success, setSuccess] = useState(false)
	const [isLoading, setIsLoading] = useState(false)
	const [showCreateModal, setShowCreateModal] = useState(false)
	const [showCreateModalFireBlocks, setShowCreateModalFireBlocks] = useState(false)
	const [liff, setLiff] = useState<Liff | null>(null)
	const [seedWallet, setSeedWallet] = useState<{
		mnemonic: string
		wallet: string
	} | null>(null)

	const { connected, address, connectWallet, provider, networkId } = useEtherProvider()
	const { isLoading: isLineLoading, error: lineError, addWallet, createWallet, createFireblocksExternalWallet } = useLine()
	const errors = [lineError].filter((i) => i)

	const toggleCreateModal = useCallback(() => {
		setShowCreateModal((prev) => !prev)
	}, [])

	const toggleCreateModalFireBlocks = useCallback(() => {
		setShowCreateModalFireBlocks((prev) => !prev)
	}, [])

	const connectLine = useCallback(async () => {
		try {
			if (!liff) {
				return null
			}

			setIsLoading(true)
			setShouldConnectAgain(false)

			if (liff.isLoggedIn()) {
				const lineToken = liff.getAccessToken()
				const userProfile = await liff.getProfile()

				const { signature, deadline } = await signAPI({
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

				liff.closeWindow()
				setSuccess(true)
				toast.success('Successfully connecting your wallet with LINE.\nPlease close this page.')
			} else {
				liff.login()
			}
		} catch (error) {
			setShouldConnectAgain(true)
			if ((error as Error)?.message.includes('User denied message signature')) {
				toast.warning('Connect wallet not success, please sign request again.')
				return
			}
			toast.error('Add Line Wallet Error')
			console.log(error)
		} finally {
			setIsLoading(false)
		}
	}, [liff, provider, networkId, address, addWallet, slug])

	const createNewWallet = useCallback(async () => {
		try {
			if (!liff) {
				return null
			}

			setIsLoading(true)

			if (liff.isLoggedIn()) {
				const lineToken = liff.getAccessToken()
				const userProfile = await liff.getProfile()

				const res = await createWallet({
					lineAccessToken: lineToken,
					slug,
				})

				setSeedWallet({
					mnemonic: res.result.mnemonic,
					wallet: res.result.wallet,
				})
				setShowCreateModal(false)

				setSuccess(true)
				toast.success(
					res.result.message ||
					'Successfully connecting your wallet with LINE.\nPlease close this page.',
				)
			} else {
				liff.login()
			}
		} catch (error) {
			toast.error('Create New Wallet Error')
			console.log(error)
		} finally {
			setIsLoading(false)
		}
	}, [createWallet, liff, slug])

	const submitCreateWallet = useCallback(
		async (event) => {
			event.preventDefault()
			createNewWallet()
		},
		[createNewWallet],
	)

	const createNewFireblocksWallet = useCallback(async () => {
		try {
			if (!liff) {
				return null
			}

			setIsLoading(true)

			if (liff.isLoggedIn()) {
				const lineToken = liff.getAccessToken()
				const userProfile = await liff.getProfile()

				const res = await createFireblocksExternalWallet({
					lineAccessToken: lineToken,
					createType: "fireblock",
				})

				setSeedWallet({
					mnemonic: res.result.mnemonic,
					wallet: res.result.wallet,
				})
				setShowCreateModalFireBlocks(false)

				setSuccess(true)
				toast.success(
					res.result.message ||
					'Successfully connecting your wallet with LINE.\nPlease close this page.',
				)
			} else {
				liff.login()
			}
		} catch (error) {
			toast.error('Create New Wallet Error')
			console.log(error)
		} finally {
			setIsLoading(false)
		}
	}, [createFireblocksExternalWallet, liff])

	const submitCreateFireblocksWallet = useCallback(
		async (event) => {
			event.preventDefault()
			createNewFireblocksWallet()
		},
		[createNewFireblocksWallet],
	)

	const lineLogin = useCallback(async () => {
		if (!liff) {
			return null
		}

		if (liff.isLoggedIn()) {
			return liff
		}
		liff.login()
		return null
	}, [liff])

	useEffect(() => {
		const fn = async () => {
			const liff = (await import('@line/liff')) as unknown as Liff
			await liff.init({
				liffId: process.env.NEXT_PUBLIC_LIFF_ID,
			})
			setLiff(liff)
		}
		fn()
	}, [])

	useEffect(() => {
		if (shoudConnectLine && address) {
			connectLine()
		}
	}, [address, connectLine, shoudConnectLine, addWallet, slug, provider, networkId])

	useEffect(() => {
		lineLogin()
	}, [lineLogin])

	return (
		<>
			<Meta title={`Wallet | KITSUNE - NFT Marketplace `} />

			<section className="relative mt-24 lg:pb-48 pb-24">
				<picture className="pointer-events-none absolute inset-0 -z-10 dark:hidden">
					<img src="/images/gradient_light.jpg" alt="gradient" className="h-full" />
				</picture>

				<div className="container">
					<HeadLine
						text="Line Wallet"
						classes="font-display text-jacarta-700 pt-16 pb-4 text-center text-4xl font-medium dark:text-white"
						image={undefined}
						pera={undefined}
					/>

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

					{(() => {
						if (seedWallet) {
							return (
								<div className="w-full flex flex-col justify-center items-center gap-4">
									<div className="px-4 mb-5 text-center whitespace-pre-wrap normal-case">
										<span className="text-green">Successfully create your wallet ! {'\n'}</span>
										Please save your seed phrase and wallet address in a safe place.{'\n'}
										This phrase allows you to sign transactions and claim ownership of your wallet
										addresses / login to your wallet.
									</div>

									{seedWallet.wallet ? (
										<div className="p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 mb-4">
											<h5 className="mb-2 text-md font-semibold tracking-tight text-gray-900 dark:text-white">
												Wallet
											</h5>
											<div className="break-all">{seedWallet.wallet}</div>
										</div>
									) : null}

									{seedWallet.mnemonic?.length ? (
										<div className="p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
											<h5 className="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white">
												Seed Phrase
											</h5>
											<div className="mb-3 font-normal grid grid-cols-3 sm:grid-cols-3 gap-x-5 gap-y-1 text-gray-700 dark:text-gray-400">
												{seedWallet.mnemonic.split(' ').map((item, index) => (
													<span className="uppercase" key={index}>
														{item}
													</span>
												))}
											</div>
										</div>
									) : null}

									<div className="text-gray-500 px-10 mt-6 text-center whitespace-pre-line">
										You can close this page, after save your seed phrase.
									</div>
								</div>
							)
						}

						if (success) {
							return (
								<div className="px-10 mb-12 text-center whitespace-pre-line">
									Successfully connecting your wallet with LINE.{'\n'}Please close this page.
								</div>
							)
						}

						if (!connected) {
							return (
								<div className="w-full flex flex-col justify-center items-center gap-4 mb-12">
									<div className="text-gray-500 mb-5">Please select one of the following options.</div>
									<div className="flex flex-col justify-center items-center gap-2" style={{ display: 'none' }}>
										<div>
											<b>(1)</b> connect to your current wallet
										</div>
										<button
											className="bg-accent shadow-accent-volume hover:bg-accent-dark rounded-full py-2 px-7 flex items-center gap-3 text-center font-semibold text-white transition-all"
											onClick={connectWallet}
											disabled={isLoading}
										>
											{isLoading && <Loading className="mr-3" size="small" />}
											Connect Metamask 🦊
										</button>
									</div>
									<div className="flex flex-col justify-center items-center gap-2">
										<div>
											{/* <b>(2)</b> */} No wallet, No Problem 👌
										</div>
										<button
											className="bg-accent shadow-accent-volume hover:bg-accent-dark rounded-full py-2 px-7 flex items-center gap-3 text-center font-semibold text-white transition-all"
											onClick={toggleCreateModal}
											disabled={isLoading}
										>
											{isLoading && <Loading className="mr-3" size="small" />}
											Create New Wallet 📱
										</button>
									</div>
									<div className="flex flex-col justify-center items-center gap-2" style={{ display: 'none' }}>
										<div>
											<b>(3)</b> Count on Fireblocks to ignite your success 😄
										</div>
										<button
											className="bg-accent shadow-accent-volume hover:bg-accent-dark rounded-full py-2 px-7 flex items-center gap-3 text-center font-semibold text-white transition-all"
											onClick={toggleCreateModalFireBlocks}
											disabled={isLoading}
										>
											{isLoading && <Loading className="mr-3" size="small" />}
											Create New External Fireblocks Wallet 🔥
										</button>
									</div>
									<div className="flex flex-col justify-center items-center gap-2">
										<div>
											<b>(2)</b> Count on Singularity to ignite your success 😄
										</div>
										<button
											className="bg-accent shadow-accent-volume hover:bg-accent-dark rounded-full py-2 px-7 flex items-center gap-3 text-center font-semibold text-white transition-all"
											onClick={(e) => {
												e.preventDefault();
												window.open('https://demo-sandbox.s9y.gg/', '_blank', 'noopener,noreferrer')
											}}
											disabled={isLoading}
										>
											{isLoading && <Loading className="mr-3" size="small" />}
											Payment with Singularity 🔥
										</button>
									</div>
								</div>
							)
						}

						return (
							<div className="w-full flex justify-center items-center mt-12">
								<button
									className="bg-accent shadow-accent-volume hover:bg-accent-dark rounded-full py-3 px-8 flex items-center gap-3 text-center font-semibold text-white transition-all"
									onClick={connectLine}
									disabled={isLoading}
								>
									{isLoading && <Loading className="mr-3" size="small" />}
									Sign Request Again
								</button>
							</div>
						)
					})()}
				</div>

				{/* Gen Seed */}

				<div
					key={`${showCreateModal}`}
					className={showCreateModal ? 'modal fade show block' : 'modal fade'}
				>
					<div className="modal-dialog max-w-2xl">
						<form className="modal-content max-h-[80vh]" onSubmit={submitCreateWallet}>
							<div className="modal-header">
								<h4 className="modal-title" id="buyNowModalLabel">
									Disclaimer
								</h4>
								<button
									type="button"
									className="btn-close"
									onClick={toggleCreateModal}
									disabled={isLoading}
								>
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

							<div className="px-6 py-4 bg-slate-50 whitespace-pre-line normal-case overflow-y-auto">
								<span className="font-semibold">
									By using this service, you acknowledge and agree to the following:
								</span>
								{'\n\n'}
								The seed phrase generated by our service is for convenience only and is not intended
								to be used for long-term storage of valuable cryptocurrency assets. Our service may
								be vulnerable to security breaches or issues with the libraries used to generate the
								seed phrase, which may compromise the security of your wallet.{'\n\n'}
								We do not assume any responsibility for the loss of your seed phrase or any
								cryptocurrency assets associated with it. You are solely responsible for
								safeguarding your seed phrase and protecting your cryptocurrency assets.{'\n\n'}
								Our service is not intended to be used as a storage platform for any valuable
								cryptocurrency assets. We strongly recommend that you only use our service for
								generating a seed phrase and transfer it to a more secure location for long-term
								storage.{'\n\n'}
								In the event that you lose your seed phrase, we will not be able to recover it. You
								will need to take full responsibility for any losses that may result from the loss
								of your seed phrase.{'\n\n'}
								By using our service, you agree to release us from any liability for any losses or
								damages that may result from the use of our service. We reserve the right to modify
								this disclaimer at any time without prior notice.{'\n\n'}
								{'\n\n'}
								<b>คำประกาศปลอดความรับผิดชอบ</b>
								{'\n\n'}
								<span className="font-semibold">
									การใช้บริการนี้เป็นการยอมรับและตกลงด้วยเงื่อนไขดังนี้:
								</span>
								{'\n\n'}
								การสร้าง seed phrase
								โดยบริการของเราเป็นเพียงเครื่องมือสำหรับความสะดวกเพื่อใช้งานเฉพาะวัตถุประสงค์
								ไม่ควรนำไปใช้เพื่อเก็บสินทรัพย์ดิจิทัลที่มีมูลค่า
								เนื่องจากบริการของเราอาจมีช่องโหว่ที่ทำให้ seed phrase
								ที่ถูกสร้างมีความเสี่ยงต่อการโจรกรรมข้อมูล
								ซึ่งส่งผลให้สินทรัพย์ดิจิทัลของท่านศูนย์หายได้{'\n\n'}
								โปรดทราบว่าเราไม่รับผิดชอบใดๆ ต่อการสูญหายของ seed phrase
								หรือการสูญเสียสินทรัพย์ดิจิทัลใดๆ ที่เกี่ยวข้องกับ seed phrase
								การรักษาความปลอดภัยของ seed phrase
								และการป้องกันสินทรัพย์ดิจิทัลของคุณเป็นความรับผิดชอบของคุณเอง
								{'\n\n'}
								บริการของเราไม่ได้มีจุดประสงค์ในการใช้เก็บสินทรัพย์ดิจิทัลที่มีค่าใดๆ
								โปรดใช้บริการของเราเพื่อสร้าง seed phrase เท่านั้น แล้วนำ seed phrase
								ไปเก็บไว้ในสถานที่ที่ปลอดภัยมากขึ้นสำหรับการเก็บรักษาระยะยาว
								{'\n\n'}
								หากคุณสูญเสีย seed phrase เราจะไม่สามารถกู้คืนได้
								คุณต้องรับผิดชอบสำหรับความสูญเสียที่อาจเกิดขึ้นจากการสูญเสีย seed phrase ของคุณ
								{'\n\n'}
								การใช้บริการของเราจะถือว่าเป็นการยอมรับเงื่อนไขและความรับผิดชอบตามคำประกาศนี้
								โดยคุณตกลงปล่อยเราพ้นจากความรับผิดชอบต่อความสูญเสียหรือความเสียหายใดๆที่อาจเกิดขึ้นจากการใช้บริการของเรา
								โดยเราสงวนสิทธิ์ในการแก้ไขคำประกาศนี้โดยไม่ต้องแจ้งให้ทราบล่วงหน้า
								{'\n\n'}
								{/* <!-- Terms --> */}
								<div className="mb-4 flex items-center space-x-2">
									<input
										type="checkbox"
										id="wallet-gen-terms"
										className="cursor-pointer checked:bg-accent dark:bg-jacarta-600 text-accent border-jacarta-200 focus:ring-accent/20 dark:border-jacarta-500 h-5 w-5 rounded focus:ring-offset-0"
										required
									/>
									<label
										htmlFor="wallet-gen-terms"
										className="cursor-pointer dark:text-jacarta-200"
									>
										By checking this box, I agree to disclaimer.
									</label>
								</div>
							</div>

							<div className="modal-footer">
								<div className="flex items-center justify-center space-x-4">
									<button
										type="submit"
										className="bg-accent not:disabled:shadow-accent-volume disabled:bg-slate-500 disabled:cursor-not-allowed hover:bg-accent-dark rounded-full py-2 px-6 text-center font-semibold text-white transition-all"
										disabled={isLoading}
									>
										{isLoading && <Loading className="mr-3" size="small" />}
										Accept
									</button>

									<button
										type="button"
										className="border border-gray-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-full py-2 px-6 text-center font-semibold transition-all"
										disabled={isLoading}
										onClick={toggleCreateModal}
									>
										Declined
									</button>
								</div>
							</div>
						</form>
					</div>
				</div>

				{/* fireblock */}
				<div
					key={`${showCreateModalFireBlocks}`}
					className={showCreateModalFireBlocks ? 'modal fade show block' : 'modal fade'}
				>
					<div className="modal-dialog max-w-2xl">
						<form className="modal-content max-h-[80vh]" onSubmit={submitCreateFireblocksWallet}>
							<div className="modal-header">
								<h4 className="modal-title" id="buyNowModalLabel">
									Disclaimer
								</h4>
								<button
									type="button"
									className="btn-close"
									onClick={toggleCreateModalFireBlocks}
									disabled={isLoading}
								>
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

							<div className="px-6 py-4 bg-slate-50 whitespace-pre-line normal-case overflow-y-auto">
								<span className="font-semibold">
									By using this service, you acknowledge and agree to the following:
								</span>
								{'\n\n'}
								The seed phrase generated by our service is for convenience only and is not intended
								to be used for long-term storage of valuable cryptocurrency assets. Our service may
								be vulnerable to security breaches or issues with the libraries used to generate the
								seed phrase, which may compromise the security of your wallet.{'\n\n'}
								We do not assume any responsibility for the loss of your seed phrase or any
								cryptocurrency assets associated with it. You are solely responsible for
								safeguarding your seed phrase and protecting your cryptocurrency assets.{'\n\n'}
								Our service is not intended to be used as a storage platform for any valuable
								cryptocurrency assets. We strongly recommend that you only use our service for
								generating a seed phrase and transfer it to a more secure location for long-term
								storage.{'\n\n'}
								In the event that you lose your seed phrase, we will not be able to recover it. You
								will need to take full responsibility for any losses that may result from the loss
								of your seed phrase.{'\n\n'}
								By using our service, you agree to release us from any liability for any losses or
								damages that may result from the use of our service. We reserve the right to modify
								this disclaimer at any time without prior notice.{'\n\n'}
								{'\n\n'}
								<b>คำประกาศปลอดความรับผิดชอบ</b>
								{'\n\n'}
								<span className="font-semibold">
									การใช้บริการนี้เป็นการยอมรับและตกลงด้วยเงื่อนไขดังนี้:
								</span>
								{'\n\n'}
								การสร้าง seed phrase
								โดยบริการของเราเป็นเพียงเครื่องมือสำหรับความสะดวกเพื่อใช้งานเฉพาะวัตถุประสงค์
								ไม่ควรนำไปใช้เพื่อเก็บสินทรัพย์ดิจิทัลที่มีมูลค่า
								เนื่องจากบริการของเราอาจมีช่องโหว่ที่ทำให้ seed phrase
								ที่ถูกสร้างมีความเสี่ยงต่อการโจรกรรมข้อมูล
								ซึ่งส่งผลให้สินทรัพย์ดิจิทัลของท่านศูนย์หายได้{'\n\n'}
								โปรดทราบว่าเราไม่รับผิดชอบใดๆ ต่อการสูญหายของ seed phrase
								หรือการสูญเสียสินทรัพย์ดิจิทัลใดๆ ที่เกี่ยวข้องกับ seed phrase
								การรักษาความปลอดภัยของ seed phrase
								และการป้องกันสินทรัพย์ดิจิทัลของคุณเป็นความรับผิดชอบของคุณเอง
								{'\n\n'}
								บริการของเราไม่ได้มีจุดประสงค์ในการใช้เก็บสินทรัพย์ดิจิทัลที่มีค่าใดๆ
								โปรดใช้บริการของเราเพื่อสร้าง seed phrase เท่านั้น แล้วนำ seed phrase
								ไปเก็บไว้ในสถานที่ที่ปลอดภัยมากขึ้นสำหรับการเก็บรักษาระยะยาว
								{'\n\n'}
								หากคุณสูญเสีย seed phrase เราจะไม่สามารถกู้คืนได้
								คุณต้องรับผิดชอบสำหรับความสูญเสียที่อาจเกิดขึ้นจากการสูญเสีย seed phrase ของคุณ
								{'\n\n'}
								การใช้บริการของเราจะถือว่าเป็นการยอมรับเงื่อนไขและความรับผิดชอบตามคำประกาศนี้
								โดยคุณตกลงปล่อยเราพ้นจากความรับผิดชอบต่อความสูญเสียหรือความเสียหายใดๆที่อาจเกิดขึ้นจากการใช้บริการของเรา
								โดยเราสงวนสิทธิ์ในการแก้ไขคำประกาศนี้โดยไม่ต้องแจ้งให้ทราบล่วงหน้า
								{'\n\n'}
								{/* <!-- Terms --> */}
								<div className="mb-4 flex items-center space-x-2">
									<input
										type="checkbox"
										id="wallet-gen-terms"
										className="cursor-pointer checked:bg-accent dark:bg-jacarta-600 text-accent border-jacarta-200 focus:ring-accent/20 dark:border-jacarta-500 h-5 w-5 rounded focus:ring-offset-0"
										required
									/>
									<label
										htmlFor="wallet-gen-terms"
										className="cursor-pointer dark:text-jacarta-200"
									>
										By checking this box, I agree to disclaimer.
									</label>
								</div>
							</div>

							<div className="modal-footer">
								<div className="flex items-center justify-center space-x-4">
									<button
										type="submit"
										className="bg-accent not:disabled:shadow-accent-volume disabled:bg-slate-500 disabled:cursor-not-allowed hover:bg-accent-dark rounded-full py-2 px-6 text-center font-semibold text-white transition-all"
										disabled={isLoading}
									>
										{isLoading && <Loading className="mr-3" size="small" />}
										Accept
									</button>

									<button
										type="button"
										className="border border-gray-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-full py-2 px-6 text-center font-semibold transition-all"
										disabled={isLoading}
										onClick={toggleCreateModalFireBlocks}
									>
										Declined
									</button>
								</div>
							</div>
						</form>
					</div>
				</div>

			</section>
		</>
	)
}

export default Collection
