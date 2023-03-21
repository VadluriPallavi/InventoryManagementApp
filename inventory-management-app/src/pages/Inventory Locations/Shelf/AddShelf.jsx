import { Button, Grid } from '@mui/material';
import React, {useEffect, useState} from 'react';
import Input from '../../../components/Input';
import { makeStyles } from '@mui/styles';
import { useCustomForm } from '../../../components/Form';


const initialFValues = {
	shelfId: 0,
	shelfCapacity: '',
}

const AddShelf= (props) => {

	const { addShelf } = props;

	const {
		values,
		handleInputChange,
	} = useCustomForm(initialFValues);

	useEffect(() => {
		values.shelfCapacity = 100;
	},[])

	const handleSubmit = (e) => {
		e.preventDefault()
		addShelf(values);
	}
	return (
		<div>
			<Grid>
				<Grid item xs={1} m={1} pb={1}>
					<Input
						disabled
						name="shelfCapacity"
						label="Shelf Capacity"
						value={values.shelfCapacity}
						onChange ={handleInputChange}
						variant="outlined"
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
						Add
					</Button>
				</Grid>
			</Grid>
		</div>
	)
}

export default AddShelf;