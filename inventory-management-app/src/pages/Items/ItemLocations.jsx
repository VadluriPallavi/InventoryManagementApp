import React from 'react';
import { Button, Grid, Table, TableBody, TableCell, TableHead, TableRow, TextField } from '@mui/material';
import {  ShoppingBagOutlined } from '@mui/icons-material';
import Input from '../../components/Input';
import { useState } from 'react';


const ItemLocations = (props) => {
	const { deleteItem, isDeleteButtonEnabled, itemSelected, pickUpItemsOptionEnabled, deductItems} = props;

	const [requestedItemsToPick, setRequestedItemsToPick] = useState();
	const [selectedShelfToPickUp, setSelectedShelfToPickUp] = useState({
		shelf : {
			shelfId : 0
		}
	});
	const [error, setError] = useState("");

	const handleDeleteItemHandler = (e) => {
		deleteItem(itemSelected.itemId);
	}

	const getColor = (itemQuantity, capacityConsumption) => {
		const quantity = itemQuantity.quantity;
		const shelfCapacity = itemQuantity.shelf.shelfCapacity;

		const percent = quantity * capacityConsumption * 100 / shelfCapacity;
		
		if (percent <= 0) {
			return "brown";
		}else if (percent >= 1 && percent <= 20) {
			return "green";
		} else if(percent >= 21 && percent <= 40) {
			return "blue";
		} else if(percent >= 41 && percent <= 60) {
			return "violet";
		} else if(percent >= 61 && percent <= 80) {
			return "orange";
		} else {
			return "red";
		}
	}

	const validate = (eachQuantity) => {
		if (requestedItemsToPick === undefined) {
			setError("Enter valid quantity");
		}else if(requestedItemsToPick > eachQuantity.quantity) {
			setError("Requested more items");
			return false;
		} else {
			return true;
		}
	}

	const pickUpItems = (eachQuantity) => {

		if (validate(eachQuantity)) {
			setError("");
			const shelfId = eachQuantity.id.shelfId;
			const itemId = eachQuantity.id.itemId;
			const quantity = parseInt(requestedItemsToPick);
			deductItems(shelfId, itemId, quantity);
		}
	}

	return (
		itemSelected && (
			<>
				<Grid item m={1} pb={1}>
					<TextField
						disabled
						id="outlined-disabled"
						label="Item"
						defaultValue={itemSelected.itemName}
					/>
				</Grid>
				<Table>
					<TableHead>
						<TableCell>
							Shelf ID
						</TableCell>
						<TableCell>
							Current Quantity
						</TableCell>
						{
							! isDeleteButtonEnabled && pickUpItemsOptionEnabled && 
							<TableCell>
								Actions
							</TableCell>
						}
					</TableHead>
					<TableBody>
						
						{
							itemSelected.quantities.map((eachQuantity) => (
								<TableRow key={eachQuantity.shelf.shelfId}
								>
									<TableCell>
										<p> Shelf - {eachQuantity.shelf.shelfId} </p>
									</TableCell>
									<TableCell align="center">
										<p style={{ color: getColor(eachQuantity, itemSelected.capacityConsumption, eachQuantity.shelf.shelfCapacity) , 
											fontWeight: "bold"
										}}  >
											{eachQuantity.quantity}
										</p>
									</TableCell>
									{
										! isDeleteButtonEnabled && pickUpItemsOptionEnabled &&
										<TableCell key={eachQuantity.shelf.shelfId}>
											<Grid item pt={1} pb={1} sx={{ width: 100} }>
												<Input
													name="quantity"
													inputProps={{style: { height: "1px"}}}
													onChange={(e) => {
														setRequestedItemsToPick(e.target.value);
													}}
													error={eachQuantity.shelf.shelfId === selectedShelfToPickUp.shelf.shelfId ? error : ""}
												/>
											</Grid>
											<Button
												variant="text"
												color="primary"
												onClick={() => {
													setSelectedShelfToPickUp(eachQuantity);
													pickUpItems(eachQuantity);
												}}
											>
												<ShoppingBagOutlined/>
												<p>Pick up</p>
											</Button>
										</TableCell>
									}
									
								</TableRow>
							))
						}
					</TableBody>
				</Table>
				<Grid item xs={6} m={1}>
					{
						isDeleteButtonEnabled && !pickUpItemsOptionEnabled && (
							<Button 
								variant="contained"
								color="primary"
								type="submit"
								onClick={handleDeleteItemHandler}
							>
								Empty items at shelfs
							</Button>
						)
					}
				</Grid>
			</>
		)
	)
}

export default ItemLocations;