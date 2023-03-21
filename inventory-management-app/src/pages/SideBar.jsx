
import { CategoryRounded, Home, InboxOutlined, People, StackedBarChart, TableRows} from '@mui/icons-material';
import Inventory from '@mui/icons-material/Inventory';
import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { Link } from 'react-router-dom';

import React from 'react'
import HomePage from './Home/HomePage';
import Items from './Items/Items';
import { Paper } from '@material-ui/core';
const Sidebar = () => {
	return (
			<Box 
				// bgcolor="skyblue" 
				flex={1} p={2}
				sx={{display: { xs : "none", sm : "block"}}}
			>
				<List>
					<ListItem disablePadding>
						<Link to="/">
							<ListItemButton component="a">
								<ListItemIcon>
									<Home/>
								</ListItemIcon>
								<ListItemText primary="Home page"></ListItemText>
							</ListItemButton>
						</Link>
					</ListItem>
					<ListItem disablePadding>
						<Link to="/shelfs">
							<ListItemButton component="a">
								<ListItemIcon>
									<StackedBarChart/>
								</ListItemIcon>
								<ListItemText primary="Shelfs"></ListItemText>
							</ListItemButton>
						</Link>
					</ListItem>
					<ListItem disablePadding>
						<Link to="/items">
							<ListItemButton component="a" >
								<ListItemIcon>
									<Inventory/>
								</ListItemIcon>
								<ListItemText primary="Items"></ListItemText>
							</ListItemButton>
						</Link>
					</ListItem>
					<ListItem disablePadding>
						<Link to="/category">
							<ListItemButton component="a">
								<ListItemIcon>
									<CategoryRounded/>
								</ListItemIcon>
								<ListItemText primary="Category"></ListItemText>
							</ListItemButton>
						</Link>
					</ListItem>
					<ListItem disablePadding>
						<Link to="/vendors">
							<ListItemButton component="a" >
								<ListItemIcon>
									<People/>
								</ListItemIcon>
								<ListItemText primary="Vendors"></ListItemText>
							</ListItemButton>
						</Link>
					</ListItem>
				</List>

			</Box>
	)
}

export default Sidebar;