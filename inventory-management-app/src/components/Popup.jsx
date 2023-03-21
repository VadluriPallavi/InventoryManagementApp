import { CloseOutlined } from '@mui/icons-material';
import { Dialog, DialogContent, DialogTitle, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import React from 'react';
import ActionButton from './ActionButton';


const useStyles = makeStyles(theme => ({
	dialogWrapper: {
		padding: theme.spacing(2),
		position: 'absolute',
		top: theme.spacing(5)
	},
	dialogTitle: {
		paddingRight: '0px'
	}
}))
const Popup = (props) => {

	const {
		openPopup,
		setOpenPopup,
		dialogTitle,
		children
	} = props;

	const classes = useStyles;
	return (
		<Dialog 
			open ={openPopup}
			classes={{
				paper : classes.dialogWrapper
			}}
			maxWidth="md"
		>
			<DialogTitle className ={classes.dialogTitle}>
				<div style={{display: 'flex'}}>
					<Typography>
						{dialogTitle}
					</Typography>
					<ActionButton
						onClick={() => {
							setOpenPopup(false)
						}}
					>
						<CloseOutlined/>
					</ActionButton>
				</div>
			</DialogTitle>
			<DialogContent dividers>
				{children}
			</DialogContent>
		</Dialog>
	)
}

export default Popup;