import React, { useEffect, useState} from "react";
import { Paper, Box, Button, InputAdornment, Table, TableBody, TableCell, TableHead, TablePagination, TableRow, TableSortLabel, Toolbar, Grid} from "@mui/material"
import axios from "axios";
import base_url from "../../api/constants";
import Input from "../../components/Input";
import { Search } from "@mui/icons-material";
import ActionButton from "../../components/ActionButton";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Popup from "../../components/Popup";
import AddIcon from '@mui/icons-material/Add';
import AddVendor from "./AddVendor";
import { makeStyles } from '@mui/styles';
import Alert from '@mui/material/Alert';

const dialogTitle = "Add Vendor";

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

const Vendors = () => {
	const classes = useStyles();
	const [vendors, setVendors] = useState();
	const [errorMessage, setErrorMessage] = useState("");

	const [searchQuery, setSearchQuery] = useState("");

	const pageSizes = [5,10, 15];
	const [pageNumber, setPageNumber] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(pageSizes[pageNumber]);

	const [order, setOrder] = useState();
	const [orderBy, setOrderBy] = useState();

	const [openPopup, setOpenPopup] = useState(false);
	const [vendorForEdit, setVendorForEdit] = useState();


	useEffect(() => {
		document.title="Vendors";
		getAllVendors();
	}, [vendorForEdit]);

	const getAllVendors = () => {
		axios.get(`${base_url}/vendors`).then(
			(response) => {
				setVendors(response.data);
				setErrorMessage("");
			},
			(error) => {
				setErrorMessage(error.response.data.message);
			}
		)
	}

	// search vendor
	const search = (vendors) => {
		if (vendors != null) {
			if(searchQuery === ""){
				return vendors;
			} else {
				// const columns = vendors[0] && Object.keys(=vendors[0]);
				return vendors.filter((vendor) => vendor.vendorName.toLowerCase().includes(searchQuery))
			}
		}
	}

	// pagination
	const getPageData = (data) => data.slice(pageNumber * rowsPerPage, (pageNumber + 1) * rowsPerPage);

	const headCells = [

		{
			id : 'vendorName',
			label : 'Vendor'
		},
		{
			id : 'vendorLink',
			label : 'Vendor Link'
		}
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
			count={vendors ? vendors.length : 0}
			onPageChange={handlePageChange}
			onRowsPerPageChange={handleRowsPerPageChange}
		/>
	)

	const handleVendorSearch = (e) => {
		let target = e.target;
		setSearchQuery(target.value);
		setPageNumber(0);
	}

	const openInPopUp = (item) => {
		setVendorForEdit(item);
		setOpenPopup(true);
	}

	const deleteVendor = async (vendorId) => {
		axios.delete(`${base_url}/vendors/${vendorId}`).then(
			(response) => {
				const newVendors = vendors.filter((vendor) => vendor.vendorId !== vendorId);
				setVendors(newVendors);
			},
			(error) => {
			}
		);
		await getAllVendors();
	}

	const addVendorToDB = (vendor) => {
		axios.post(`${base_url}/vendors`, vendor).then(
			(response) => {
				getAllVendors();
			}
		)
	}

	const updateVendorToDB = (vendor) => {
		axios.patch(`${base_url}/vendors/${vendor.vendorId}`, vendor);
	}

	 const addOrEditVendor = async (vendor, resetForm) => {
		if (vendor.vendorId === 0) {
			addVendorToDB(vendor);
		} else {
			updateVendorToDB(vendor);
		}
		resetForm();
		setVendorForEdit(null);
		setOpenPopup(false);
	}

	const ActionComponenet = (props) => (
		<TableCell>
			<ActionButton
				color="primary"
				onClick={() => {
					openInPopUp(props.vendor);
				}}
			>
				<EditIcon fontSize="small" 
				/>
			</ActionButton>
			<ActionButton
				color="secondary"
				onClick={() => deleteVendor(props.vendor.vendorId)}
			>
				<DeleteIcon/>
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

	return (
		<Box>
			{
				errorMessage && 
				<Alert variant="outlined" severity="error">
					{errorMessage}
				</Alert>
			}
			{
				<>
					<Paper className={classes.pageContent}>
						<Toolbar>
							<Grid item m={1} pr={1}>
								<Input
									name="vendorName"
									label="Search Vendors"
									className="search-vendor"
									InputProps={{
										startAdornment: (
											<InputAdornment>
												<Search/>
											</InputAdornment>
											
										)
									}}
									onChange={handleVendorSearch}
								/>
							</Grid>
							<Grid item m={1} pr={1}>
								<Button
									text="Add vendor"
									variant="outlined"
									className="add-new-vendor-button"
									onClick={() => {
										setOpenPopup(true)
										setVendorForEdit(null);
									}}
								>
									<AddIcon
										className="add-vendor"
										text="Add New"
										// fontSize="large"
									/>
									<p>Add new vendor</p>
								</Button>
							</Grid>
						</Toolbar>
						{
							vendors && (
								<>
									<>
										<Table>
											<EnhancedTableHead/>
											<TableBody>
												{
													getPageData(stableSort(search(vendors), getComparator())).map(vendor => (
														<TableRow key={vendor.vendorId}>
															<TableCell>
																{vendor.vendorName}
															</TableCell>
															<TableCell>
																{vendor.vendorLink}
															</TableCell>
															<ActionComponenet
																vendor = {vendor}
															/>
														</TableRow>
													))
												}
											</TableBody>
										</Table>
										<CustomTablePagination/>
									</>
								</>
							)
						}
					</Paper>
					<Popup
						openPopup={openPopup}
						dialogTitle={dialogTitle}
						setOpenPopup={setOpenPopup}
					>
						<AddVendor
							vendorForEdit = {vendorForEdit}
							addOrEditVendor = {addOrEditVendor}
						/>
					</Popup>
				</>
			}
		</Box>
	)
}

export default Vendors;