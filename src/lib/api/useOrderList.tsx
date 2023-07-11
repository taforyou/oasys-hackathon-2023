import { useCallback, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { AssetCollection, AssetItemType, Order, PaginateParams, Paginate } from 'types'
import { invoke } from '.'
interface UseOrderListProps {
	paginateParams: PaginateParams
}
export const useOrderList = ({ paginateParams }: UseOrderListProps) => {
	const [isLoading, setIsLoading] = useState(false)
	const [orderList, setOrderList] = useState<Order[]>([])
	const [paginate, setPaginate] = useState<Paginate | null>(null)
	const [error, setError] = useState<string | null>(null)

	const refetchToken = useCallback(async () => {
		if (typeof paginateParams?.page !== 'number') {
			return
		}

		setIsLoading(true)
		setError(null)
		try {
			const response = await invoke(
				'order.list',
				{
					paginate: paginateParams,
				},
				fetch,
			)
			setOrderList(response.result.orders)
			setPaginate(response.result.paginate)
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
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [paginateParams.page, paginateParams.perPage])

	useEffect(() => {
		refetchToken()
	}, [refetchToken])

	return {
		orderList,
		paginate,
		isLoading,
		error,
		refetchToken,
	}
}
