import { Paper, Box, Button, InputAdornment, Table, TableBody, TableCell, TableHead, TablePagination, TableRow, TableSortLabel, Toolbar, Grid } from "@mui/material"
import React, { useEffect , useState} from "react";

import base_url from "../../api/constants";
import axios from "axios";
import ActionButton from "../../components/ActionButton";
import LocationOnIcon from '@mui/icons-material/LocationOn';

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import Input from "../../components/Input";
import { AddCircleOutline, FilterList, OutboxRounded, Search } from "@mui/icons-material";
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';
import Popup from "../../components/Popup";
import { makeStyles } from '@mui/styles';
import AddItem from "./AddItem";
import ItemLocations from "./ItemLocations";
import FilterListPopUp from "./FilterListPopUp";
import AddMoreItems from "./AddMoreItems";
import Tooltip from '@mui/material/Tooltip';
import Alert from '@mui/material/Alert';

const dialogTitle = "Add Item";
const editItemDialogTitle = "Edit Item";
const filterItemDialogTitle = "Filter Item";
const addMoreItemsDialogTitle = "Place more items";

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

const Items = () => {
	const classes = useStyles();
	const [items, setItems] = useState();
	const [errorMessage, setErrorMessage] = useState("");

	const [searchQuery, setSearchQuery] = useState("");

	const pageSizes = [5,10, 15];
	const [pageNumber, setPageNumber] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(pageSizes[pageNumber]);

	const [order, setOrder] = useState();
	const [orderBy, setOrderBy] = useState();

	const [openPopup, setOpenPopup] = useState(false);
	const [itemForEdit, setItemForEdit] = useState();

	const [vendors, setVendors] = useState();
	const [categories, setCategories] = useState();
	const [shelfs, setShelfs] = useState();


	const [viewItemLocations, setViewItemLocations] = useState(false);
	const [itemSelected, setItemSelected] = useState();
	const [isDeleteButtonEnabled, setIsDeleteButtonEnabled] = useState(false);

	const [isfilterPopUpOpen, setIsFilterPopUpOpen] = useState(false);

	const [filterListItems, setFilterListItems] = useState();

	const [addMoreItemsPopUp, setAddMoreItemsPopUp] = useState();

	const [pickUpItemsOptionEnabled, setPickUpItemsOptionEnabled] = useState();

	useEffect(() => {
		document.title="Items";
		getAllItems();
		getAllShelfs();
		getAllCategories();
		getAllVendors();
	},[itemForEdit, addMoreItemsPopUp, viewItemLocations]);

	const getAllItems = () => {
		axios.get(`${base_url}/items`).then(
			(response) => {
				setItems(response.data);
			},
			(error) => {
				setErrorMessage(error.response.data.message);
			}
		)
	}

	const getAllShelfs = () => {
		axios.get(`${base_url}/shelfs`).then(
			(response) => {
				setShelfs(response.data);
			},
			(error) => {
			}
		)
	}

	const getAllCategories = () => {
		axios.get(`${base_url}/categories`).then(
			(response) => {
				setCategories(response.data);
			},
			(error) => {
			}
		);

	}

	const getAllVendors = () => {
		axios.get(`${base_url}/vendors`).then(
			(response) => {
				setVendors(response.data);
			},
			(error) => {
			}
		)
	}

	// search item
	const search = (items) => {
		if (items != null) {
			if(searchQuery === ""){
				return items;
			} else {
				// const columns = vendors[0] && Object.keys(=vendors[0]);
				return items.filter((item) => item.itemName.toLowerCase().includes(searchQuery.toLowerCase()))
			}
		}
	}

	const filterData = async (filter) =>  {
		if (filter.length !== 0) {
			const requestBody = {
				"globalOperator" : "AND",
				"searchRequestDto" : filter
			}
			await axios.post(`${base_url}/items/filterspecification`, requestBody).then(
				(response) => {
					setFilterListItems(response.data);
					setErrorMessage("");
				},
				(error) => {
				}
			)
		}
		setIsFilterPopUpOpen(false);
	}

	// pagination
	const getPageData = (data) => data.slice(pageNumber * rowsPerPage, (pageNumber + 1) * rowsPerPage);

	const headCells = [
		{
			id : 'itemId',
			label : 'Item ID'
		},
		{
			id : 'itemName',
			label : 'Item'
		},
		{
			id : 'pricePerUnit',
			label : 'Price Per Unit'
		},
		{
			id : 'categoryId',
			label : 'Category Name'
		},
		{
			id : 'vendorId',
			label : 'Vendor Name'
		},
		{
			id : 'actions',
			label : 'Actions'
		},
	];

	const handlePageChange = (event, newPage) => {
		setPageNumber(newPage);
	}

	const handleRowsPerPageChange = (event) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPageNumber(0);
	}

	const CustomTablePagination = () => (
		<TablePagination
			component="div"
			page={pageNumber}
			rowsPerPageOptions={pageSizes}
			rowsPerPage={rowsPerPage}
			count={items ? items.length : 0}
			onPageChange={handlePageChange}
			onRowsPerPageChange={handleRowsPerPageChange}
		/>
	)

	const handleItemSearch = (e) => {
		let target = e.target;
		setSearchQuery(target.value);
		setPageNumber(0);
	}

	const openInPopUp = (item) => {
		const category = categories.filter((category) => category.categoryId === item.category.categoryId);
		const vendor = vendors.filter((vendor) => vendor.vendorId === item.vendor.vendorId);

		setItemForEdit({
			...item,
			category: category[0],
			vendor: vendor[0]
		})

		setOpenPopup(true);
	}

	

	const addItemToDB = (item) => {
		const requestBody = {
			itemName : item.itemName,
			category: {
				categoryId : item.category.categoryId,
			},
			vendor: {
				vendorId : item.vendor.vendorId,
			},
			pricePerUnit : item.pricePerUnit,
			capacityConsumption : item.capacityConsumption,
			quantities : [{
				shelf : {
					shelfId : item.shelfId,
				},
				quantity : item.quantity
			}]
		}
		axios.post(`${base_url}/items`, requestBody).then(
			(response) => {
				if (response.data.code === 208) {
					setErrorMessage("Item already exists : " + item.itemName);
				} else {
					setErrorMessage("");
				}
				getAllItems();
			},
			(error) => {
				setErrorMessage(error.response.data.message + " : " + item.itemName);
			}
		)
	}

	const updateItemToDB = (item) => {
		axios.put(`${base_url}/items`, item).then(
			(response) => {
			}
		)
	}

	const addOrEditItem = async (item, resetForm) => {
		if (item.itemId === 0) {
			addItemToDB(item);
		} 
		else {
			updateItemToDB(item);
		}
		resetForm();
		setItemForEdit(null);
		setOpenPopup(false);
	}

	const deleteItem = async (itemId) => {
		axios.delete(`${base_url}/items/${itemId}`).then(
			(response) => {
				const newItems = items.filter((item) => item.itemId !== itemId);
				setItems(newItems);
				getAllItems();
			},
			(error) => {
			}
		);
		setViewItemLocations(false);
		setFilterListItems(null);
	}

	const addMoreItems = (itemId, shelfId, quantity) => {
		axios.put(`${base_url}/items/${itemId}/${shelfId}/${quantity}`).then(
			(response) => {
			},
			(error) => {
			}
		)

		setAddMoreItemsPopUp(false);
	}

	const deductItems = (shelfId, itemId, quantity) => {
		axios.post(`${base_url}/items/deduct/${itemId}/${shelfId}/${quantity}`).then(
			(response) => {
			}, 
			(error) => {
			}
		)
		setViewItemLocations(false);

	}

	const ActionComponent = (props) => (
		<TableCell>
			<ActionButton
					color="secondary"
					onClick={() => {
						setAddMoreItemsPopUp(true);
						setItemSelected(props.item);
					}}
				>
				<Tooltip title="Add more items">
					<AddCircleOutline/>
				</Tooltip>
			</ActionButton>
			<ActionButton
				color="secondary"
				onClick={() => {
					setViewItemLocations(true);
					setItemSelected(props.item);
					setIsDeleteButtonEnabled(false);
					setPickUpItemsOptionEnabled(false);
				}}
			>
				<Tooltip title="View item shelf locations">
					<LocationOnIcon/>
				</Tooltip>
			</ActionButton>
			<ActionButton
				onClick={() => {
					setViewItemLocations(true);
					setItemSelected(props.item);
					setPickUpItemsOptionEnabled(true);
					setIsDeleteButtonEnabled(false);
				}}
			>
				<Tooltip title="Pick up items">
					<OutboxRounded/>
				</Tooltip>
			</ActionButton>
			<ActionButton
				color="primary"
				onClick={() => {
					openInPopUp(props.item);
					setFilterListItems(null);
					setPickUpItemsOptionEnabled(false);
				}}
			>
				<Tooltip title="Edit item details">
					<EditIcon fontSize="small" />
				</Tooltip>
				
			</ActionButton>
			<ActionButton
				color="secondary"
				onClick={() => {
					setViewItemLocations(true);
					setItemSelected(props.item);
					setIsDeleteButtonEnabled(true);
					setPickUpItemsOptionEnabled(false);
				}}
			>
				<Tooltip title="Delete item">
					<DeleteIcon/>
				</Tooltip>
			</ActionButton>
		</TableCell>
	);

	// sorting

	const EnhancedTableHead = () => {
		return (
			<TableHead>
				{
					headCells.map(headCell => (
						<TableCell key={headCell.id} 
							sortDirection={orderBy === headCell.id ? order : false}
							align="center"
						>
							{
								headCell.disableSorting ? headCell.label :
									<TableSortLabel
										active={orderBy === headCell.id}
										direction={orderBy === headCell.id ? order : 'asc'}
										onClick={() => {
											handleSortRequest(headCell.id)
										}}
									>
										{headCell.label}
									</TableSortLabel>

							}
						</TableCell>
					))
				}
			</TableHead>
		)
	}

	const handleSortRequest = (cellId) => {
		const isAscending = orderBy === cellId && order === 'asc';
		setOrder(isAscending ? 'desc' : 'asc');
		setOrderBy(cellId);
	}

	const descendingComparator = (a, b, orderBy) => {
		if (b[orderBy] < a[orderBy]) {
			return -1;
		}
 
		if (b[orderBy] > a[orderBy]) {
			return 1;
		}

		return 0;
	}

	const getComparator = () => {
		return order === 'desc' 
			? (a, b) => descendingComparator(a, b, orderBy)
			: (a, b) => -descendingComparator(a, b, orderBy)
	}

	const stableSort = (array, comparator) => {
		const stabilizedThis = array.map((el, index) => [el, index]);
		stabilizedThis.sort((a, b) => {
			const order = comparator(a[0], b[0]);
			if (order !== 0) return order;
			return a[1] - b[1];
		});
		return stabilizedThis.map((el) => el[0]);
	}

	const getDialogTitle = () => {
		if (isDeleteButtonEnabled) {
			return "Delete Item";
		} else if(pickUpItemsOptionEnabled) {
			return "Pick up Items"
		} else {
			return "View item locations";
		}
	}

	return (
		<Box sx={{ width: '120%', mb: 2 }} >
			{
				errorMessage && 
				<Alert variant="outlined" severity="error">
					{errorMessage}
				</Alert>
			}
			{
				<>
					<Paper className={classes.pageContent} >
						<Toolbar>
							<Grid item m={1} pr={1}>
								<Input
									name="itemName"
									label="Search Item"
									className="search-item"
									InputProps={{
										startAdornment: (
											<InputAdornment>
												<Search/>
											</InputAdornment>
											
										)
									}}
									onChange={handleItemSearch}
								/>
							</Grid>
							<Grid item m={1} pr={1}>
								<Button
									variant="outlined"
									className="add-new-vendor-button"
									onClick={() => {
										setOpenPopup(true)
										setItemForEdit(null);
									}}
								>
									<AddIcon
										className="add-vendor"
										text="Add New"
									/>
									<p>Add New item</p>
								</Button>
							</Grid>

							<Grid item m={1} >
								<Button
									onClick={() => {
										setIsFilterPopUpOpen(true);
									}}
								>
									<FilterList/>
									<p>Filter List</p>
								</Button>
							</Grid>
							<Button
								onClick={() => {
									setFilterListItems(null);
								}}
							>
								<FilterAltOffIcon/>
								<p>Clear Filter</p>
							</Button>
						</Toolbar>
						{
							items && (
								<>
									<Table>
										<EnhancedTableHead/>
										<TableBody>
											{
												getPageData(stableSort(search(filterListItems ? filterListItems : items), getComparator())).map(item => (
													<TableRow key={item.itemId}>
														<TableCell align="center">
															{item.itemId}
														</TableCell>
														<TableCell align="center">
															{item.itemName}
														</TableCell>
														<TableCell align="center">
															{item.pricePerUnit}
														</TableCell>
														<TableCell align="center">
															{item.category.categoryName}
														</TableCell>
														<TableCell align="center">
															{item.vendor.vendorName}
														</TableCell>
														<ActionComponent
															item = {item}
														/>
													</TableRow>
												))
											}
										</TableBody>
									</Table>
									<CustomTablePagination/>
								</>
							)
						}
					</Paper>
					<Popup
						openPopup={openPopup}
						dialogTitle={itemForEdit ?  editItemDialogTitle : dialogTitle}
						setOpenPopup={setOpenPopup}
					>
						<AddItem
							categories={categories}
							vendors={vendors}
							itemForEdit = {itemForEdit}
							addOrEditItem = {addOrEditItem}
							shelfs={shelfs}
						/>
					</Popup>
					<Popup
						openPopup={viewItemLocations}
						dialogTitle={getDialogTitle()}
						setOpenPopup={setViewItemLocations}
					>
						<ItemLocations
							deleteItem= {deleteItem}
							isDeleteButtonEnabled={isDeleteButtonEnabled}
							itemSelected={itemSelected}
							pickUpItemsOptionEnabled={pickUpItemsOptionEnabled}
							deductItems={deductItems}
						/>
					</Popup>
					<Popup
						openPopup={isfilterPopUpOpen}
						dialogTitle={filterItemDialogTitle}
						setOpenPopup={setIsFilterPopUpOpen}
					>
						<FilterListPopUp
							categories={categories}
							vendors={vendors}
							filterData={filterData}
						/>
					</Popup>
					<Popup
						openPopup={addMoreItemsPopUp}
						dialogTitle={addMoreItemsDialogTitle}
						setOpenPopup={setAddMoreItemsPopUp}
					>
						<AddMoreItems
							item={itemSelected}
							shelfs={shelfs}
							addMoreItems={addMoreItems}
						/>
					</Popup>
				</>
			}
		</Box>
	)
}

export default Items;