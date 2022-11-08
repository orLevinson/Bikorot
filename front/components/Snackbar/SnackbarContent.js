import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Snack from "@material-ui/core/SnackbarContent";
import IconButton from "@material-ui/core/IconButton";
// @material-ui/icons
import Close from "@material-ui/icons/Close";
import HourglassEmptyIcon from "@material-ui/icons/HourglassEmpty";
// core components
import styles from "assets/jss/nextjs-material-dashboard/components/snackbarContentStyle.js";
import { primaryColor } from "../../assets/jss/nextjs-material-dashboard";

export default function SnackbarContent(props) {
  const useStyles = makeStyles(styles);
  const classes = useStyles();
  const { message, color, close,loading, icon, rtlActive } = props;
  var action = [];
  const messageClasses = classNames({
    [classes.iconMessage]: icon !== undefined,
  });

  if (close !== undefined) {
    action = [
      <IconButton
        className={classes.iconButton}
        key="close"
        aria-label="Close"
        color="inherit"
        onClick={props.onClose}
      >
        <Close className={classes.close} />
      </IconButton>,
    ];
  }
  if(loading !== undefined){
    action = [
      <IconButton
        className={classes.iconButton}
        key="loading"
        aria-label="loading"
        color="inherit"
        disabled={true}
      >
      <HourglassEmptyIcon className={classes.close} />
      </IconButton>,
    ];
  }
  return (
    <Snack
      message={
        <div>
          {icon !== undefined ? <props.icon className={classes.icon} /> : null}
          <span className={messageClasses}>{message}</span>
        </div>
      }
      classes={{
        root: classes.root + " " + classes[color],
        message: classes.message,
        action: classNames({ [classes.actionRTL]: rtlActive }),
      }}
      action={action}
    />
  );
}

SnackbarContent.propTypes = {
  message: PropTypes.node.isRequired,
  color: PropTypes.oneOf(["info", "success", "warning", "danger", "primary"]),
  close: PropTypes.bool,
  loading: PropTypes.bool,
  twoRows: PropTypes.bool,
  icon: PropTypes.object,
  onClose: PropTypes.func,
  rtlActive: PropTypes.bool,
};
