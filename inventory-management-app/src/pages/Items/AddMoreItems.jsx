
import { Autocomplete, Button, Grid } from "@mui/material";
import TextField from '@mui/material/TextField';
import React from "react";
import { useState , useEffect} from "react";
import base_url from "../../api/constants";
import axios from "axios";
import { useCustomForm } from '../../components/Form';
import Input from '../../components/Input';



const initialFValues = {
	quantity : ""
}

const AddMoreItems = (props) => {
	const { item, shelfs, addMoreItems} = props;
	const [selectedShelfID, setSelectedShelfID] = useState(0);
	const [remainingShelfSpace, setRemainingShelfSpace] = useState(100);

	const validate = (fieldValues = values) => {
		let temp = {...errors}

		if ('shelfId' in fieldValues)
			temp.shelfId = fieldValues.shelfId ? "" : "Shelf ID is required";

		if ('quantity' in fieldValues) {
			if(fieldValues.quantity === "") {
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
		errors,
		setErrors,
		handleInputChange,
	} = useCustomForm(initialFValues, true, validate);

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


	const itemsCanBePlaced = () => {
		const capacityConsumption = item.capacityConsumption;
		const quantity = values.quantity;

		if(parseInt(capacityConsumption) * parseInt(quantity) <= remainingShelfSpace) {
			return true;
		}else{
			return false;
		}
	}

	const handleSubmit = (e) => {
		e.preventDefault();
		values.shelfId = selectedShelfID;

		if (validate()) {
			if (itemsCanBePlaced()) {
				addMoreItems(parseInt(item.itemId), parseInt(selectedShelfID), parseInt(values.quantity));
			} else {
				const quantity = "quantity";
				setErrors({
					[quantity] : "Not enough space in shelf"
				});
			}
		}
		
	}
	return (
		<Grid container>
			<Grid>
				<Grid item m={1} pb={1}>
					<TextField
						disabled
						id="outlined-disabled"
						label="Item"
						defaultValue={item.itemName}
					/>
				</Grid>
				<Grid item m={1} pb={1}>
					{/* <p>Place more quantity - item : {item.itemName} </p> */}
					<Autocomplete
						sx={{ width: 195 }}
						options={shelfs}
						getOptionLabel={(option) => option.shelfId.toString()}
						renderInput={(params) => <Input
								{...params}
								variant="outlined"
								label="Shelf ID"
								error={errors.shelfId}
							></Input>
						}
						isOptionEqualToValue={(option, value) => option.shelfId === value.shelfId}
						onChange={(event, value) => {
							setSelectedShelfID(value.shelfId)
							setErrors({})
						}}
					/>
				</Grid>
				<Grid item m={1} pb={2}>
					<Input
						name="quantity"
						label="Quantity"
						value={values.quantity}
						variant="outlined"
						onChange={handleInputChange}
						error={errors.quantity}
					>
					
					</Input>
				</Grid>
				<Grid item m={1} pb={2} pl={8}>
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
		</Grid>
			
	)
}

export default AddMoreItems;