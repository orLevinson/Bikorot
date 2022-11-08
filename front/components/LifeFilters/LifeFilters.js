import { FormControl, InputLabel, MenuItem, Select } from "@material-ui/core";
import React, { useEffect } from "react";
import CustomInput from "../CustomInput/CustomInput";
import GridContainer from "../Grid/GridContainer";
import GridItem from "../Grid/GridItem";
import "../../css/dashboard.css";

const LifeFilters = (props) => {
  useEffect(() => {
    let contArr = props.contenders;
    if (!!props.searchName && props.searchName !== "") {
      contArr = contArr.filter(
        (i) =>
          i.name.includes(props.searchName) ||
          i.unit.includes(props.searchName) ||
          i.pikud.includes(props.searchName) ||
          (!!i.ogda && i.ogda.includes(props.searchName)) ||
          i.rank.includes(props.searchName) ||
          i.job.includes(props.searchName)
      );
    }
    props.setContendersToShow([...contArr]);
  }, [
    props.searchName,
    props.searchCategory,
    props.contenders,
    props.setContendersToShow,
  ]);

  return (
    <div>
      <GridContainer>
        <GridItem xs={6} sm={6} md={6}>
          <CustomInput
            labelText="חפש לפי שם מועמד או יחידה"
            inputProps={{
              value: props.searchName,
              onChange: (e) => {
                props.setSearchName(e.target.value);
              },
            }}
            id="searchName"
            formControlProps={{
              fullWidth: true,
            }}
          />
        </GridItem>
      </GridContainer>
    </div>
  );
};

export default LifeFilters;
