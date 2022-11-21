import { CircularProgress } from "@material-ui/core";
import React from "react";
import Card from "../../Card/Card";
import CardBody from "../../Card/CardBody";
import CustomInput from "../../CustomInput/CustomInput";
import GridContainer from "../../Grid/GridContainer";
import GridItem from "../../Grid/GridItem";
import CustomButton from "../../CustomButtons/Button";

import "./style.css";

const SearchBar = () => {
  return (
    <Card>
      <CardBody>
        <GridContainer fullWidth>
          <GridItem xs={3} sm={3} md={3} flexCenter>
            <CustomInput
              labelText="שם לחיפוש"
              type="unitname"
              inputProps={{}}
              id="passwordInput"
              formControlProps={{
                fullWidth: true,
              }}
            />
          </GridItem>
          <GridItem xs={3} sm={3} md={3} flexCenter>
            <CustomInput
              labelText="מספר אישי לחיפוש"
              type="parentunit"
              noMarginTop={true}
              inputProps={{}}
              id="passwordInput"
              formControlProps={{
                fullWidth: true,
              }}
            />
          </GridItem>
          <GridItem xs={3} sm={3} md={3} flexCenter>
          <CustomButton
              // disabled={messageLoading}
              // onClick={addMessageHandler}
              color="rose"
              
            >
              {false ? (
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
