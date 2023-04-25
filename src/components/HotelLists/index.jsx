import * as React from "react";
import { useNavigate } from "react-router-dom";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

const HotelLists = ({ props, handleDeleteHotel }) => {
  // This is from react to goto a page or route to a page, it monitors the state of the routes
  const navigate = useNavigate();

  return (
    <TableContainer className="no_scrollbar" component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell className="min-w-[50px] !font-bold">S/N</TableCell>
            <TableCell className="min-w-[200px] !font-bold" align="left">
              Name
            </TableCell>
            <TableCell className="min-w-[200px] !font-bold" align="left">
              Location
            </TableCell>
            <TableCell className="min-w-[50px] !font-bold" align="left">
              Star
            </TableCell>
            <TableCell className="min-w-[150px] !font-bold" align="left">
              Edit
            </TableCell>
            <TableCell className="min-w-[150px] !font-bold" align="left">
              Delete
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.length > 0 ? (
            props.map((prop, index) => (
              <TableRow key={index + 1}>
                <TableCell component="th" scope="row" className="min-w-[50px]">
                  {index + 1}
                </TableCell>
                <TableCell align="left" className="min-w-[200px]">
                  {prop?.name}
                </TableCell>
                <TableCell align="left" className="min-w-[200px]">
                  {prop?.location}
                </TableCell>
                <TableCell align="left" className="min-w-[50px]">
                  {prop.star}
                </TableCell>
                <TableCell align="left" className="min-w-[150px]">
                  <button
                    onClick={() => navigate(`/admin/hotel/${prop?._id}`)}
                    className="px-4 py-3 text-white transition-colors transform bg-[#3e2fd9e6] rounded-md hover:bg-[#3123c7e6] text-lg"
                  >
                    Edit Hotel
                  </button>
                </TableCell>
                <TableCell align="left" className="min-w-[150px]">
                  <button
                    onClick={() => handleDeleteHotel(prop?._id)}
                    className="px-4 py-3 text-white transition-colors transform bg-red-700/90 rounded-md hover:bg-red-700 text-lg"
                  >
                    Delete Hotel
                  </button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <>
              <p>No Hotel created</p>
            </>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default HotelLists;
