import React from "react";
// nodejs library to set properties for components
import PropTypes from "prop-types";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import classNames from "classnames";

const styles = {
  grid: {
    padding: "0 15px !important",
  },
  flexCenter: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  fullHeight: {
    height: "inherit",
  },
  marginauto: {
    margin: "auto",
  },
  spaceBetween: {
    display: "flex",
    justifyContent: "space-between",
  },
};

export default function GridItem(props) {
  const useStyles = makeStyles(styles);
  const classes = useStyles();
  const { children, ...rest } = props;
  return (
    <Grid
      item
      {...rest}
      className={`${classes.grid} ${
        !!props.marginauto ? classes.marginauto : null
      } ${!!props.spaceBetween ? classes.spaceBetween : null} ${
        !!props.fullHeight ? classes.fullHeight : null
      } ${!!props.flexCenter ? classes.flexCenter : null}`}
    >
      {children}
    </Grid>
  );
}

GridItem.propTypes = {
  children: PropTypes.node,
  marginauto: PropTypes.bool,
  spaceBetween: PropTypes.bool,
  fullHeight: PropTypes.bool,
  flexCenter: PropTypes.bool,
};
