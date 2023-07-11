export enum Blockchain {
	REI = 'REI',
}

export enum AssetItemType {
	Native = 0,
	ERC20 = 1,
	ERC721 = 2,
	ERC1155 = 3,
	ERC721WithCriteria = 4,
	ERC1155WithCriteria = 5,
}

export enum ContractType {
	'ERC_721' = 'ERC-721',
}

export interface AssetAttributes {
	traitType: string
	value: string
}

export interface AssetCollection {
	address: string
	animation_url_type: string
	blockchain: Blockchain
	contract_type: ContractType
	cover_image: string
	delisted: boolean
	description: string // HTML
	discord_link: string
	display_theme: number
	floor: number
	id: number
	image_url: string
	is_spam: boolean
	listed: number
	name: string
	non_transferable: boolean
	owner: string
	owners: number
	payout_address: string
	royalty_per_mille: number
	sales: number
	site_link: string
	slug: string
	supply: number
	symbol: string
	twitter_link: string
	verified: boolean
	volume: number
}
export interface AssetItem {
	attributes: AssetAttributes[]
	collection: AssetCollection
	image: string
	name: string
	sellOrder: null | SellOrder
	parameters: string
	signature: string
	tokenId: string
	owner: string
}

export interface SellOrder {
	active: boolean
	cancelled: boolean
	contract_version: number
	eth_price: string
	expiration: string
	fulfilled: boolean
	id: string
	payment_token: {
		address: string
		name: string
		symbol: string
	}
	price: number
	quantity: number
	seller: {
		address: string
		profile_image: null
		reverse_ens: null
		username: string | null
	}
	start_time: string
	usd_price: number
}
export interface Order {
	collection: AssetCollection
	sell_order: SellOrder
	address: string
	token_id: string
	created_at: string
}

export interface Paginate {
	page: number
	perPage: number
	next: boolean
}
export interface PaginateParams {
	page: number
	perPage?: number
}

export enum CollectionFilter {
	ALL = 'all',
	Selling = 'selling',
	MyOwn = 'my-own',
}
