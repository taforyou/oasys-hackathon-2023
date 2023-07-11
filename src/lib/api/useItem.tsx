import { Seaport } from '@opensea/seaport-js'
import { ItemType } from '@opensea/seaport-js/lib/constants'
import { BigNumber } from 'ethers'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { useAppSelector } from 'redux/hooks'
import { AssetItem, AssetItemType } from 'types'
import { SupportProvider } from 'types/provider'
import { invoke } from '.'

export const useItem = (collectionAddress: string, tokenId: string, hideIfError = false) => {
	const [isLoading, setIsLoading] = useState(false)
	const [item, setItem] = useState<AssetItem | null>(null)
	const [error, setError] = useState<string | null>(null)
	const { refreshItemTimestamp } = useAppSelector((state) => state.counter)

	const refetchToken = useCallback(async () => {
		if (!collectionAddress || !tokenId) {
			return
		}

		setIsLoading(true)
		setError(null)
		try {
			const response = await invoke(
				'order.getToken',
				{
					address: collectionAddress,
					item_type: AssetItemType.ERC721,
					token_id: tokenId,
				},
				fetch,
			)
			setItem(response.result)
			if (!response.ok) {
				if (response.error && !response.error.message) {
					response.error.message = 'API Internal Error'
				}
				throw response.error
			}
		} catch (error) {
			const errorMessage = error.message || 'Internal Error'
			setError(errorMessage)
			if (!hideIfError) {
				toast.error(errorMessage)
			}
		} finally {
			setIsLoading(false)
		}
	}, [collectionAddress, hideIfError, tokenId])

	useEffect(() => {
		refetchToken()
	}, [refetchToken, refreshItemTimestamp])

	return {
		item,
		isLoading,
		error,
		refetchToken,
	}
}
