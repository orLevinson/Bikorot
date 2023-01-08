import React, { useEffect, useState } from "react";
import RegularButton from "../CustomButtons/Button";
import CustomInput from "../CustomInput/CustomInput";
import GridContainer from "../Grid/GridContainer";
import GridItem from "../Grid/GridItem";

function SummaryItem(props) {
  const [value, setValue] = useState(props.textValue);

  // debounce option
  // useEffect(() => {
  //   const debounce = setTimeout(() => {
  //     props.changeHandler(value, props.subject);
  //   }, 500);

  //   return () => {
  //     clearTimeout(debounce);
  //   };
  // }, [value]);

  const saveHandler = () => {
    props.changeHandler(value, props.subject);
  };

  return (
    <div style={{ margin: 15 }}>
      <GridContainer fullWidth>
        <GridItem xs={12} md={12} sm={12}>
          <CustomInput
            labelText={"פירוט"}
            type="textarea"
            id="passwordInput"
            formControlProps={{
              fullWidth: true,
            }}
            inputProps={{
              value: value,
              onChange: (e) => {
                setValue(e.target.value);
              },
              multiline: true,
              rows: 3,
            }}
            noMarginTop={true}
          />
        </GridItem>
        <GridItem xs={3} md={3} sm={6}>
          <RegularButton color={"rose"} onClick={saveHandler} fullWidth>
            שמור תשובה
          </RegularButton>
        </GridItem>
      </GridContainer>
    </div>
  );
}

export default React.memo(SummaryItem);
