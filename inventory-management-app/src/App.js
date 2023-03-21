// import { Button, Typography } from "@mui/material";
// import InventoryIcon from '@mui/icons-material/Inventory';
import SideBar from "./pages/SideBar";
import Feed from "./pages/Feed";
import Rightbar from "./pages/Rightbar";
import Navbar from "./pages/Navbar";
import { Box, Stack } from "@mui/material";
import HomePage from "./pages/Home/HomePage";
import { BrowserRouter as Router, Route, Routes, Switch} from "react-router-dom";
import Items from "./pages/Items/Items";
import { Paper } from "@mui/material";


function App() {
	return (
		<Router>
				<Box>
					<Navbar/>
					<Stack direction="row" spacing={2}
						justifyContent="space-between"
					> 
						<SideBar/>
						<Feed/>
						<Rightbar/>
					</Stack>
				</Box>
		</Router>
	);
}

export default App;
