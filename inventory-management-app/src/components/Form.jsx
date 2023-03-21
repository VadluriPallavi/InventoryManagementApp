import { makeStyles } from '@mui/styles';
import React, {useState} from 'react';


export const useCustomForm = (initialFValues, validateOnChange = true, validate) => {
	const [values, setValues] = useState(initialFValues);
	const [errors, setErrors] = useState({});

	const handleInputChange = (e) => {
		const {name, value} = e.target;
		setValues({
			...values,
			[name] : value
		})
		if (validateOnChange)
			validate({ [name]: value })
	}

	const resetForm = () => {
		setValues(initialFValues);
	}

	return {
		values,
		setValues,
		errors,
		setErrors,
		handleInputChange,
		resetForm
	}
}

const useStyles = makeStyles(theme => ({
	root: {
		'& .MuiFormControl-root': {
			width: '100%',
			margin: theme.spacing(1)
		}
	}
}))

export const Form = (props) => {

	const classes = useStyles;
	const { children, ...other } = props;
	return (
		<form className={classes.root} autoComplete="off" {...other}>
			{props.children}
		</form>
	)
}
