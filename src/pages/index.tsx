import React, { useContext, useEffect } from 'react'
import UserContext from '../components/UserContext'
import HomeComponent from './home/home'

export default function Home() {
	const { scrollRef } = useContext(UserContext)
	useEffect(() => {
		window.scrollTo(0, scrollRef.current.scrollPos)
		const handleScrollPos = () => {
			scrollRef.current.scrollPos = window.scrollY
		}
		window.addEventListener('scroll', handleScrollPos)
		return () => {
			window.removeEventListener('scroll', handleScrollPos)
		}
	})

	return (
		<div>
			<HomeComponent />
		</div>
	)
}
