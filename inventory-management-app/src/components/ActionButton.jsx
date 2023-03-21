import { Button } from '@mui/material';
import React from 'react';

const ActionButton = (props) => {
	
	const {
		children,
		onClick
	} = props;
	return (
		<Button
			onClick={onClick}
		>
			{children}
		</Button>
	)
}

export default ActionButton;