import React, { useContext, useEffect, useState } from "react";
import Card from "../Card/Card";
import CardBody from "../Card/CardBody";
import GridContainer from "../Grid/GridContainer";
import GridItem from "../Grid/GridItem";
import {
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@material-ui/core";
import "../../css/dashboard.css";
import RegularButton from "../CustomButtons/Button";
import { useHttpClient } from "../Hooks/http-hook";
import { reviewContextData } from "../../context/contextReview";

const ChooseUnit = (props) => {
  const { changeUnit, reviewData } = useContext(reviewContextData);
  const [pikud, setPikud] = useState("");
  const [ogda, setOgda] = useState("");
  const [hativa, setHativa] = useState("");
  const [unit, setUnit] = useState("");
  const [loading, setLoading] = useState(false);
  const { clearError, sendRequest } = useHttpClient();
  const [fetchRes, setFetchRes] = useState([]);
  const [currentCommandIndex, setCurrentCommandIndex] = useState(null);
  const [currentDivisionIndex, setCurrentDivisionIndex] = useState(null);
  const [currentBrigadeIndex, setCurrentBrigadeIndex] = useState(null);
  const [unitsToChoose, setUnitsToChoose] = useState([]);

  useEffect(() => {
    const getUnits = async () => {
      setLoading(true);
      try {
        const response = await sendRequest(
          `${process.env.NEXT_PUBLIC_API_ADDRESS}api/units/all`,
          "GET"
        );
        if (!!response.commands) {
          setFetchRes(response.commands);
          setPikud(reviewData.unitData.command);
          setOgda(reviewData.unitData.division);
          setHativa(reviewData.unitData.brigade);
          setUnit(reviewData.unitData.unit);
          setLoading(false);
        } else {
          throw new Error();
        }
      } catch (err) {
        clearError();
        props.openModal("danger", "קרתה תקלה במהלך שליפת היחידות");
        setLoading(false);
      }
    };
    getUnits();
  }, [setLoading]);

  // auto fill if the unit data is in the review's context
  useEffect(() => {
    if (fetchRes.length > 0) {
      if (!!reviewData.unitData.command && reviewData.unitData.command !== "") {
        setUnit(reviewData.unitData.unit);
        setPikud(reviewData.unitData.command);
        const commandIndex = fetchRes.findIndex(
          (command) => command._id === reviewData.unitData.command
        );
        if (commandIndex >= 0) {
          setCurrentCommandIndex(commandIndex);
        }
      }
    }
  }, [fetchRes]);

  // change context if something changes
  useEffect(() => {
    if (!!unit && unit !== "" && !!pikud && pikud !== "") {
      changeUnit({
        unit: unit,
        command: pikud,
        division: ogda,
        brigade: hativa,
      });
    }
  }, [unit, pikud, ogda, hativa]);

  // when command changes
  useEffect(() => {
    setCurrentDivisionIndex(null);
    setCurrentBrigadeIndex(null);
    if (currentCommandIndex !== null) {
      setUnitsToChoose([...fetchRes[currentCommandIndex].directUnits]);
    } else {
      setUnitsToChoose([]);
    }

    // if there is division in the review context
    if (
      !!reviewData.unitData.division &&
      reviewData.unitData.division !== "" &&
      !!currentCommandIndex
    ) {
      setOgda(reviewData.unitData.division);
      const divisionIndex = fetchRes[currentCommandIndex].divisions.findIndex(
        (division) => division._id === reviewData.unitData.division
      );
      if (divisionIndex >= 0) {
        setCurrentDivisionIndex(divisionIndex);
      }
    }
  }, [currentCommandIndex]);

  // when division changes
  useEffect(() => {
    setCurrentBrigadeIndex(null);
    if (currentDivisionIndex !== null && currentCommandIndex !== null) {
      setUnitsToChoose([
        ...fetchRes[currentCommandIndex].divisions[currentDivisionIndex]
          .directUnits,
      ]);
    } else {
      if (currentCommandIndex !== null) {
        setUnitsToChoose([...fetchRes[currentCommandIndex].directUnits]);
      } else {
        setUnitsToChoose([]);
      }
    }

    // if the division is updated and there is a brigade in the review context
    if (
      !!reviewData.unitData.brigade &&
      reviewData.unitData.brigade !== "" &&
      !!currentDivisionIndex
    ) {
      // setOgda(reviewData.unitData.division);
      // console.log(currentCommandIndex);
      // const divisionIndex = fetchRes[currentCommandIndex].divisions.findIndex(
      //   (division) => division._id === reviewData.unitData.division
      // );
      // if (divisionIndex >= 0) {
      //   setCurrentDivisionIndex(divisionIndex);
      // }
      const brigadeIndex = fetchRes[currentCommandIndex].divisions[
        currentDivisionIndex
      ].brigades.findIndex(
        (brigade) => brigade._id === reviewData.unitData.brigade
      );
      if (brigadeIndex >= 0) {
        setCurrentBrigadeIndex(brigadeIndex);
        setHativa(reviewData.unitData.brigade);
      }
    }
  }, [currentDivisionIndex, ogda]);

  // when brigade changes
  useEffect(() => {
    if (
      currentBrigadeIndex !== null &&
      currentDivisionIndex !== null &&
      currentCommandIndex !== null
    ) {
      setUnitsToChoose([
        ...fetchRes[currentCommandIndex].divisions[currentDivisionIndex]
          .brigades[currentBrigadeIndex].units,
      ]);
    } else {
      if (currentDivisionIndex !== null) {
        setUnitsToChoose([
          ...fetchRes[currentCommandIndex].divisions[currentDivisionIndex]
            .directUnits,
        ]);
      } else {
        if (currentCommandIndex !== null) {
          setUnitsToChoose([...fetchRes[currentCommandIndex].directUnits]);
        } else {
          setUnitsToChoose([]);
        }
      }
    }
    // if (!!reviewData.unitData.unit && reviewData.unitData.unit !== "") {
    //   setUnit(reviewData.unitData.unit);
    // }
  }, [currentBrigadeIndex, hativa]);

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
                    setOgda("");
                    setHativa("");
                    setUnit("");
                    setPikud(e.target.value);
                  }}
                >
                  <MenuItem
                    value={""}
                    onClick={() => {
                      setCurrentCommandIndex(null);
                    }}
                  >
                    אין
                  </MenuItem>
                  {fetchRes.map((command, index) => {
                    return (
                      <MenuItem
                        key={command._id}
                        value={command._id}
                        onClick={() => {
                          setCurrentCommandIndex(index);
                        }}
                      >
                        {command.name}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
              {pikud !== "" && currentCommandIndex !== null && (
                <FormControl fullWidth>
                  <InputLabel id="ogda-select-label">אוגדה</InputLabel>
                  <Select
                    labelId="ogda-select-label"
                    id="ogda-select"
                    label="ogda"
                    value={ogda}
                    onChange={(e) => {
                      setHativa("");
                      setUnit("");
                      setOgda(e.target.value);
                    }}
                  >
                    <MenuItem
                      value={""}
                      onClick={() => {
                        setCurrentDivisionIndex(null);
                      }}
                    >
                      אין
                    </MenuItem>
                    {fetchRes[currentCommandIndex].divisions.map(
                      (division, index) => {
                        return (
                          <MenuItem
                            key={division._id}
                            value={division._id}
                            onClick={() => {
                              setCurrentDivisionIndex(index);
                            }}
                          >
                            {division.name}
                          </MenuItem>
                        );
                      }
                    )}
                  </Select>
                </FormControl>
              )}
              {pikud !== "" && ogda !== "" && currentDivisionIndex !== null && (
                <FormControl fullWidth>
                  <InputLabel id="hativa-select-label">חטיבה</InputLabel>
                  <Select
                    labelId="hativa-select-label"
                    id="hativa-select"
                    label="hativa"
                    value={hativa}
                    onChange={(e) => {
                      setUnit("");
                      setHativa(e.target.value);
                    }}
                  >
                    <MenuItem
                      value={""}
                      onClick={() => {
                        setCurrentBrigadeIndex(null);
                      }}
                    >
                      אין
                    </MenuItem>
                    {fetchRes[currentCommandIndex].divisions[
                      currentDivisionIndex
                    ].brigades.map((brigade, index) => {
                      return (
                        <MenuItem
                          key={brigade._id}
                          value={brigade._id}
                          onClick={() => {
                            setCurrentBrigadeIndex(index);
                          }}
                        >
                          {brigade.name}
                        </MenuItem>
                      );
                    })}
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
                  {unitsToChoose.map((unit) => {
                    return (
                      <MenuItem key={unit._id} value={unit._id}>
                        {unit.name}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
              <br />
              <RegularButton
                disabled={unit === "" || loading}
                onClick={() => {
                  props.next();
                }}
                color="primary"
              >
                {loading ? (
                  <CircularProgress
                    className="hello"
                    sx={{ mx: 4 }}
                    size={"1.5rem"}
                    color="warning"
                  />
                ) : (
                  "המשך"
                )}
              </RegularButton>
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    </div>
  );
};

export default ChooseUnit;
