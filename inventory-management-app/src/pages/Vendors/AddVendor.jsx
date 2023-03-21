import {React} from 'react';
import { Grid, Button} from '@mui/material';
import Input from '../../components/Input';
import  {Form, useCustomForm } from '../../components/Form';
import { useEffect } from 'react';


const initialFValues = {
	vendorId : 0,
	vendorName : '',
	vendorLink : ''
}

const AddVendor = (props) => {
	const { vendorForEdit, addOrEditVendor} = props;

	const {
		values, 
		setValues,
		handleInputChange,
		resetForm
	} = useCustomForm(initialFValues);

	useEffect(() => {
		if (vendorForEdit != null) {
			setValues({
				...vendorForEdit
			})
		}
	}, [vendorForEdit]);

	const handleSubmit = e => {
		e.preventDefault()

		addOrEditVendor(values, resetForm);
	
	}

	return (
		<Form onSubmit={handleSubmit}>
			<Grid container>
				<Grid >
					<Input
							name="vendorName"
							label="Vendor Name"
							variant="outlined"
							value={values.vendorName}
							onChange={handleInputChange}
					>
					</Input>
					<Input
							name="vendorLink"
							label="Vendor Link"
							variant="outlined"
							value={values.vendorLink}
							onChange={handleInputChange}
					>
					</Input>
					<Button 
							variant="contained"
							color="primary"
							type="submit"
					>
						Submit
					</Button>
				</Grid>

			</Grid>
			
		</Form>
	)
}

export default AddVendor;