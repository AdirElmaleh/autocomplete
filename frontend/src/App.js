import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Autocomplete from './components/Autocomplete/Autocomplete';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import EmployeePage from './components/Employee/EmployeePage';

function App() {
	return (
		<Router>
			<div className="main">
				<Header />
				<Routes>
					<Route path="/" element={<Autocomplete />} />
					<Route path="/employee/:id" element={<EmployeePage />} />
				</Routes>
				<Footer />
			</div>
		</Router>
	);
}

export default App;
