import React, { useState } from "react";
import { CircularProgress } from "@material-ui/core";
import Card from "../../Card/Card";
import CardBody from "../../Card/CardBody";
import CustomInput from "../../CustomInput/CustomInput";
import GridContainer from "../../Grid/GridContainer";
import GridItem from "../../Grid/GridItem";
import CustomButton from "../../CustomButtons/Button";

import "./style.css";

const SearchBar = (props) => {
  const [buttonDisabled, setButtonDisabled] = useState(false);

  return (
    <Card>
      <CardBody>
        <GridContainer fullWidth>
          <GridItem xs={3} sm={3} md={3} flexCenter>
            <CustomInput
              labelText="יחידה לחיפוש"
              type="unitname"
              inputProps={{
                onChange: (e) => {
                  props.setSearchBarData((prev) => {
                    const newState = { ...prev, unit: e.target.value };
                    return newState;
                  });
                },
                value: props.searchBarData.unit,
              }}
              id="passwordInput"
              formControlProps={{
                fullWidth: true,
              }}
            />
          </GridItem>
          <GridItem xs={3} sm={3} md={3} flexCenter>
            <div className="datePicker">
              <label htmlFor="date">בוצעה מתאריך</label> &nbsp;&nbsp;&nbsp;
              <input
                type="date"
                id="date"
                value={props.searchBarData.date}
                onChange={(e) => {
                  props.setSearchBarData((prev) => {
                    const newState = { ...prev, date: e.target.value };
                    return newState;
                  });
                }}
              ></input>
            </div>
          </GridItem>
          <GridItem xs={3} sm={3} md={3} flexCenter>
            <CustomButton
              disabled={buttonDisabled}
              onClick={async () => {
                setButtonDisabled(true);
                await props.getUnitsHandler();
                setButtonDisabled(false);
              }}
              color="rose"
            >
              {buttonDisabled ? (
                <CircularProgress
                  className="hello"
                  sx={{ mx: 4 }}
                  size={"1.5rem"}
                  color="warning"
                />
              ) : (
                "חיפוש"
              )}
            </CustomButton>
          </GridItem>
        </GridContainer>
      </CardBody>
    </Card>
  );
};

export default SearchBar;
