import TrandingOrders from 'components/tranding/TrandingOrders'
import React from 'react'
import { Hero, Tranding_category, NewseLatter } from '../../components/component'
import Meta from '../../components/Meta'

const Home_1 = () => {
	return (
		<main>
			<Meta title="Home 1 | KITSUNE - NFT Marketplace" />
			<Hero />
			<TrandingOrders />
			<NewseLatter />
		</main>
	)
}

export default Home_1
