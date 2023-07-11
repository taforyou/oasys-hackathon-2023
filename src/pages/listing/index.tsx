import React, { useCallback, useEffect, useMemo, useState } from 'react'
import Pagination from 'rc-pagination'
import paginationEnLocale from 'rc-pagination/lib/locale/en_US'
import { useRouter } from 'next/router'
import Meta from '../../components/Meta'
import Loading from 'components/Loading'
import { ItemCardContainer } from 'components/collectrions/ItemCard'
import HeadLine from 'components/headLine'
import { useOrderList } from 'lib/api/useOrderList'

const Collection = () => {
	const router = useRouter()
	const page = +((router.query.page as string) || '1')

	const { orderList, paginate, isLoading, error, refetchToken } = useOrderList({
		paginateParams: { page },
	})

	const onChangePage = useCallback(
		(page) => {
			router.push({
				query: { page },
			})
		},
		[router],
	)
	const totalPage = paginate?.next ? paginate?.page + 1 : paginate?.page

	return (
		<>
			<Meta title={`Recently Listed | KITSUNE - NFT Marketplace `} />

			<section className="relative mt-24 lg:pb-48 pb-24">
				<picture className="pointer-events-none absolute inset-0 -z-10 dark:hidden">
					<img src="/images/gradient_light.jpg" alt="gradient" className="h-full" />
				</picture>

				<div className="container">
					<HeadLine
						text="Recently Listed"
						classes="font-display text-jacarta-700 py-16 text-center text-4xl font-medium dark:text-white"
						image={undefined}
						pera={undefined}
					/>
					{/* <!-- Collection --> */}
					{isLoading && !orderList && <Loading className="my-6" />}
					{error && (
						<div className="bg-reds-100/20 border border-reds-400 text-red px-4 py-3 rounded break-words mb-6">
							{error}
						</div>
					)}
					{!isLoading && orderList.length === 0 && (
						<div className="bg-accent-lighter/10 text-jacarta-600 border-accent-lighter border  px-4 py-3 rounded break-words mb-6">
							No Result
						</div>
					)}
					<div className="grid grid-cols-1 gap-[1.875rem] md:grid-cols-2 lg:grid-cols-4">
						{orderList &&
							orderList.map((item) => (
								<ItemCardContainer
									key={item.address + item.token_id}
									tokenId={item.token_id}
									collectionAddress={item.address}
									hideIfError
								/>
							))}
					</div>
					<div className="flex justify-center items-center mt-8">
						<Pagination
							onChange={onChangePage}
							current={page}
							pageSize={1}
							total={totalPage}
							locale={paginationEnLocale}
						/>
					</div>
					{/* <!-- end Collection --> */}
				</div>
			</section>
		</>
	)
}

export default Collection
