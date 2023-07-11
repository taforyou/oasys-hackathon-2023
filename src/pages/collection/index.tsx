import React, { useCallback, useMemo, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroller'
import { useRouter } from 'next/router'
import Image from 'next/image'
import Meta from '../../components/Meta'
import { useCollection } from 'lib/api/useCollection'
import Loading from 'components/Loading'
import { ItemCardContainer } from 'components/collectrions/ItemCard'
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs'
import { CHAIN, getAddressUrl } from 'config/networkSetup'
import { formatAddress } from 'lib/format'
import { CollectionFilter } from 'types'

const collectionFilterList = [
	{
		name: 'All',
		value: CollectionFilter.ALL,
		icon: null,
	},
	{
		name: 'Selling',
		value: CollectionFilter.Selling,
		icon: <i className="fa-solid fa-basket-shopping"></i>,
	},
	// {
	// 	name: 'My Own',
	// 	value: CollectionFilter.MyOwn,
	// 	icon: <i className="fa-solid fa-user-astronaut"></i>,
	// },
]

const Collection = () => {
	const [itemsTabs, setItemsTabs] = useState(1)
	const [itemCountList, setItemCountList] = useState(5)
	const router = useRouter()
	const collectionAddress = router.query.collection as string
	const filters: CollectionFilter[] = router.query.filters
		? Array.isArray(router.query.filters)
			? (router.query.filters as unknown as CollectionFilter[])
			: [router.query.filters as unknown as CollectionFilter]
		: []

	const {
		collection,
		isLoading,
		error: collectionError,
		refetchToken,
	} = useCollection(collectionAddress as string)

	const error = collectionError || (collectionAddress ? null : 'Not found Collection Address')

	const collectionItemsTabs = [
		{
			id: 1,
			text: 'Items',
			icon: 'items',
		},
		{
			id: 2,
			text: 'Activity',
			icon: 'activities',
			disabled: true,
		},
	]

	const handleFilter = useCallback(
		(filterValue: CollectionFilter) => {
			if (filterValue === CollectionFilter.ALL) {
				router.push(
					{
						query: {
							...router.query,
							filters: [],
						},
					},
					undefined,
					{ scroll: false },
				)
			} else {
				const newFilter = filters.includes(filterValue)
					? filters.filter((f) => f !== filterValue)
					: [...filters.filter((f) => f !== CollectionFilter.ALL), filterValue]

				router.push(
					{
						query: {
							...router.query,
							filters: newFilter,
						},
					},
					undefined,
					{ scroll: false },
				)
			}
		},
		[filters, router, router.query],
	)

	const fetchItems = useCallback(() => {
		const fetchNext = 4
		setItemCountList((prev) => prev + fetchNext)
	}, [])
	const hasMoreItems = itemCountList < collection?.supply + 1

	return (
		<>
			<Meta title={`${collection?.name || 'Collection'} | KITSUNE - NFT Marketplace `} />

			<div className="pt-[5.5rem] lg:pt-24">
				{collection ? (
					<>
						{/* <!-- Banner --> */}
						<div className="relative h-[18.75rem]">
							<Image src={collection.cover_image} alt="banner" layout="fill" objectFit="cover" />
						</div>
						{/* <!-- end banner --> */}
						<section className="dark:bg-jacarta-800 bg-light-base relative pb-12 pt-28">
							{/* <!-- Avatar --> */}
							<div className="absolute left-1/2 top-0 z-10 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center">
								<figure className="relative h-40 w-40 dark:border-jacarta-600 rounded-xl border-[5px] border-white overflow-hidden">
									<Image
										src={collection.cover_image}
										alt={collection.name}
										layout="fill"
										objectFit="contain"
										className="dark:border-jacarta-600 "
									/>
								</figure>
							</div>

							<div className="container">
								<div className="text-center">
									<h2 className="font-display text-jacarta-700 mb-2 text-4xl font-medium dark:text-white">
										{collection.name}
									</h2>
									<div className="dark:bg-jacarta-700 dark:border-jacarta-600 border-jacarta-100 mb-8 inline-flex items-center justify-center rounded-full border bg-white py-1.5 px-4">
										<img src="/images/tokens/REI.svg" className="w-4 h-4 mr-1" alt="etherscan" />

										<a
											className="text-accent text-sm "
											href={getAddressUrl(CHAIN.REI)(collection.payout_address)}
											target="_blank"
											rel="noreferrer"
										>
											<span className="text-sm font-bold">
												{formatAddress(collection.payout_address)}
											</span>
										</a>
									</div>

									<p className="dark:text-jacarta-300 mx-auto mb-2 max-w-xl text-lg">
										{collection.description}
									</p>
									<span className="text-jacarta-400">
										items: {collection.supply.toLocaleString()}
									</span>
								</div>
							</div>
						</section>
						{/* <!-- end profile --> */}
					</>
				) : null}
			</div>

			<section className="relative ">
				<picture className="pointer-events-none absolute inset-0 -z-10 dark:hidden">
					<Image
						src="/images/gradient_light.jpg"
						alt="gradient"
						className="h-full w-full"
						layout="fill"
					/>
				</picture>
				<div className="container">
					{/* <!-- Tabs Nav --> */}
					<Tabs className="tabs">
						<TabList className="nav nav-tabs dark:border-jacarta-600 border-jacarta-100 mb-12 flex items-center justify-center border-b">
							{collectionItemsTabs.map(({ id, text, icon, disabled }) => {
								return disabled ? (
									<button
										disabled
										className="nav-link text-jacarta-400 relative flex items-center whitespace-nowrap py-3 px-6 cursor-not-allowed"
									>
										<svg className="icon icon-items mr-1 h-5 w-5 fill-current">
											<use xlinkHref={`/icons.svg#icon-${icon}`}></use>
										</svg>
										<span className="font-display text-base font-medium">{text}</span>
									</button>
								) : (
									<Tab className="nav-item" key={id} onClick={() => setItemsTabs(id)}>
										<button
											className={
												itemsTabs === id
													? 'nav-link hover:text-jacarta-700 text-jacarta-400 relative flex items-center whitespace-nowrap py-3 px-6 dark:hover:text-white active'
													: 'nav-link hover:text-jacarta-700 text-jacarta-400 relative flex items-center whitespace-nowrap py-3 px-6 dark:hover:text-white'
											}
										>
											<svg className="icon icon-items mr-1 h-5 w-5 fill-current">
												<use xlinkHref={`/icons.svg#icon-${icon}`}></use>
											</svg>
											<span className="font-display text-base font-medium">{text}</span>
										</button>
									</Tab>
								)
							})}
						</TabList>

						<TabPanel>
							<div>
								{/* <!-- Filter --> */}
								<div className="mb-8 flex flex-wrap items-start justify-between">
									<ul className="flex flex-wrap items-center">
										{collectionFilterList.map((filter) => (
											<li
												className="my-1 mr-2.5"
												key={filter.value}
												onClick={() => handleFilter(filter.value)}
											>
												<button
													className={
														filters.includes(filter.value)
															? 'flex flex-row gap-2 dark:border-jacarta-600 bg-accent group border-jacarta-100 font-display h-9 items-center rounded-lg border px-4 text-sm font-semibold transition-colors border-transparent dark:border-transparent text-white'
															: 'flex flex-row gap-2 dark:border-jacarta-600 dark:bg-jacarta-900 dark:hover:bg-accent group hover:bg-accent border-jacarta-100 font-display text-jacarta-500 h-9 items-center rounded-lg border bg-white px-4 text-sm font-semibold transition-colors hover:border-transparent hover:text-white dark:text-white dark:hover:border-transparent dark:hover:text-white'
													}
												>
													{filter.icon}
													<span>{filter.name}</span>
												</button>
											</li>
										))}
									</ul>
								</div>

								{/* <!-- Collection --> */}
								{isLoading && !collection && <Loading className="my-6" />}
								{error && (
									<div className="bg-reds-100/20 border border-reds-400 text-red px-4 py-3 rounded break-words mb-6">
										{error}
									</div>
								)}

								<InfiniteScroll
									loadMore={fetchItems}
									hasMore={hasMoreItems}
									loader={<Loading className="my-6" />}
								>
									<div className="grid grid-cols-1 gap-[1.875rem] md:grid-cols-2 lg:grid-cols-4 pb-12">
										{itemCountList &&
											collection?.supply &&
											[...new Array(itemCountList)].map((_, index) => (
												<ItemCardContainer
													key={index}
													tokenId={index.toString()}
													collectionAddress={collectionAddress}
													hideIfError
													filterList={filters}
												/>
											))}
									</div>
								</InfiniteScroll>
								{/* <!-- end Collection --> */}
							</div>
						</TabPanel>
						<TabPanel>{/* <Activity_item /> */}</TabPanel>
					</Tabs>
				</div>
			</section>
		</>
	)
}

export default Collection
