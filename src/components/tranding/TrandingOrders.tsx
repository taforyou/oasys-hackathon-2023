import React from 'react'
import Loading from 'components/Loading'
import { ItemCardContainer } from 'components/collectrions/ItemCard'
import { useOrderList } from 'lib/api/useOrderList'
import HeadLine from 'components/headLine'
import Link from 'next/link'

const TrandingOrders = ({}) => {
	const { orderList, isLoading, error, refetchToken } = useOrderList({
		paginateParams: { page: 1, perPage: 8 },
	})

	if (!isLoading && error) {
		return null
	}

	return (
		<>
			<div className="container mb-7">
				<HeadLine
					text="Recently Listed"
					classes="font-display text-jacarta-700 mb-8 text-center text-3xl dark:text-white"
					pera={undefined}
					image={undefined}
				/>
				<div className="grid grid-cols-1 gap-[1.875rem] md:grid-cols-2 lg:grid-cols-4">
					{isLoading && !orderList && <Loading className="my-6" />}
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
				<div className="w-full text-center mt-8">
					<Link href="/listing">
						<a className="text-accent hover:bg-light-base border border-accent w-36 rounded-full bg-white py-3 px-8 text-center font-semibold">
							Explore More
						</a>
					</Link>
				</div>
			</div>
		</>
	)
}

export default TrandingOrders
