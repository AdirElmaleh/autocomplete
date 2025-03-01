import React from 'react'
import './Header.scss'
import { useState, useEffect } from 'react'

function Header() {
	const [isVisible, setIsVisible] = useState(false)

	useEffect(() => {
		setTimeout(() => {
			setIsVisible(true)
		}, 1000)
	}, [])

	return (
		<div className='header'>
			<div
				className={`header__logo ${
					isVisible ? 'header__logo--fade-in' : ''
				}`}>
				<img src='/filestock/deloitte.svg' alt='Deloitte Logo' />
			</div>
		</div>
	)
}

export default Header
