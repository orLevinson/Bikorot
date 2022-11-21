import React, { useState } from "react";
import Card from "../Card/Card";
import CardBody from "../Card/CardBody";
import GridContainer from "../Grid/GridContainer";
import GridItem from "../Grid/GridItem";
import { FormControl, InputLabel, MenuItem, Select } from "@material-ui/core";
import "../../css/dashboard.css";
import RegularButton from "../CustomButtons/Button";

const ChooseUnit = (props) => {
  const [pikud, setPikud] = useState("");
  const [ogda, setOgda] = useState("");
  const [hativa, setHativa] = useState("");
  const [unit, setUnit] = useState("");

  return (
    <div>
      <GridContainer className="full-width">
        <GridItem xs={12} sm={8} md={6} marginauto={true}>
          <Card login={true}>
            <CardBody>
              <h3>בחירת היחידה לביקורת</h3>
              <FormControl fullWidth>
                <InputLabel id="Pikud-select-label">פיקוד</InputLabel>
                <Select
                  labelId="Pikud-select-label"
                  id="Pikud-select"
                  label="Pikud"
                  value={pikud}
                  onChange={(e) => {
                    if(e.target.value === ""){
                      setOgda(e.target.value);
                      setHativa(e.target.value);
                      setUnit(e.target.value);
                    }
                    setPikud(e.target.value);
                  }}
                >
                  <MenuItem value={""}>אין</MenuItem>
                  <MenuItem value={10}>Ten</MenuItem>
                  <MenuItem value={20}>Twenty</MenuItem>
                  <MenuItem value={30}>Thirty</MenuItem>
                </Select>
              </FormControl>
              {pikud !== "" && (
                <FormControl fullWidth>
                  <InputLabel id="ogda-select-label">אוגדה</InputLabel>
                  <Select
                    labelId="ogda-select-label"
                    id="ogda-select"
                    label="ogda"
                    value={ogda}
                    onChange={(e) => {
                      if(e.target.value === ""){
                        setHativa(e.target.value);
                        setUnit(e.target.value);
                      };
                      setOgda(e.target.value);
                    }}
                  >
                    <MenuItem value={""}>אין</MenuItem>
                    <MenuItem value={10}>Ten</MenuItem>
                    <MenuItem value={20}>Twenty</MenuItem>
                    <MenuItem value={30}>Thirty</MenuItem>
                  </Select>
                </FormControl>
              )}
              {pikud !== "" && ogda !== "" && (
                <FormControl fullWidth>
                  <InputLabel id="hativa-select-label">חטיבה</InputLabel>
                  <Select
                    labelId="hativa-select-label"
                    id="hativa-select"
                    label="hativa"
                    value={hativa}
                    onChange={(e) => {
                      if(e.target.value === ""){
                        setUnit(e.target.value);
                      }
                      setHativa(e.target.value);
                    }}
                  >
                    <MenuItem value={""}>אין</MenuItem>
                    <MenuItem value={10}>Ten</MenuItem>
                    <MenuItem value={20}>Twenty</MenuItem>
                    <MenuItem value={30}>Thirty</MenuItem>
                  </Select>
                </FormControl>
              )}

              <FormControl fullWidth>
                <InputLabel id="unit-select-label">יחידה</InputLabel>
                <Select
                  labelId="unit-select-label"
                  id="unit-select"
                  label="unit"
                  value={unit}
                  onChange={(e) => {
                    setUnit(e.target.value);
                  }}
                >
                  <MenuItem value={""}>אין</MenuItem>
                  <MenuItem value={10}>Ten</MenuItem>
                  <MenuItem value={20}>Twenty</MenuItem>
                  <MenuItem value={30}>Thirty</MenuItem>
                </Select>
              </FormControl>
              <br/>
              <RegularButton
              fullWidth
              onClick={props.next}
              disabled={unit === ""}
              color="primary"
              >
                המשך
              </RegularButton>
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    </div>
  );
};

export default ChooseUnit;
