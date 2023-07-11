import { Seaport } from '@opensea/seaport-js'
import { ItemType } from '@opensea/seaport-js/lib/constants'
import { BigNumber } from 'ethers'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { AssetItem, AssetItemType } from 'types'
import { SupportProvider } from 'types/provider'
import { invoke } from '.'

// const order = {
// 	parameters: {
// 		offerer: '0xada286F2d2Cb001b53DeEE492b61D288CfB90a35',
// 		zone: '0x0000000000000000000000000000000000000000',
// 		zoneHash: '0x3000000000000000000000000000000000000000000000000000000000000000',
// 		startTime: '1668411154',
// 		endTime: '115792089237316195423570985008687907853269984665640564039457584007913129639935',
// 		orderType: 0,
// 		offer: [
// 			{
// 				itemType: 2,
// 				token: '0xE0a3711D4286E628998d47beF524C292deFD1719',
// 				identifierOrCriteria: '1',
// 				startAmount: '1',
// 				endAmount: '1',
// 			},
// 		],
// 		consideration: [
// 			{
// 				itemType: 0,
// 				token: '0x0000000000000000000000000000000000000000',
// 				identifierOrCriteria: '0',
// 				startAmount: '100000000000000',
// 				endAmount: '100000000000000',
// 				recipient: '0xada286f2d2cb001b53deee492b61d288cfb90a35',
// 			},
// 		],
// 		totalOriginalConsiderationItems: 1,
// 		salt: '0x0000000056cf4dbdf5419f24',
// 		conduitKey: '0x0000000000000000000000000000000000000000000000000000000000000000',
// 		counter: 0,
// 	},
// 	signature:
// 		'0x871a3cb17dbec7de3bfcdfba41560c8b5ac0a8d800fe540fbedadca3a9a7cdf2f99cf658cf54efcd653090a01c43e52b851f181784b2787e6c95ecc7a79d151f',
// }
interface UseCancelItemProps {
	address: string
	contractAddress: string
	provider: SupportProvider
	order: any
}
export const useCancelItem = () => {
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const cancelItem = useCallback(
		async ({ address, contractAddress, provider, order }: UseCancelItemProps) => {
			setIsLoading(true)
			setError(null)
			try {
				var seaport = new Seaport(provider, {
					overrides: {
						contractAddress,
					},
				})

				const transaction = await seaport.cancelOrders([order.parameters], address).transact()

				const tx = await transaction.wait()

				const tokenDetail = order.parameters.offer[0]
				const response = await invoke(
					'order.cancel',
					{
						address: tokenDetail.token,
						item_type: tokenDetail.itemType,
						token_id: tokenDetail.identifierOrCriteria,
					},
					fetch,
				)
				if (!response.ok) {
					throw new Error('Cancel success but failed to update cache on server')
				}

				return tx
			} catch (error) {
				const errorMessage = error.data?.message || error.message || 'Internal Error'
				setError(errorMessage)
				throw error
			} finally {
				setIsLoading(false)
			}
		},
		[],
	)

	const clearError = useCallback(() => {
		setError(null)
	}, [])

	return {
		cancelItem,
		isLoading,
		error,
		clearError,
	}
}
