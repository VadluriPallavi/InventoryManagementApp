import React from 'react';
import { TextField } from '@material-ui/core';

const Input = (props) => {
	const {
		name,
		label,
		value,
		defaultValue,
		error=null,
		onChange,
		size,
		variant,
		...other
	} = props;

	return (
		<TextField
			variant="outlined"
			label={label}
			defaultValue={defaultValue}
			value={value}
			name={name}
			onChange={onChange}
			size={size}
			{...other}
			{...(error && {error: true, helperText : error})}
		/>
	)

}

export default Input;