import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import api from '../service/api';
import axios from 'axios';


export default function TableShow(props) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [user, setUser] = useState();
  const [total, setTotal] = useState();
  const [data, setData] = useState([]);
  const columns = [
    { id: 'deliveryTeamName', label: 'Team' },
    { id: 'deliveryTeamVehiclePlate', label: 'vehicle' },
    { id: 'orderPurchaseAddress', label: 'Order\u00a0Address' },
    {
      id: 'orderPurchaseCreationDate',
      label: 'Creation\u00a0Date',
      format: (value) => value.toLocaleString('pt-BR'),
    },
    {
      id: 'orderPurchaseDeliveryDate',
      label: 'Delivery\u00a0Date',
      format: (value) => value.toLocaleString('pt-BR'),
    },
    {
      id: 'orderPurchaseNumber',
      label: 'Order\u00a0Number',
      align: 'right',
      format: (value) => value.toFixed(2),
    },
  ];

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    GetPurchaseOrder(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  useEffect(() => {
    const userSession = JSON.parse(sessionStorage.getItem('session_user'));
    setUser(userSession);
  }, []);

  const GetPurchaseOrder = async (pageCount = 0) => {
    const token = sessionStorage.getItem('token_session_user');
    api.get(`/purchaseorder?skip=${pageCount === 0 || pageCount === 'NaN' ? 0 : rowsPerPage * pageCount}&take=${rowsPerPage}`,
      {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then((response) => {
        if (Array.isArray(response.data)) {
          setData(response.data)
          setTotal(response.data[0].total);
          props.totalOrdersCallBack(response.data[0].total);
        }
      })
      .catch((error) => {
        console.log(`Ocorreu um erro ao tentar buscar lista de pedidos: ${error}`);
      });
  };

  useEffect(() => {
    GetPurchaseOrder();
  }, [user]);

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align} style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => (
              <TableRow
                key={row.orderPurchaseNumber}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell align="left" >{row.deliveryTeamName}</TableCell>
                <TableCell align="left" >{row.deliveryTeamVehiclePlate}</TableCell>
                <TableCell align="left" >{row.orderPurchaseAddress}</TableCell>
                <TableCell align="left" >{row.orderPurchaseCreationDate}</TableCell>
                <TableCell align="left" >{row.orderPurchaseDeliveryDate}</TableCell>
                <TableCell align="center" >{row.orderPurchaseNumber}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[20]}
        component="div"
        count={total}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}

TableShow.propTypes = {
  totalOrdersCallBack: PropTypes.func.isRequired,
};