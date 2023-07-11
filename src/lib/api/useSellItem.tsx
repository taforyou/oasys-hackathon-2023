import { Seaport } from '@opensea/seaport-js'
import { ItemType } from '@opensea/seaport-js/lib/constants'
import { BigNumber } from 'ethers'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { AssetItem, AssetItemType } from 'types'
import { SupportProvider } from 'types/provider'
import { invoke } from '.'

interface UseSellItemProps {
	address: string
	contractAddress: string
	provider: SupportProvider
	collectionAddress: string
	tokenId: string
	amount: BigNumber
}
export const useSellItem = () => {
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const sellItem = useCallback(
		async ({
			address,
			contractAddress,
			provider,
			collectionAddress,
			tokenId,
			amount,
		}: UseSellItemProps) => {
			// if (!address || !contractAddress || !provider || !collectionAddress || !tokenId || !amount) {
			// 	return
			// }
			console.log({
				address,
				contractAddress,
				provider,
				collectionAddress,
				tokenId,
				amount,
			})

			setIsLoading(true)
			setError(null)
			try {
				var seaport = new Seaport(provider, {
					overrides: {
						contractAddress,
					},
				})
				var offerer = address
				var { executeAllActions } = await seaport.createOrder(
					{
						offer: [
							{
								itemType: ItemType.ERC721,
								token: collectionAddress,
								identifier: tokenId,
							},
						],
						consideration: [
							{
								amount: amount.toString(),
								recipient: offerer,
							},
						],
					},
					offerer,
				)
				var order = await executeAllActions()
				const response = await invoke(
					'order.create',
					{
						order,
					},
					fetch,
				)
				if (!response.ok) {
					if (response.error && !response.error.message) {
						response.error.message = 'API Internal Error'
					}
					throw response.error
				}
				return response.result
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
		sellItem,
		isLoading,
		error,
		clearError,
	}
}
