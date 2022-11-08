import { FormControl, InputLabel, MenuItem, Select } from "@material-ui/core";
import React, { useEffect } from "react";
import CustomInput from "../CustomInput/CustomInput";
import GridContainer from "../Grid/GridContainer";
import GridItem from "../Grid/GridItem";
import "../../css/dashboard.css";

const FilterJobs = (props) => {
  useEffect(() => {
    console.log(props.contenders)
    let contArr = props.contenders;
    if (!!props.searchName && props.searchName !== "") {
      contArr = contArr.filter(
        (i) =>
          i.name.includes(props.searchName) ||
          i.unit.includes(props.searchName) ||
          i.pikud.includes(props.searchName) ||
          (!!i.ogda && i.ogda.includes(props.searchName)) ||
          i.saal.includes(props.searchName) ||
          i.bam.includes(props.searchName)
      );
    }
    switch (props.searchCategory) {
      case "AllCategories":
        contArr = contArr;
        break;
      default:
        contArr = contArr.filter((i) => {
          if (!!i.jobType) {
            return i.jobType.title.includes(props.searchCategory);
          }
          return false;
        });
        break;
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
        <GridItem xs={6} sm={6} md={6}>
          <FormControl fullWidth>
            <InputLabel id="searchContender">סנן לפי סוג מועמדות</InputLabel>
            <Select
              labelId="searchContender"
              id="searchContenderCategory"
              label="סנן לפי סוג מועמדות"
              value={props.searchCategory}
              onChange={(e) => {
                props.setSearchCategory(e.target.value);
              }}
            >
              <MenuItem value={"AllCategories"}>כל הקטגוריות</MenuItem>
              {props.jobsList.map((job) => {
                return <MenuItem value={job.title}>{job.title}</MenuItem>;
              })}
            </Select>
          </FormControl>
        </GridItem>
      </GridContainer>
    </div>
  );
};

export default FilterJobs;
