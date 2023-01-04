import React, { useEffect, useState } from "react";
import CustomInput from "../CustomInput/CustomInput";
import GridContainer from "../Grid/GridContainer";
import GridItem from "../Grid/GridItem";

function SummaryItem(props) {
  const [value, setValue] = useState(props.textValue);

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
              value: `${value.text} - ${value.score}`,
              disabled: true,
              multiline: true,
              rows: 3,
            }}
            noMarginTop={true}
          />
        </GridItem>
      </GridContainer>
    </div>
  );
}

export default React.memo(SummaryItem);
