import "../../../css/dashboard.css";

import GridContainer from "../../Grid/GridContainer";
import GridItem from "../../Grid/GridItem";
import Card from "../../Card/Card";
import CardHeader from "../../Card/CardHeader";
import CardBody from "../../Card/CardBody";
import CustomInput from "../../CustomInput/CustomInput";
import Button from "../../CustomButtons/Button";
import {
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@material-ui/core";
import { useRef, useState } from "react";

const Register = (props) => {
  const [disable, setDisable] = useState(false);
  const passwordRef = useRef();
  const repeatPasswordRef = useRef();
  const nameRef = useRef();
  const personalNumRef = useRef();

  return (
    <div className="loginContainer">
      <GridContainer className="full-width">
        <GridItem xs={12} sm={8} md={6} marginauto={true}>
          <Card login={true}>
            <CardBody>
              <h2>עמוד הרשמה</h2>
              <p>נא להזין את כלל הפרטים הדרושים</p>
              <CustomInput
                labelText="מספר אישי"
                type="unit"
                inputProps={{
                  inputRef: personalNumRef,
                }}
                id="passwordInput"
                formControlProps={{
                  fullWidth: true,
                }}
              />
              <CustomInput
                labelText="סיסמא"
                type="password"
                inputProps={{
                  inputRef: passwordRef,
                }}
                id="passwordInput"
                formControlProps={{
                  fullWidth: true,
                }}
              />
              <CustomInput
                labelText="חזור על הסיסמא"
                type="password"
                inputProps={{
                  inputRef: repeatPasswordRef,
                }}
                id="repeatPasswordInput"
                formControlProps={{
                  fullWidth: true,
                }}
              />
              <CustomInput
                labelText="שם מלא"
                type="name"
                inputProps={{
                  inputRef: nameRef,
                }}
                id="passwordInput"
                formControlProps={{
                  fullWidth: true,
                }}
              />
              <div
                style={{
                  width: "calc(80% + 26px)",
                  margin: "20px auto auto auto",
                }}
              >
                <Button
                  disabled={disable}
                  onClick={async () => {
                    setDisable(true);
                    await props.register(
                      nameRef.current.value,
                      personalNumRef.current.value,
                      passwordRef.current.value,
                      repeatPasswordRef.current.value
                    );
                    setDisable(false);
                  }}
                  color="primary"
                  fullWidth
                >
                  {disable ? (
                    <CircularProgress
                      className="hello"
                      sx={{ mx: 4 }}
                      size={"1rem"}
                      color="warning"
                    />
                  ) : (
                    "להרשמה לחצו כאן"
                  )}
                </Button>
                <Button
                  color="info"
                  fullWidth
                  onClick={() => props.typeSet("login")}
                >
                  להתחברות
                </Button>
              </div>
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    </div>
  );
};

export default Register;
