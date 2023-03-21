import { Box, Table, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';

import React from 'react'
import HomePage from './Home/HomePage';
import Items from './Items/Items';
import Category from './Category/Category';
import Vendors from './Vendors/Vendors';
import Shelf from './Inventory Locations/Shelf/Shelf';
const Feed = () => {
	return (
		<Box 
			// bgcolor="skyblue" 
			flex={4} p={2}
		>
			<Routes>
				<Route path="/" element={<HomePage/>}></Route >
				<Route path="/shelfs" element={<Shelf/>}></Route>
				<Route path='/items' element= {<Items/>}></Route>
				<Route path='/category' element= {<Category/>}></Route>
				<Route path='/vendors' element= {<Vendors/>}></Route>
			</Routes>
		</Box>
	)
}

export default Feed;