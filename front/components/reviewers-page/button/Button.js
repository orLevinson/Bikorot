import { Fab, Menu, MenuItem } from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import HourglassEmptyIcon from "@material-ui/icons/HourglassEmpty";
import React from "react";

const Button = (props) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const [loading, setLoading] = React.useState(false);
  

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const { id, name,personalNum,type } = props;
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
              props.showDoc(id, "CVFile");
            }}
          >
            צפה במסמך קורות חיים
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleClose();
              props.showDoc(id, "AlamFile");
            }}
          >
            צפה במסמך אישור אל"מ
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleClose();
              props.showDoc(id, "pptFile");
            }}
          >
            צפה במצגת הצגה אישית
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleClose();
              props.editPriority(props.isEditing === id ? null : id);
            }}
          >
            <span style={{ color: "purple" }}>
              {props.isEditing === id ? "בטל הזנת תעדוף" : "הזן תעדוף"}
            </span>
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleClose();
              openModal(id, name);
            }}
          >
            <span style={{ color: "blue" }}>שנה את קובץ מצגת המועמד</span>
          </MenuItem>
          <MenuItem
            onClick={async () => {
              handleClose();
              setLoading(true);
              await props.deleteContender(id);
              setLoading(false);
            }}
          >
            <span style={{ color: "red" }}>הסר מועמד</span>
          </MenuItem>
        </Menu>
      </div>
    </>
  );
};

export default Button;
