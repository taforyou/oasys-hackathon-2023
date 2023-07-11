import { useCallback, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { invoke } from '.'
interface UseLineProps {}
export const useLine = () => {
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const addWallet = useCallback(
		async ({ lineAccessToken, wallet, slug, chainId, signature, deadline }) => {
			setIsLoading(true)
			setError(null)
			try {
				const response = await invoke(
					'line.addWallet',
					{
						lineAccessToken,
						wallet,
						slug,
						chainId,
						signature,
						deadline,
					},
					fetch,
				)

				if (!response.ok) {
					if (response.error && !response.error.message) {
						response.error.message = 'API Internal Error'
					}
					throw response.error
				}

				return response
			} catch (error) {
				const errorMessage = error.message || 'Internal Error'
				setError(errorMessage)
				toast.error(errorMessage)
				throw error
			} finally {
				setIsLoading(false)
			}
		},
		[],
	)

	const createWallet = useCallback(async ({ lineAccessToken, slug }) => {
		setIsLoading(true)
		setError(null)
		try {
			const response = await invoke(
				'line.createWallet',
				{
					lineAccessToken,
					slug,
				},
				fetch,
			)

			if (!response.ok) {
				if (response.error && !response.error.message) {
					response.error.message = 'API Internal Error'
				}
				throw response.error
			}

			return response
		} catch (error) {
			const errorMessage = error.message || 'Internal Error'
			setError(errorMessage)
			toast.error(errorMessage)
			throw error
		} finally {
			setIsLoading(false)
		}
	}, [])

	const createFireblocksExternalWallet = useCallback(async ({ lineAccessToken, createType }) => {
		setIsLoading(true)
		setError(null)
		try {
			const response = await invoke(
				'line.createWallet',
				{
					lineAccessToken,
					createType,
				},
				fetch,
			)

			if (!response.ok) {
				if (response.error && !response.error.message) {
					response.error.message = 'API Internal Error'
				}
				throw response.error
			}

			return response
		} catch (error) {
			const errorMessage = error.message || 'Internal Error'
			setError(errorMessage)
			toast.error(errorMessage)
			throw error
		} finally {
			setIsLoading(false)
		}
	}, [])

	return {
		isLoading,
		error,
		addWallet,
		createWallet,
		createFireblocksExternalWallet,
	}
}
