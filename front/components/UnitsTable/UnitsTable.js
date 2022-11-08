import React from "react";
import Table from "../Table/Table";

import "../../css/dashboard.css";

const UnitsTable = (props) => {
  return (
    <div className="unitsTable">
      <Table
        tableHeaderColor={props.tableHeaderColor}
        tableHead={props.tableHead}
        tableData={props.tableData}
      />
    </div>
  );
};

export default UnitsTable;
