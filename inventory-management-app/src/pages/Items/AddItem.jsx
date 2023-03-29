import { Autocomplete, Button, Grid, TextField } from '@mui/material';
import { values } from 'lodash';
import { useEffect } from 'react';
import {React, useState} from 'react';
import { Form, useCustomForm } from '../../components/Form';
import Input from '../../components/Input';
import base_url from "../../api/constants";
import axios from "axios";
import Alert from '@mui/material/Alert';

const initialFValues = {
	itemId: 0,
	itemName: "",
	category: {
		categoryId: "",
		categoryName: ""
	},
	vendor: {
		vendorId: "",
		vendorName:"",
		vendorLink:""
	},
	pricePerUnit: "",
	capacityConsumption:"",
	quantity: "",
	shelfId: ""
}

const AddItem = (props) => {


	const { itemForEdit, addOrEditItem, shelfs } = props;

	const [selectedCategory, setSelectedCategory] = useState();
	const [selectedVendor, setSelectedVendor] = useState();
	const [selectedShelfID, setSelectedShelfID] = useState(0);
	const [remainingShelfSpace, setRemainingShelfSpace] = useState(100);

	const [vendors, setVendors] = useState();
	const [vendorsErrorMessage, setVendorsErrorMessage] = useState();

	const [categories, setCategories] = useState(null);
	const [categoriesErrorMessage, setCategoriesErrorMessage] = useState();

	const validate = (fieldValues = values) => {

		let temp = {...errors}
		if ('itemName' in fieldValues) {
			if (fieldValues.itemName === "") {
				temp.itemName = "This field is required."
			}
			else if ((/^[a-zA-Z0-9_]*$/).test(fieldValues.itemName) ) {
				temp.itemName = "";
			} else {
				temp.itemName = "Item Name is not valid";
			}
		}

		if ('pricePerUnit' in fieldValues) {
			if(fieldValues.pricePerUnit === "") {
				temp.pricePerUnit = "This field is required";
			} else if ((/^[0-9]+$/).test(fieldValues.pricePerUnit)) {
				temp.pricePerUnit = ""; 
			} else {
				temp.pricePerUnit = "Price Per Unit is not valid"
			}
		}

		if (fieldValues.category.categoryId === "") {
			temp.category = "Category is required";
		}

		if (fieldValues.vendor.vendorId === "") {
			temp.vendor = "This field is required";
		}


		if ('capacityConsumption' in fieldValues) {
			if(fieldValues.capacityConsumption === "") {
				temp.capacityConsumption = "This field is required";
			} else if ((/^[0-9]+$/).test(fieldValues.capacityConsumption)) {
				temp.capacityConsumption = ""; 
			} else {
				temp.capacityConsumption = "capacityConsumption is not valid"
			}
		}

		if ('shelfId' in fieldValues) {
			if (itemForEdit) {
				temp.shelfId = "";
			} else {
				temp.shelfId = fieldValues.shelfId ? "" : "Shelf ID is required";
			}
		}
			

		if ('quantity' in fieldValues) {
			if (itemForEdit) {
				temp.quantity = ""; 
			}
			else if(fieldValues.quantity === "") {
				temp.quantity = "This field is required";
			} else if ((/^[0-9]+$/).test(fieldValues.quantity)) {
				temp.quantity = ""; 
			} else {
				temp.quantity = "Quantity is not valid"
			}
		}
		setErrors({
			...temp
		})
		
		if (fieldValues === values) {
			return Object.values(temp).every(x => x === "");
		}
	}

	const {
		values, 
		setValues,
		errors,
		setErrors,
		handleInputChange,
		resetForm
	} = useCustomForm(initialFValues, true, validate);

	useEffect(() => {
		if (itemForEdit != null) {
			setValues({
				...itemForEdit
			});
		}

		getAllVendors();
		getAllCategories();

	}, [itemForEdit]);

	const getAllVendors = () => {
		axios.get(`${base_url}/vendors`).then(
			(response) => {
				setVendors(response.data);
				setVendorsErrorMessage("")
			},
			(error) => {
				setVendorsErrorMessage(error.response.data.message);
			}
		)
	}

	const getAllCategories = () => {
		axios.get(`${base_url}/categories`).then(
			(response) => {
				setCategories(response.data);
				setCategoriesErrorMessage("");
			},
			(error) => {
				setCategoriesErrorMessage(error.response.data.message);
			}
		)

	}


	useEffect(() => {
		if (selectedShelfID) {
			getRemainingShelfSpace(selectedShelfID);
		}
	},[selectedShelfID]);

	const getRemainingShelfSpace = () => {

		axios.get(`${base_url}/shelf/space/${selectedShelfID}`).then(
			(response) => {
				setRemainingShelfSpace(response.data);
			},
			(error) => {
			}
		)
	}
 

	const handleSubmit = e => {

		e.preventDefault();
		values.category = selectedCategory ? selectedCategory : values.category;
		values.vendor = selectedVendor? selectedVendor : values.vendor;
		values.shelfId = selectedShelfID;

		if (validate()) {
			if (itemForEdit) {
				addOrEditItem(values, resetForm);
			} else {
				if (itemsCanBePlaced()) {
					addOrEditItem(values, resetForm);
				} else {
					const quantity = "quantity";
					setErrors({
						[quantity] : "Not enough space in shelf"
					});
				}
			}
			
		}
	}

	const itemsCanBePlaced = () => {
		const capacityConsumption = values.capacityConsumption;
		const quantity = values.quantity;
		if(parseInt(capacityConsumption) * parseInt(quantity) <= remainingShelfSpace) {
			return true;
		}else{
			return false;
		}
	}
	

	return (
		<Form onSubmit={handleSubmit}>
			<Grid container>
				<Grid item xs={5} m={1}>
					<Grid item pb={2} sx={{ width: 185 }}>
						<Input
							name="itemName"
							label="Item"
							value={values.itemName}
							defaultValue={values.itemName}
							onChange={handleInputChange}
							error={errors.itemName}
						/>
					</Grid>
					<Grid item pb={2} sx={{ width: 185 }}>
						<Input
							name="pricePerUnit"
							label="Price Per Unit"
							value={values.pricePerUnit}
							defaultValue={values.pricePerUnit}
							onChange={handleInputChange}
							error={errors.pricePerUnit}
						/>
					</Grid>
					<Grid item pb={2} sx={{ width: 185 }}>
						{
							categories && values.category && (
								<Autocomplete
									options={categories}
									sx={{ width: 185 }}
									getOptionLabel={(option) => option.categoryName.toString()}
									renderInput={(params) => <Input 
										name="categoryId" 
										{...params} 
										label="Category *"
										error={errors.category}
									/>}
									// defaultValue={categories[0]}
									isOptionEqualToValue={(option, value) => option.categoryId === value.categoryId}
									defaultValue={values.category}
									onChange={(event,value) => {
										setSelectedCategory(value);
										setErrors({})
									}}
								/>
							)
						}
						{
							categoriesErrorMessage && 
							<Alert variant="outlined" severity="error">
								{categoriesErrorMessage}
							</Alert>
						}
					</Grid>
					<Grid item pb={2} sx={{ width: 185 }}>
						{
							vendors && (
								<Autocomplete
									options={vendors}
									sx={{ width: 185 }}
									getOptionLabel={(option) => option.vendorName.toString()}
									renderInput={(params) => <Input 
										name="vendorId" 
										{...params} 
										label="Vendor *"
										error={errors.vendor}
									/>}
									// defaultValue={initialVendorValues}
									isOptionEqualToValue={(option, value) => option.vendorId === value.vendorId}
									defaultValue={values.vendor}
									onChange={(event, value) => {
										setSelectedVendor(value);
										setErrors({})
									}}
								/>
							)
						}
						{
							vendorsErrorMessage && 
							<Alert variant="outlined" severity="error">
								{vendorsErrorMessage}
							</Alert>
						}
					</Grid>
				</Grid>
				<Grid item xs={5} m={1} >

					<Grid item  m={1} pb={1} sx={{ width: 190 }}>
						<Autocomplete
							disabled = {itemForEdit ? true : false}
							sx={{ width: 185 }}
							options={shelfs}
							getOptionLabel={(option) => option.shelfId.toString()}
							renderInput={(params) => <Input 
									{...params}
									variant="outlined"
									label="Shelf ID"
									error={errors.shelfId}
								/>
							}
							onChange={(event, value) => {
								setSelectedShelfID(value ? value.shelfId : 0)
								setErrors({})
							}}
						/>
					</Grid>
					<Grid item m={1} pb={1} sx={{ width: 190 }}> 
						<Input
							disabled = {itemForEdit ? true : false}
							name="capacityConsumption"
							label="Capacity Consumption"
							value={values.capacityConsumption}
							defaultValue={values.capacityConsumption}
							onChange={handleInputChange}
							error={errors.capacityConsumption}
						/>
					</Grid>
					<Grid item m={1} sx={{ width: 190 }}>
						<Input
							disabled = {itemForEdit ? true : false}
							name="quantity"
							label="Quantity"
							value={values.quantity}
							defaultValue={values.quantity}
							onChange={handleInputChange}
							error={errors.quantity}
						/>
					</Grid>
					<Grid item m={1} pb={1} sx={{ width: 185 }}>
						<Button 
							variant="contained"
							color="primary"
							type="submit"
						>
							{
								itemForEdit && 
								<p>Confirm Edit</p>
							}
							{
								itemForEdit === null && 
								<p>Add</p>
							}
						</Button>
					</Grid>
				</Grid>
			</Grid>
		</Form>
	)
}

export default AddItem;