import GridContainer from "../../Grid/GridContainer";
import GridItem from "../../Grid/GridItem";
import Card from "../../Card/Card";
import CardHeader from "../../Card/CardHeader";
import CardBody from "../../Card/CardBody";
import CustomInput from "../../CustomInput/CustomInput";
import Button from "../../CustomButtons/Button";
import { CircularProgress } from "@material-ui/core";
import { useRef, useState } from "react";

import "../../../css/dashboard.css";

const Login = (props) => {
  const [disable, setDisable] = useState(false);
  const passwordRef = useRef();
  const userRef = useRef();

  return (
    <div className="loginContainer">
      <GridContainer className="full-width">
        <GridItem xs={12} sm={8} md={6} marginauto={true}>
          <Card login={true}>
            <CardBody>
              <h2>עמוד התחברות</h2>
              <p>נא להזין את הקוד הנדרש על מנת להתחבר לעמוד האדמינים</p>
              <CustomInput
                labelText="מספר אישי"
                type="personalNum"
                inputProps={{
                  inputRef: userRef,
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
                    await props.login(userRef.current.value,passwordRef.current.value);
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
                    "להתחברות לחצו כאן"
                  )}
                </Button>
                <Button color="rose" fullWidth>
                  שכחתי סיסמא
                </Button>
                <Button
                  color="info"
                  fullWidth
                  onClick={() => props.typeSet("register")}
                >
                  להרשמה
                </Button>
              </div>
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    </div>
  );
};

export default Login;
