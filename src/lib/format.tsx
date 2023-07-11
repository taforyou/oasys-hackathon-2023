import { BigNumber, ethers, utils } from 'ethers'
import React from 'react'

export const formatAddress = (address: string) => `${address.slice(0, 6)}...${address.slice(-4)}`

export const formatTvl = (tvl: number, oraclePrice?: number) => {
	if (oraclePrice) {
		tvl *= oraclePrice
	}

	const order = Math.floor(Math.log10(tvl) / 3)
	if (order < 0) {
		return '$' + utils.commify(tvl.toFixed(2))
	}

	const units = ['', 'k', 'M', 'B', 'T']
	const num = tvl / 1000 ** order
	const prefix = '$'

	return prefix + utils.commify(num.toFixed(2)) + units[order]
}

export const formatUSD = (n: number, oraclePrice?: number, showPrefix = true) => {
	if (oraclePrice) {
		n *= oraclePrice
	}
	return (showPrefix ? '$' : '') + utils.commify(n.toFixed(2))
}

export const formatCountdown = (deadline: number) => {
	const time = deadline - new Date().getTime()
	if (time < 0) {
		return 'Finished'
	}

	const day = Math.floor(time / (1000 * 60 * 60 * 24))
		.toString()
		.padStart(2, '0')
	const hours = Math.floor((time / (1000 * 60 * 60)) % 24)
		.toString()
		.padStart(2, '0')
	const minutes = Math.floor((time / (1000 * 60)) % 60)
		.toString()
		.padStart(2, '0')
	const seconds = Math.floor((time / 1000) % 60)
		.toString()
		.padStart(2, '0')

	return `${day} days ${hours}:${minutes}:${seconds}`
}

export const formatDecimals = (
	n: ethers.BigNumberish,
	decimals: number,
	toDecimals: number,
): string => {
	const d = BigNumber.from(n)

	const remainder = d.mod(BigNumber.from(10).pow(decimals - toDecimals))
	return utils.formatUnits(d.sub(remainder), decimals)
}

export const etherToNumber = (n: string | number): number => {
	if (typeof n === 'number') {
		return n
	}
	return Number(utils.formatEther(BigNumber.from(n)))
}

export const formatDigitNumber = (n: number, digits: number = 2) =>
	n.toLocaleString('en-US', {
		maximumFractionDigits: digits,
	})

const UNDERLINE_REGEX = /(\<u>.*?\<\/u>)/g
const INSIDE_TAG_REGEX = /<.>(.*?)<\/.>/
export const getJSXElementFromString = (text?: string) =>
	text &&
	text
		.split(UNDERLINE_REGEX)
		.map((item, index) =>
			item.search(UNDERLINE_REGEX) !== -1 ? (
				<u key={index}>{INSIDE_TAG_REGEX.exec(item)?.[1]}</u>
			) : (
				<React.Fragment key={index}>{item}</React.Fragment>
			),
		)
