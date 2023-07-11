import { Seaport } from '@opensea/seaport-js'
import { ItemType } from '@opensea/seaport-js/lib/constants'
import { OrderWithCounter } from '@opensea/seaport-js/lib/types'
import { BigNumber } from 'ethers'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { AssetItem, AssetItemType } from 'types'
import { SupportProvider } from 'types/provider'
import { invoke } from '.'

interface UseBuyItemProps {
	address: string
	contractAddress: string
	provider: SupportProvider
	order: OrderWithCounter
}
export const useBuyItem = () => {
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const buyItem = useCallback(
		async ({ address, contractAddress, provider, order }: UseBuyItemProps) => {
			setIsLoading(true)
			setError(null)
			try {
				var seaport = new Seaport(provider, {
					overrides: {
						contractAddress,
					},
				})
				console.log({ address, contractAddress, provider, order })

				var { executeAllActions: executeAllFulfillActions } = await seaport.fulfillOrder({
					order,
					accountAddress: address,
				})

				var transaction = await executeAllFulfillActions()

				const tx = await transaction.wait()

				const tokenDetail = order.parameters.offer[0]
				const response = await invoke(
					'order.fulfill',
					{
						address: tokenDetail.token,
						item_type: tokenDetail.itemType,
						token_id: tokenDetail.identifierOrCriteria,
					},
					fetch,
				)
				if (!response.ok) {
					console.log('response', response)
					throw new Error('Transfer success but failed to update cache on server')
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
		buyItem,
		isLoading,
		error,
		clearError,
	}
}
