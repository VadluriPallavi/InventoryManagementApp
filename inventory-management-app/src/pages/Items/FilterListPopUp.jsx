import { Autocomplete, Button, Grid, TextField } from '@mui/material';
import React from 'react';
import { useState } from 'react';
import Input from '../../components/Input';


const FilterListPopUp = (props) => {

	const {categories, vendors, filterData} = props;

	const [categorySelected, setCategorySelected] = useState();
	const [vendorSelected, setVendorSelected] = useState();
	const [minimumPriceSelected, setMinimumPriceSelected] = useState();
	const [maximumPriceSelected, setMaximumPriceSelected] = useState();


	const handleApplyHandler = () => {
		const filter = [];
		if (categorySelected) {
			filter.push(
				{
					"column" : "categoryId",
					"value" : categorySelected.categoryId,
					"operation" : "EQUAL"
				}
			);
		}

		if (vendorSelected) {
			filter.push(
				{
					"column" : "vendorId",
					"value" : vendorSelected.vendorId,
					"operation" : "EQUAL"
				}
			)
		}

		if (minimumPriceSelected) {
			filter.push(
				{
					"column" : "pricePerUnit",
					"value" : minimumPriceSelected - 1,
					"operation" : "GREATER_THAN"
				}
			)
		}

		if (maximumPriceSelected) {
			filter.push(
				{
					"column" : "pricePerUnit",
					"value" : parseInt(maximumPriceSelected) + 1,
					"operation" : "LESS_THAN"
				}
			)
		}

		filterData(filter);
	}

	return (
		<div>
			<Grid item xs={1} m={2} pb={1}>
				<Autocomplete
					options={categories}
					sx={{ width: 195 }}
					getOptionLabel={(option) => option.categoryName.toString()}
					renderInput={(params) => <TextField {...params} label="Category"/>}
					isOptionEqualToValue={(option, value) => option.categoryId === value.categoryId}
					onChange={(event, value) => {
						setCategorySelected(value);
					}}
				/>
			</Grid>
			<Grid item xs={1} m={2} pb={1}>
				<Autocomplete
					options={vendors}
					sx={{ width: 195 }}
					getOptionLabel={(option) => option.vendorName.toString()}
					renderInput={(params) => <TextField {...params} label="Vendor"/>}
					isOptionEqualToValue={(option, value) => option.vendorId === value.vendorId}
					onChange={(event, value) => {
						setVendorSelected(value);
					}}
				/>
			</Grid>
			<Grid item xs={1} m={2} pb={1}>
				<Input
					name="minPriceRange"
					label="Minimum Price"
					variant="outlined"
					onChange={(e) => {
						setMinimumPriceSelected(e.target.value);
					}}
				/>
			</Grid>
			<Grid item xs={1} m={2} pb={1}>
				<Input
					name="maxPriceRange"
					label="Maximum Price"
					variant="outlined"
					onChange={(e) => {
						setMaximumPriceSelected(e.target.value);
					}}
				/>
			</Grid>
			<Grid item xs={5} m={2} pb={1}>
				<Button 
					variant="contained"
					color="primary"
					type="submit"
					onClick={handleApplyHandler}
				>
					Apply
				</Button>
			</Grid>
		</div>
	)
}

export default FilterListPopUp;