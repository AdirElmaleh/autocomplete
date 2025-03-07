const API_URL =
  process.env.NODE_ENV === "production"
    ? "https://deloitte-autocomplete.com"
    : "http://localhost:8000";

export async function fetchAutocomplete(query, fullResults = false) {
	try {
		const response = await fetch(
			`${API_URL}/api/autocomplete?query=${encodeURIComponent(
				query
			)}&fullResults=${fullResults}`
		)

		if (!response.ok) {
			let errorData
			try {
				errorData = await response.json()
			} catch (parseError) {
				// error return from the server invalid
				errorData = { error: 'Unknown error occurred.' }
			}

			const errorMessage = errorData.error || 'Error.'
			throw new Error(errorMessage)
		}

		return await response.json()
	} catch (error) {
		// potential server error
		console.error('fetchAutocomplete error:', error)
		throw error
	}
}


export async function fetchEmployee(id) {
	try {
		const response = await fetch(
			`${API_URL}/api/employee?query=${encodeURIComponent(id)}`
		)

		if (!response.ok) {
			let errorData
			try {
				errorData = await response.json()
			} catch (parseError) {
				// error return from the server invalid
				errorData = { error: 'Unknown error occurred.' }
			}

			const errorMessage = errorData.error || 'Error.'
			throw new Error(errorMessage)
		}

		return await response.json()
	} catch (error) {
		// potential server error
		console.error('fetchAutocomplete error:', error)
		throw error
	}
}
