import { makeStyles } from '@mui/styles';
import React from 'react';

const useStyles = makeStyles(theme => ({
	root: {
		margin: theme.spacing(0.5)
	},
	label: {
		textTransform: 'none'
	}
}));

const Button = (props) => {
	const {
		text, size, color, variant, onClick, ...other
	} = props;

	const classes = useStyles;
	return (
		<Button
			variant={variant || "contianed"}
			size={size}
			color={color || "primary"}
			onClick={onClick}
			{...other}
			classes={{root : classes.root, label: classes.label}}
		>
			{text}
		</Button>
	)
}

export default Button;