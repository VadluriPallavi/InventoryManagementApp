import {React, useState} from 'react';
import axios from "axios";
import base_url from '../../api/constants';
import { Grid, Button} from '@mui/material';
import Input from '../../components/Input';
import  {Form, useCustomForm } from '../../components/Form';
import ActionButton from '../../components/ActionButton';
import { useEffect } from 'react';

const initialFValues = {
	id : 0,
	categoryName : ''
}

const AddCategory = (props) => {

	const { categoryForEdit, addOrEditCategory} = props;

	const validate = (fieldValues = values) => {

		let temp = {...errors}

		if (fieldValues.categoryName === "") {
			temp.category = "Category is required";
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
		if (categoryForEdit != null) {
			setValues({
				...categoryForEdit
			})
		}
	}, [categoryForEdit]);

	const handleSubmit = e => {
		e.preventDefault()
		addOrEditCategory(values, resetForm);
	}

	return (
		<div>
			<Grid >
				<Grid item xs={1} m={1} pb={1}>
					<Input
						name="categoryName"
						label="Category Name"
						variant="outlined"
						value={values.categoryName}
						onChange={handleInputChange}
						error={errors.categoryName}
					>
					</Input>
				</Grid>
				<Grid item xs={6} m={1} pl={7}>
					<Button 
						variant="contained"
						color="primary"
						type="submit"
						onClick={handleSubmit}
					>
						Submit
					</Button>
					
				</Grid>
			</Grid>
		</div>
	)
}

export default AddCategory;