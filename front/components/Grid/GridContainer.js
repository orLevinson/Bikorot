import React from "react";
// nodejs library to set properties for components
import PropTypes from "prop-types";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";

const styles = {
  grid: {
    margin: "0 -15px !important",
    width: "100%",
  },
  gridCentered: {
    justifyContent: "center",
    width: "80%",
    margin: "auto!important",
  },
};


export default function GridContainer(props) {
  const useStyles = makeStyles(styles);
  const classes = useStyles();
  const { children, ...rest } = props;
  return (
    <Grid
      container
      {...rest}
      alignItems="stretch"
      className={!!props.centered ? classes.gridCentered : classes.grid}
    >
      {children}
    </Grid>
  );
}

GridContainer.propTypes = {
  children: PropTypes.node,
  centered: PropTypes.bool,
};
