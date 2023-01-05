import React, { useState, useEffect } from "react";
import CustomInput from "../CustomInput/CustomInput";
import GridContainer from "../Grid/GridContainer";
import GridItem from "../Grid/GridItem";
import RegularButton from "../CustomButtons/Button";

const QuestionItem = (props) => {
  const { valueScore, changeValueScore, valueText, changeValueText, question } =
    props;
  const [score, setScore] = useState(valueScore);
  const [text, setText] = useState(valueText);

  useEffect(() => {
    const debounce = setTimeout(() => {
      if (score !== valueScore) {
        changeValueScore(score);
      }
    }, 500);
    return () => {
      clearTimeout(debounce);
    };
  }, [score]);

  useEffect(() => {
    const debounce = setTimeout(() => {
      if (text !== valueText) {
        changeValueText(text);
      }
    }, 500);
    return () => {
      clearTimeout(debounce);
    };
  }, [text]);

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
              onChange: (e) => {
                if (e.target.value > 100 || e.target.value < 0) {
                  return;
                } else if (e.target.value === "") {
                  setScore(0);
                } else {
                  setScore(e.target.value);
                }
              },
            }}
            id="passwordInput"
            formControlProps={{
              fullWidth: true,
            }}
            noMarginTop={true}
          />
        </GridItem>
        <GridItem xs={4} md={4} sm={4}>
          {/* ADD OPEN FILE */}
          <a
            href={
              !!props.filePath
                ? `${process.env.NEXT_PUBLIC_API_ADDRESS}${props.filePath}`
                : "#"
            }
            target={!!props.filePath ? "_blank" : "_self"}
          >
            <RegularButton color={"primary"} fullWidth>
              קובץ מחוון
            </RegularButton>
          </a>
        </GridItem>
        <GridItem xs={4} md={4} sm={4}></GridItem>
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
              onChange: (e) => {
                setText(e.target.value);
              },
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
