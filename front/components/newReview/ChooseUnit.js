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
  const [pikud, setPikud] = useState(reviewData.unitData.command);
  const [ogda, setOgda] = useState(reviewData.unitData.division);
  const [hativa, setHativa] = useState(reviewData.unitData.brigade);
  const [unit, setUnit] = useState(reviewData.unitData.unit);
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

  // change context if something changes
  useEffect(() => {
    changeUnit({
      unit: unit,
      command: pikud,
      division: ogda,
      brigade: hativa,
    });
  }, [unit, pikud, ogda, hativa]);

  // change context if something changes
  useEffect(() => {
    console.log(reviewData.unitData);
  }, [reviewData]);

  // when command changes
  useEffect(() => {
    setCurrentDivisionIndex(null);
    setCurrentBrigadeIndex(null);
    if (currentCommandIndex !== null) {
      setUnitsToChoose([...fetchRes[currentCommandIndex].directUnits]);
    } else {
      setUnitsToChoose([]);
    }
  }, [currentCommandIndex]);

  // when division changes
  useEffect(() => {
    setCurrentBrigadeIndex(null);
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
  }, [currentDivisionIndex]);

  // when brigade changes
  useEffect(() => {
    if (currentBrigadeIndex !== null) {
      setUnitsToChoose([
        ...fetchRes[currentCommandIndex].divisions[currentDivisionIndex]
          .brigades[currentDivisionIndex].units,
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
  }, [currentBrigadeIndex]);

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
