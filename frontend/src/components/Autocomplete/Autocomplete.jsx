import React, { useState, useEffect, useRef } from 'react'
import { fetchAutocomplete } from '../../services/dataService'
import { useNavigate } from 'react-router-dom'; 
import './Autocomplete.scss'

function Autocomplete() {
	const [query, setQuery] = useState('')
	const [suggestions, setSuggestions] = useState([])
	const [isFocused, setIsFocused] = useState(false)
	const [fullSearch, setFullSearch] = useState(false)
	const [isLoading, setIsLoading] = useState(false)
	const [activeIndex, setActiveIndex] = useState(-1)
	const [hasSearched, setHasSearched] = useState(false);
	const [error, setError] = useState('')

	const inputRef = useRef(null)
	const employeesRefs = useRef([])
	const navigate = useNavigate();

	useEffect(() => {
		// debounce wait until user stops typing
		const delaySearch = setTimeout(() => {
			if (query.length >= 2) {
				setIsLoading(true) // start loading
				setError('') // clear any error
				fetchAutocomplete(query, fullSearch)
					.then((data) => {
						setSuggestions(data)
						setIsLoading(false)
						setHasSearched(true);
					})
					.catch((err) => {
						setError(err.message)
						setSuggestions([])
						setIsLoading(false)
						setHasSearched(true);
					})
			} else {
				setSuggestions([])
				setHasSearched(false);
			}
		}, 500)

		return () => clearTimeout(delaySearch)
	}, [query, fullSearch])

	// when navigate with arrows scroll to current index
	useEffect(() => {
		if (activeIndex >= 0 && employeesRefs.current[activeIndex]) {
			employeesRefs.current[activeIndex].scrollIntoView({
				behavior: 'smooth',
				block: 'nearest',
			})
		}
	}, [activeIndex])

	const handleChange = (e) => {
		setQuery(e.target.value)
		setFullSearch(false) // limit full search to search on button click only
		setActiveIndex(-1) // reset active index
	}

	const handleFocus = () => {
		setIsFocused(true)
	}

	const handleBlur = (e) => {

		setTimeout(() => {
			if (
				!e.relatedTarget || // No new focused element
				(!e.relatedTarget.classList.contains('autocomplete__button') &&
					!e.relatedTarget.classList.contains('autocomplete__item') &&
					!e.relatedTarget.classList.contains('autocomplete__input'))
			) {
				setIsFocused(false)
			}
		}, 200)
	}

	const handleFullSearch = (event) => {
		if (suggestions.length === 0) return
		setFullSearch(true)
		// return focus to the input to keep list suggestion open
		setIsFocused(true)
	}

	const highlightSuggest = (text, query) => {
		if (!query) return text

		const lowerText = text.toLowerCase()
		const lowerQuery = query.toLowerCase()
		const index = lowerText.indexOf(lowerQuery)

		if (index === -1) return text

		return (
			<>
				{text.substring(0, index)}
				<span className='autocomplete__highlight'>
					{text.substring(index, index + query.length)}
				</span>
				{text.substring(index + query.length)}
			</>
		)
	}

	const handleSelectEmployee = (employee) => {
		navigate(`/employee/${employee.id}`); // Redirect to employee page
	};

	const handleKeyDown = (e) => {
		if (!isFocused || suggestions.length === 0) return

		switch (e.key) {
			case 'Escape':
				setIsFocused(false)
				// prevent any focus on the input after escape
				if (inputRef.current) {
					inputRef.current.blur()
				}
				break

			case 'ArrowDown':
				e.preventDefault()
				setActiveIndex((prev) =>
					prev < suggestions.length - 1 ? prev + 1 : 0
				)
				break

			case 'ArrowUp':
				e.preventDefault()
				setActiveIndex((prev) =>
					prev > 0 ? prev - 1 : suggestions.length - 1
				)
				break

			case 'Enter':
				if (activeIndex >= 0 && activeIndex < suggestions.length) {
					console.log(suggestions[activeIndex])
					handleSelectEmployee(suggestions[activeIndex])
					setIsFocused(true)
				}
				if (isFocused) {
					handleFullSearch()
				}
				break

			default:
				break
		}
	}

	return (
		<div
			className={`autocomplete ${
				isFocused && suggestions.length > 0
					? 'autocomplete__list--active'
					: ''
			}`}>
			<div className='autocomplete__wrapper'>
				<h1 className='autocomplete__title'>
					Find the Right Employee Instantly
				</h1>
				<div className='autocomplete__subtitle'>
					Easily search for employees by name or department. Start
					typing to explore suggestions and connect with the right
					people.
				</div>
				<div className='autocomplete__suggestions'>
					<div className='autocomplete__input-wrapper'>
						{!isLoading && (
							<span className='autocomplete__search-icon'>
								<img
									src='/filestock/search.svg'
									alt='search icon'
								/>
							</span>
						)}

						<input
							type='text'
							className='autocomplete__input'
							placeholder='Start typing an employee name...'
							value={query}
							onChange={handleChange}
							onFocus={handleFocus}
							onBlur={handleBlur}
							onKeyDown={handleKeyDown}
							ref={inputRef}
						/>

						{isLoading && (
							<div className='autocomplete__loader'>
								<div className='spinner'></div>
							</div>
						)}

						<button
							className='autocomplete__button'
							onPointerDown={(e) => {
								e.preventDefault()
								handleFullSearch()
							}}
							disabled={isLoading}>
							Search
						</button>
					</div>
					{isFocused &&
						suggestions.length === 0 &&
						query.length >= 2 &&
						hasSearched &&
						!isLoading && (
							<div className='autocomplete__no-results'>
								No results found.
							</div>
					)}
					{error && (
						<div className='autocomplete__error'>{error}</div>
					)}

					{isFocused &&
						suggestions.length > 1 &&
						query.length >= 2 &&
						fullSearch && (
							<div className='autocomplete__show-results'>
								Scroll to see results for "{query}"
							</div>
					)}
					<ul
						className={`autocomplete__list ${
							isFocused ? 'autocomplete__list--visible' : ''
						} ${
							suggestions.length === 0
								? 'autocomplete__list--empty'
								: ''
						}`}>
						{suggestions.map((item, index) => (
							<li
								key={index}
								onClick={() => handleSelectEmployee(item)}
								className={`autocomplete__item ${
									index === activeIndex
										? 'autocomplete__item--active'
										: ''
								}`}
								ref={(el) =>
									(employeesRefs.current[index] = el)
								}>
								<img
									src={
										item.imageUrl &&
										item.imageUrl.trim() !== ''
											? item.imageUrl
											: '/filestock/user.svg'
									}
									alt={item.name || 'User'}
									className='autocomplete__image'
									onError={(e) => {
										e.target.onerror = null
										e.target.src = '/filestock/user.svg'
									}}
								/>
								<div className='autocomplete__employee'>
									<span className='autocomplete__name'>
										{highlightSuggest(item.name, query)}
									</span>
									<span className='autocomplete__department'>
										{highlightSuggest(
											item.workTitle,
											query
										)}
									</span>
								</div>
							</li>
						))}
					</ul>
				</div>
			</div>
		</div>
	)
}

export default Autocomplete
