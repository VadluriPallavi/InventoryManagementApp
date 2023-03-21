import { Box } from '@mui/material';
import React from 'react'
const Rightbar = () => {
	return (
		<Box flex={1} p={2} 
		sx={{display: { xs : "none", sm : "block"}}}
		></Box>
	)
}

export default Rightbar;