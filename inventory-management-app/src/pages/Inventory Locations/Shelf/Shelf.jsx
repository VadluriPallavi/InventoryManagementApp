import { Button, Table, TableBody, TableCell, TableHead, TableRow, Toolbar, Paper } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import React from 'react';
import { useEffect , useState} from 'react';
import axios from 'axios';
import base_url from '../../../api/constants';
import { Box } from '@mui/system';
import Popup from '../../../components/Popup';
import { makeStyles } from '@mui/styles';
import AddShelf from './AddShelf';

const dialogTitle = "Add Shelf";

const useStyles = makeStyles(theme => ({
	pageContent: {
		margin: theme.spacing(5),
		padding: theme.spacing(3)
	},
	searchInput: {
		width: '75%'
	},
	newButton: {
		position: 'absolute',
		right: '10px'
	}
}))

const Shelf = () => {
	const classes = useStyles();
	const [shelfs, setShelfs] = useState();
	const [openPopup, setOpenPopup] = useState(false);

	useEffect(() => {
		document.title="Shelfs";
		getAllShelfs();
	}, []);

	const getAllShelfs = () => {
		axios.get(`${base_url}/shelfs`).then(
			(response) => {
				setShelfs(response.data);
			},
			(error) => {
			}
		)
	}

	const addShelfToDB = (shelf) => {
		axios.post(`${base_url}/shelfs`, shelf).then(
			(response) => {
				getAllShelfs();
			},
			(error) => {
			}
		)
	}

	const addShelf = (shelf) => {
		addShelfToDB(shelf);
		setOpenPopup(false);
	}

	return (
		<Box>
			<Paper className={classes.pageContent}>
				<Toolbar>
					<Button
						variant="outlined"
						className="add-new-shelf"
						onClick={() => {
							setOpenPopup(true)
						}}
					>
						<AddIcon/>
						<p>Add shelf</p>
					</Button>
				</Toolbar>
				{
					shelfs && (
						<Table>
							<TableHead>
								<TableCell>
									Shelf ID
								</TableCell>
								<TableCell>
									Shelf Capacity
								</TableCell>
							</TableHead>
							<TableBody>
								{
									shelfs.map((shelf) => (
										<TableRow key={shelf.shelfId}>
											<TableCell>
												{shelf.shelfId}
											</TableCell>
											<TableCell>
												{shelf.shelfCapacity}
											</TableCell>
										</TableRow>
									))
								}
							</TableBody>
						</Table>
					)
				}
			</Paper>
			<Popup
				openPopup={openPopup}
				dialogTitle={dialogTitle}
				setOpenPopup={setOpenPopup}
			>
				<AddShelf
					addShelf={addShelf}
				/>
			</Popup>
		</Box>
	)
}

export default Shelf;