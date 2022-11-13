import React from "react";
// nodejs library that concatenates classes
import classNames from "classnames";
// nodejs library to set properties for components
import PropTypes from "prop-types";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// @material-ui/icons

// core components
import styles from "assets/jss/nextjs-material-dashboard/components/cardStyle.js";

export default function Card(props) {
  const useStyles = makeStyles(styles);
  const classes = useStyles();
  const { className, children, plain, profile, chart, ...rest } = props;
  const cardClasses = classNames({
    [classes.card]: true,
    [classes.cardPlain]: plain,
    [classes.cardProfile]: profile,
    [classes.cardChart]: chart,
    [className]: className !== undefined,
  });
  return (
    <div
      className={cardClasses}
      style={
        !!props.frontDesc
          ? { height: "calc(100% - 60px)" }
          : !!props.login
          ? { display: "flex", justifyContent: "center", alignItems: "center",textAlign:"center" }
          : !!props.fullHeight ?
          {height:"50%",flex:1} : {}
      }
      {...rest}
    >
      {children}
    </div>
  );
}

Card.propTypes = {
  frontDesc: PropTypes.bool,
  login: PropTypes.bool,
  className: PropTypes.string,
  plain: PropTypes.bool,
  profile: PropTypes.bool,
  chart: PropTypes.bool,
  children: PropTypes.node,
  fullHeight: PropTypes.bool
};
