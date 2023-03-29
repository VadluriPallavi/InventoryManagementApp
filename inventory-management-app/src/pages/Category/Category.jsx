import { Box, InputAdornment, Paper, Table, TableBody, TableCell, TableHead, TableRow, Toolbar, Button, TableSortLabel, TablePagination, Grid } from "@mui/material"
import React, { useEffect , useState} from "react";
import axios from "axios";
import base_url from "../../api/constants";

import './Category.css';
import Controls from "../../components/Controls";
import { Search } from "@mui/icons-material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Popup from "../../components/Popup";
import AddCategory from "./AddCategory";
import ActionButton from "../../components/ActionButton";
import { makeStyles } from '@mui/styles';
import Alert from '@mui/material/Alert';
import AddIcon from '@mui/icons-material/Add';
import { getAllCategories } from "../../services/categoryService";

const dialogTitle = "Add Category";

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

const Category = () => {
	const classes = useStyles();
	const [categories, setCategories] = useState(null);

	const [errorMessage, setErrorMessage] = useState("");
	
	const [searchQuery, setSearchQuery] = useState("");

	const pageSizes = [5,10, 15];
	const [pageNumber, setPageNumber] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(pageSizes[pageNumber]);
	

	const [order, setOrder] = useState();
	const [orderBy, setOrderBy] = useState();

	const [openPopup, setOpenPopup] = useState(false);
	const [categoryForEdit, setCategoryForEdit] = useState();

	useEffect(() => {
		document.title="Category";
		getAllCategories();
	}, [categoryForEdit]);

	const getAllCategories = () => {
		axios.get(`${base_url}/categories`).then(
			(response) => {
				setCategories(response.data);
				setErrorMessage("");
			},
			(error) => {
				setErrorMessage(error.response.data.message);
			}
		)

	}

	// search category
	const search = (categories) => {
		if (categories != null) {
			if(searchQuery === ""){
				return categories;
			} else {
				const columns = categories[0] && Object.keys(categories[0]);
				return categories.filter((category) => category.categoryName.toLowerCase().includes(searchQuery))
			}
		}
	}


	// pagination
	const getPageData = (data) => data.slice(pageNumber * rowsPerPage, (pageNumber + 1) * rowsPerPage);

	const headCells = [
		{
			id : 'categoryName',
			label : 'Categories'
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
			count={categories ? categories.length : 0}
			onPageChange={handlePageChange}
			onRowsPerPageChange={handleRowsPerPageChange}
		/>
	)


	const handleCategorySearch = (e) => {
		let target = e.target;
		setSearchQuery(target.value);
		setPageNumber(0);
	}

	const openInPopUp = (item) => {
		setCategoryForEdit(item);
		setOpenPopup(true);
	}

	const addCategoryToDB = async (category) => {
		await axios.post(`${base_url}/categories`, category).then(
			(response) => {
				getAllCategories();
			},
			(error) => {
				setErrorMessage(error.response.data.message + " : " + category.categoryName);
			}
		);
		
	}

	const updateCategoryToDB = (category) => {
		axios.put(`${base_url}/categories`, category);
	}

	const addOrEditCategory = async (category, resetForm) => {
		if (category.id === 0) {
			addCategoryToDB(category);
		} else {
			updateCategoryToDB(category);
		}
		resetForm();
		setCategoryForEdit(null);
		setOpenPopup(false);
	}


	// sorting

	const EnhancedTableHead = (props) => {
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
		<Box sx={{ width: '120%', mb: 2 }}>
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
								<Controls.Input
									name="categoryName"
									label="Search Categories"
									className="search-category"
									InputProps={{
										startAdornment: (
											<InputAdornment>
												<Search/>
											</InputAdornment>
										)
									}}
									onChange={handleCategorySearch}
								/>
							</Grid>
							<Grid item m={1} pr={1}>
								<Button
									text="Add category"
									variant="outlined"
									className="add-new-category-button"
									onClick={() => {
										setOpenPopup(true)
										setCategoryForEdit(null);
									}}
								>
									<AddIcon
										className="add-category"
										text="Add New"
									/>
									<p>Add new category</p>
								</Button>
							</Grid>
						</Toolbar>
						{
							categories && (
								<>
									<Table>
										<EnhancedTableHead/>
										<TableBody>
											{
												getPageData(stableSort(search(categories), getComparator())).map(category => (
													<TableRow key={category.id}>
														<TableCell>
															{category.categoryName}
														</TableCell>
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
						dialogTitle={dialogTitle}
						setOpenPopup={setOpenPopup}
					>
						<AddCategory
							categoryForEdit = {categoryForEdit}
							addOrEditCategory = {addOrEditCategory}
						/>
					</Popup>
				</>
			}
		</Box>
	)
}

export default Category;