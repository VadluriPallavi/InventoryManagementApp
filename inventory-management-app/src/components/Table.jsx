import { Table, TableCell, TableHead, TablePagination, TableSortLabel } from '@mui/material';
import React from 'react';
import { useState } from 'react';


const useCustomTable = (categories, headCells, filterFn) => {
	const pages = [5, 10, 25];
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(pages[page]);
	const [order, setOrder] = useState();
	const [orderBy, setOrderBy] = useState();

	const CustomTableContainer = (props) => (
		<Table>
			{props.children}
		</Table>
	);
	
	const CustomTableHead = (props) => {

		const handleSortRequest = (cellId) => {
			const isAscendiing = orderBy === cellId && order === 'asc'
			setOrder(isAscendiing ? 'desc' : 'asc');
			setOrderBy(cellId);
		}
		return (
			<TableHead>
				{
					headCells.map(headCell => (
						<TableCell key={headCell.id}
							sortDirection={orderBy === headCell.id ? order : false}
						>
							{
								headCell.disableSorting ? headCell.label :
									<TableSortLabel
										active={orderBy === headCell.id}
										direction={orderBy === headCell.id ? order : 'asc'}
										onClick={() => {
											handleSortRequest(headCell.id)
										}}
									>
										{headCell.label}
									</TableSortLabel>

							}
						</TableCell>
					))
				}
			</TableHead>
		)
	}

	const handlePageChange = (event, newPage) => {
		setPage(newPage);
	}

	const handleRowsPerPageChange = (event) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	}

	const CustomTablePagination = () => (
		<TablePagination
			component="div"
			page={page}
			rowsPerPageOptions={pages}
			rowsPerPage={rowsPerPage}
			count={categories ? categories.length : 0}
			onPageChange={handlePageChange}
			onRowsPerPageChange={handleRowsPerPageChange}
		/>
	)

	const stableSort = (array, comparator) => {
		const stabilizedThis = array.map((el, index) => [
			el, index
		]);

		return stabilizedThis.map((el) => el[0]);
	}

	const descendingComparator = (a, b, orderBy) => {
		if (b[orderBy] < a[orderBy]) {
			return -1;
		}
 
		if (b[orderBy] > a[orderBy]) {
			return 1;
		}

		return 0;
	}

	const getComparator = (order, orderBy) => {
		return order === 'desc' 
			? (a, b) => descendingComparator(a, b, orderBy)
			: (a, b) => -descendingComparator(a, b, orderBy)
	}

	const recordsAfterPagingAndSorting = () => {
		return stableSort(filterFn.fn(categories), getComparator(order, orderBy)).slice(page * rowsPerPage, (page + 1) * rowsPerPage);
	}

	return {
		CustomTableContainer,
		CustomTableHead,
		CustomTablePagination,
		recordsAfterPagingAndSorting
	}
}

export default useCustomTable;