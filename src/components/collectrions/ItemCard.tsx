import Tippy from '@tippyjs/react'
import classNames from 'classnames'
import { useEtherProvider } from 'components/EtherProvider/EtherProvider'
import Likes from 'components/likes'
import Loading from 'components/Loading'
import { CHAIN, getAddressUrl } from 'config/networkSetup'
import { utils } from 'ethers'
import { useItem } from 'lib/api/useItem'
import { formatAddress } from 'lib/format'
import Link from 'next/link'
import React from 'react'
import { useDispatch } from 'react-redux'
import { buyModalShow, sellModalShow } from 'redux/counterSlice'
import { AssetItem, CollectionFilter } from 'types'

interface ItemCardProps {
	item: AssetItem
}

export const ItemCard = ({ item }: ItemCardProps) => {
	const { address, provider, networkId } = useEtherProvider()
	const dispatch = useDispatch()
	const itemUrl = `/asset?collection=${item.collection.address}&id=${item.tokenId}`
	return (
		<article key={item.tokenId} className="">
			<div className="flex flex-col dark:bg-jacarta-700 dark:border-jacarta-700 border-jacarta-100 rounded-2.5xl border bg-white p-[1.1875rem] transition-shadow hover:shadow-lg h-full">
				<figure className="relative">
					<Link href={itemUrl}>
						<a>
							<img
								src={item.image}
								alt="item 5"
								className="w-full h-[230px] rounded-[0.625rem] object-cover"
							/>
						</a>
					</Link>

					{/* <Likes like={likes} /> */}

					{/* <div className="absolute left-3 -bottom-3">
						<div className="flex -space-x-2">
							<Link href={itemUrl}>
								<a>
									<Tippy content={<span>creator: {creator.name}</span>}>
										<img
											src={creator.image}
											alt="creator"
											className="dark:border-jacarta-600 hover:border-accent dark:hover:border-accent h-6 w-6 rounded-full border-2 border-white"
										/>
									</Tippy>
								</a>
							</Link>
							<Link href={itemUrl}>
								<a>
									<Tippy content={<span>creator: {owner.name}</span>}>
										<img
											src={owner.image}
											alt="owner"
											layout="fill"
											className="dark:border-jacarta-600 hover:border-accent dark:hover:border-accent h-6 w-6 rounded-full border-2 border-white"
										/>
									</Tippy>
								</a>
							</Link>
						</div>
					</div> */}
				</figure>
				<div className="mt-3 flex items-center justify-between">
					<Link href={itemUrl}>
						<a>
							<span className="font-display text-jacarta-700 hover:text-accent text-base dark:text-white">
								{item.name} #{item.tokenId}
							</span>
						</a>
					</Link>

					{/* auction dropdown  */}
					{/* <Auctions_dropdown classes="dark:hover:bg-jacarta-600 dropup hover:bg-jacarta-100 rounded-full" /> */}
				</div>
				{item.sellOrder ? (
					<div className="mt-2 text-sm">
						<span className="dark:text-jacarta-200 text-jacarta-700 mr-1">
							Price: {utils.commify(utils.formatEther(item.sellOrder?.eth_price?.toString()))} REI
						</span>

						{/* <span className="dark:text-jacarta-300 text-jacarta-500">
                {bidCount}/{bidLimit}
              </span> */}
					</div>
				) : null}
				<div className="flex items-center gap-2 mt-1">
					<span className="text-jacarta-400 text-sm dark:text-white">Owned by</span>
					<a
						className="text-accent text-sm "
						href={getAddressUrl(CHAIN.REI)(item.owner)}
						target="_blank"
						rel="noreferrer"
					>
						<span className="text-sm font-bold">
							{item.owner.toLowerCase() === address.toLowerCase()
								? 'You'
								: formatAddress(item.owner)}
						</span>
					</a>
				</div>

				<div className="flex items-center justify-between mt-auto pt-4">
					{address.toLowerCase() === item.owner.toLowerCase() ? (
						item.sellOrder ? (
							<Link href={itemUrl}>
								<a className="text-accent font-display text-sm font-semibold w-full">
									Cancel Listing
								</a>
							</Link>
						) : (
							<button
								className="text-accent font-display text-sm font-semibold w-full text-left"
								onClick={() =>
									dispatch(
										sellModalShow({
											item,
										}),
									)
								}
							>
								Sell now
							</button>
						)
					) : item.sellOrder ? (
						<button
							className="text-accent font-display text-sm font-semibold w-full text-left"
							onClick={() => dispatch(buyModalShow({ item }))}
						>
							Buy now
						</button>
					) : (
						<Link href={itemUrl}>
							<a className="text-accent font-display text-sm font-semibold w-full">View</a>
						</Link>
					)}
					{/* <button
						className="text-accent font-display text-sm font-semibold"
						onClick={() => dispatch(buyModalShow({ item }))}
					>
						Buy now
					</button> */}
					{/* <Link href={itemUrl}>
						<a className="group flex items-center">
							<svg className="icon icon-history group-hover:fill-accent dark:fill-jacarta-200 fill-jacarta-500 mr-1 mb-[3px] h-4 w-4">
								<use xlinkHref="/icons.svg#icon-history"></use>
							</svg>
							<span className="group-hover:text-accent font-display dark:text-jacarta-200 text-sm font-semibold">
								View History
							</span>
						</a>
					</Link> */}
				</div>
			</div>
		</article>
	)
}

interface ItemCardContainerProps {
	collectionAddress: string
	tokenId: string
	hideIfError?: boolean
	filterList?: CollectionFilter[]
}
export const ItemCardContainer = React.memo(
	({
		collectionAddress,
		tokenId,
		hideIfError = false,
		filterList = [],
	}: ItemCardContainerProps) => {
		const { address } = useEtherProvider()
		const { item, isLoading, error, refetchToken } = useItem(
			collectionAddress,
			tokenId,
			hideIfError,
		)
		if (error && hideIfError) {
			return null
		}
		if (filterList?.length) {
			if (filterList.includes(CollectionFilter.MyOwn) && item?.owner !== address) {
				return null
			}
			if (filterList.includes(CollectionFilter.Selling) && !item?.sellOrder) {
				return null
			}
		}
		if (isLoading || !item || error) {
			return (
				<div
					className="
					dark:bg-jacarta-700 dark:border-jacarta-700 border-jacarta-100 rounded-2.5xl block border bg-white p-[1.1875rem] transition-shadow hover:shadow-lg
					h-[373px] flex
				"
				>
					{isLoading && !item && <Loading className="my-auto" />}
					{error && (
						<div className="bg-reds-100/20 border border-reds-400 text-red px-4 py-3 rounded break-words mb-6">
							{error}
						</div>
					)}
				</div>
			)
		}
		return <ItemCard item={item} />
	},
)

export default ItemCard
