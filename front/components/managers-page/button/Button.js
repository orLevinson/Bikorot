import { Fab, Menu, MenuItem } from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import HourglassEmptyIcon from "@material-ui/icons/HourglassEmpty";
import React, { useContext } from "react";
import { contextData } from "../../../context/context";
import { useRouter } from "next/router";
import { useHttpClient } from "../../Hooks/http-hook";

const Button = (props) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const router = useRouter();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const open = Boolean(anchorEl);
  const [loading, setLoading] = React.useState(false);
  const { userData } = useContext(contextData);
  const { id } = props;

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const changePerms = async (perms) => {
    let body = {
      perms: null,
    };
    switch (perms) {
      case "manager":
        body.perms = "manager";
        break;
      case "reviewer":
        body.perms = "reviewer";
        break;
      case null:
        body.perms = "none";
        break;
      default:
        return;
    }
    try {
      setLoading(true);
      const response = await sendRequest(
        `${process.env.NEXT_PUBLIC_API_ADDRESS}api/users/perms/${id}`,
        "PATCH",
        JSON.stringify(body),
        {
          "Content-Type": "application/json",
          Authorization: userData.token,
        }
      );

      if (!!response.success) {
        props.openModal("success", "ההרשאה שונתה בהצלחה");
        props.getUsers();
        setLoading(false);
      } else {
        throw new Error();
      }
    } catch (err) {
      clearError();
      props.openModal("danger", "קרתה תקלה במהלך שינוי ההרשאות");
      setLoading(false);
    }
  };

  const deleteUser = async () => {
    try {
      setLoading(true);
      const response = await sendRequest(
        `${process.env.NEXT_PUBLIC_API_ADDRESS}api/users/${id}`,
        "DELETE",
        null,
        {
          Authorization: userData.token,
        }
      );

      if (!!response.success) {
        props.openModal("warning", "המשתמש הוסר בהצלחה");
        props.getUsers();
        setLoading(false);
      } else {
        throw new Error();
      }
    } catch (err) {
      clearError();
      props.openModal("danger", "קרתה תקלה במהלך הסרת המשתמש");
      setLoading(false);
    }
  };

  // a manager can only set perms to reviewer or null,
  // a global manager can set perms to a manager, reviewer or null
  const changePermsButtons = (
    <>
      {(userData.perms === "manager" || userData.perms === "global") && (
        <MenuItem
          onClick={() => {
            handleClose();
            changePerms(null);
          }}
        >
          מחק הרשאות
        </MenuItem>
      )}
      {(userData.perms === "manager" || userData.perms === "global") && (
        <MenuItem
          onClick={() => {
            handleClose();
            changePerms("reviewer");
          }}
        >
          שנה הרשאה למבקר
        </MenuItem>
      )}
      {userData.perms === "global" && (
        <MenuItem
          onClick={() => {
            handleClose();
            changePerms("manager");
          }}
        >
          שנה הרשאה למנהל
        </MenuItem>
      )}
    </>
  );

  if (!!loading) {
    return (
      <div>
        <Fab
          size="small"
          id="loading"
          aria-controls={open ? "loading" : undefined}
          style={{ backgroundColor: "lightgrey", color: "grey" }}
        >
          <HourglassEmptyIcon />
        </Fab>
      </div>
    );
  }

  return (
    <>
      <div>
        <Fab
          size="small"
          id="basic-button"
          aria-controls={open ? "basic-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          onClick={handleClick}
          style={{ backgroundColor: "#9c27b0", color: "white" }}
        >
          <MoreVertIcon />
        </Fab>
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
        >
          <MenuItem
            onClick={() => {
              handleClose();
              router.replace("/reviewers/" + id)
            }}
          >
            צפה בביקורות של המשתמש
          </MenuItem>
          {changePermsButtons}
          <MenuItem
            onClick={() => {
              handleClose();
              deleteUser();
            }}
          >
            <span style={{ color: "red" }}>הסר משתמש</span>
          </MenuItem>
        </Menu>
      </div>
    </>
  );
};

export default Button;
