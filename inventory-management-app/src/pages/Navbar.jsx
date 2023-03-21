import { AppBar, Box, InputBase, styled, Toolbar, Typography } from '@mui/material';
import React from 'react'
import InventoryIcon from '@mui/icons-material/Inventory';

const StyledToolBar = styled(Toolbar)({
	display: "flex",
	justifyContent: "space-between"
});

const Search = styled("div")(({theme}) => ({
	backgroundColor:"white",
	padding:"0 10px",
	borderRadius: theme.shape.borderRadius,
	width:"40%"
}));

const Icons = styled(Box)(({theme}) => ({
	backgroundColor:"pink",

}))
const Navbar = () => {
	return (
		<AppBar position="sticky">
			<StyledToolBar>
				<Typography variant="h6" sx={{display:{xs:"none", sm: "block"}}}> Inventory Management </Typography>
				<InventoryIcon sx={{display:{xs:"block", sm: "none"}}} ></InventoryIcon>
				{/* <Search><InputBase placeholder="search..."></InputBase></Search>
				<Icons>icons</Icons> */}
			</StyledToolBar>
		</AppBar>
	)
}

export default Navbar;