import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { formatDateToMonthAndDay } from "../../utils/helpers";

const UserRecentBookings = ({ props }) => {
  return (
    <TableContainer className="no_scrollbar" component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell className="min-w-[50px] !font-bold">S/N</TableCell>
            <TableCell className="min-w-[150px] !font-bold" align="left">
              Hotel
            </TableCell>
            <TableCell className="min-w-[150px] !font-bold" align="left">
              Room No.
            </TableCell>
            <TableCell className="min-w-[150px] !font-bold" align="left">
              Date
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props?.length > 0 ? (
            props.map((prop, index) => (
              <TableRow key={index + 1}>
                <TableCell component="th" scope="row" className="min-w-[50px]">
                  {index + 1}
                </TableCell>
                <TableCell align="left" className="min-w-[150px]">
                  {prop?.room?.hotel?.name}
                </TableCell>
                <TableCell align="left" className="min-w-[150px]">
                  {prop?.room?.index}
                </TableCell>
                <TableCell align="left" className="min-w-[150px]">
                  {formatDateToMonthAndDay(prop.bookingStart)} -{" "}
                  {formatDateToMonthAndDay(prop.bookingEnd)}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <>
              <p>No Bookings available</p>
            </>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default UserRecentBookings;
