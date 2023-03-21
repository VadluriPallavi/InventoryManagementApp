import React, { useEffect } from "react";
import { Box } from "@mui/material";


const HomePage = () => {
	useEffect(() => {
		document.title="Home";
	}, []);

	return (
		<Box flex={4} p={2}>
			HOmepage
		</Box>
	)
}

export default HomePage;