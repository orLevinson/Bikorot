import React, { useState } from "react";
import GaugeChart from "react-gauge-chart";
import Card from "../../Card/Card";

const CardWithValues = (props) => {
  const [data, setData] = useState({
    name: !!props.name ? props.name : "שם יחידה",
    reviewersAvg: !!props.reviewersAvg ? props.reviewersAvg : 0,
    managersAvg: !!props.managersAvg ? props.managersAvg : 0,
    func: !!props.func ? props.func : null,
  });

  return (
    <Card>
      <div
        onClick={data.func}
        // make the card with clickable cursor only if it got a function in props
        style={{ textAlign: "center", cursor: !!data.func ? "pointer" : null }}
      >
        <h4 style={{ fontWeight: "bold", paddingLeft: 10, paddingRight: 10 }}>
          {data.name}
        </h4>
        ממוצע ביקורות
        <GaugeChart
          id="gauge-chart2"
          nrOfLevels={20}
          percent={data.reviewersAvg / 100}
          colors={["#FF5F6D", "#FFC371"]}
          textColor={"black"}
        ></GaugeChart>
      </div>
      <div style={{ textAlign: "center" }}>
        ממוצע מנהלים פנימי
        <GaugeChart
          id="gauge-chart2"
          nrOfLevels={20}
          percent={data.managersAvg / 100}
          colors={["#FF5F6D", "#FFC371"]}
          textColor={"black"}
        ></GaugeChart>
      </div>
    </Card>
  );
};

export default CardWithValues;
