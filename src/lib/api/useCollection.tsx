import { useCallback, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { AssetCollection, AssetItemType } from 'types'
import { invoke } from '.'

export const useCollection = (collectionAddress: string) => {
	const [isLoading, setIsLoading] = useState(false)
	const [collection, setCollection] = useState<AssetCollection | null>(null)
	const [error, setError] = useState<string | null>(null)

	const refetchToken = useCallback(async () => {
		if (!collectionAddress) {
			return
		}

		setIsLoading(true)
		setError(null)
		try {
			const response = await invoke(
				'order.getCollection',
				{
					address: collectionAddress,
					itemType: AssetItemType.ERC721,
				},
				fetch,
			)
			setCollection(response.result)

			if (!response.ok) {
				if (response.error && !response.error.message) {
					response.error.message = 'API Internal Error'
				}
				throw response.error
			}
		} catch (error) {
			const errorMessage = error.message || 'Internal Error'
			setError(errorMessage)
			toast.error(errorMessage)
		} finally {
			setIsLoading(false)
		}
	}, [collectionAddress])

	useEffect(() => {
		refetchToken()
	}, [refetchToken])

	return {
		collection,
		isLoading,
		error,
		refetchToken,
	}
}
