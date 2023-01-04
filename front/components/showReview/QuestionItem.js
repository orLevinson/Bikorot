import React, { useState, useEffect } from "react";
import CustomInput from "../CustomInput/CustomInput";
import GridContainer from "../Grid/GridContainer";
import GridItem from "../Grid/GridItem";
import RegularButton from "../CustomButtons/Button";

const QuestionItem = (props) => {
  const { valueScore, valueText, question } =
    props;
  const [score, setScore] = useState(valueScore);
  const [text, setText] = useState(valueText);

  return (
    <div style={{ margin: 15 }}>
      <GridContainer fullWidth>
        <GridItem xs={12} md={12} sm={12}>
          <span className="littleHeader">{question}</span>
        </GridItem>
        <GridItem xs={4} md={4} sm={4}>
          <CustomInput
            labelText={"ציון"}
            type="number"
            inputProps={{
              value: score,
              disabled:true
            }}
            id="passwordInput"
            formControlProps={{
              fullWidth: true,
            }}
            noMarginTop={true}
          />
        </GridItem>
        <GridItem xs={4} md={4} sm={4}>
        </GridItem>
        <GridItem xs={8} md={8} sm={8}></GridItem>
        <GridItem xs={12} md={12} sm={12}>
          <CustomInput
            labelText={"פירוט"}
            type="textarea"
            id="passwordInput"
            formControlProps={{
              fullWidth: true,
            }}
            inputProps={{
              value: text,
              disabled:true,
              multiline: true,
              rows: 3,
            }}
            noMarginTop={true}
          />
        </GridItem>
      </GridContainer>
    </div>
  );
};

export default React.memo(QuestionItem);
