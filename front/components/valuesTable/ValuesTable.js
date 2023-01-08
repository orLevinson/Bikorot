import React from "react";
import {
  Paper,
  TableRow,
  TableHead,
  TableContainer,
  TableCell,
  TableBody,
  Table,
} from "@material-ui/core";

const ValuesTable = (props) => {
  return (
    <TableContainer component={Paper} dir="rtl" style={{ textAlign: "center" }}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell size="large" align="right">נושא</TableCell>
            <TableCell size="large" align="center">ציון</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.rows.map((row) => (
            <TableRow
              key={row.id}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell size="large" align="right">{row.name}</TableCell>
              <TableCell size="large" align="center">{row.value}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ValuesTable;
