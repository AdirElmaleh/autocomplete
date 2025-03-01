import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { fetchEmployee } from '../../services/dataService'
import './EmployeePage.scss'

function EmployeePage() {
	const { id } = useParams()
	const navigate = useNavigate() // Hook to handle navigation
	const [employee, setEmployee] = useState(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)

	useEffect(() => {
        if (!id || isNaN(id)) {
			setError('Invalid Employee ID.')
			setLoading(false)
			return
		}
        
		setLoading(true)
		fetchEmployee(id)
			.then((data) => {
				setEmployee(data)
				setLoading(false)
			})
			.catch((err) => {
				setError('Failed to fetch employee data.')
				setLoading(false)
			})
	}, [id])

	return (
		<div className='employee'>

			<div className='employee__wrapper'>
                <button className="employee__back-button" onClick={() => navigate(-1)}>
					‹Back
				</button>
				{employee && (
					<div className='employee__heading'>
						<h1 className='employee__title'>
							{employee.name} 
							<span className='employee__id'>(id: {id})</span>
						</h1>
						{error && <p>{error}</p>}
					</div>
				)}

				<div className='employee__inner-wrapper'>
					<div className='employee__info'>
						{employee ? (
							<>
								<p>Position: {employee.workTitle}</p>
								<p>Information: {employee.information? employee.information : `highly skilled and dedicated professional with extensive experience in ${employee.workTitle}. With a strong background in ${employee.workTitle}.`}</p>
							</>
						) : ( !loading &&
							<p>No employee found.</p>
						)}
					</div>

					{employee && (
						<img
							src={
                                
								employee.imageUrl && employee.imageUrl.trim() !== ''
									? employee.imageUrl
									: '/filestock/user.svg'
							}
							alt={employee.name || 'User'}
							className='employee__image'
							onError={(e) => {
								e.target.onerror = null
								e.target.src = '/filestock/user.svg'
							}}
						/>
					)}
				</div>
			</div>
		</div>
	)
}

export default EmployeePage
