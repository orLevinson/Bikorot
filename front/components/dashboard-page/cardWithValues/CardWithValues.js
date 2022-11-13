import React from "react";
import GaugeChart from "react-gauge-chart";
import Card from "../../Card/Card";

const CardWithValues = () => {
  return (
    <Card>
      <div onClick={()=>{console.log("hi")}} style={{textAlign:"center",cursor:"pointer"}}>
        <h4 style={{fontWeight:"bold"}}>חטיבה 103</h4>
        ממוצע ביקורות
        <GaugeChart
          id="gauge-chart2"
          nrOfLevels={20}
          percent={0.86}
          colors={["#FF5F6D", "#FFC371"]} 
          textColor={"black"}
        ></GaugeChart>
      </div>
      <div style={{textAlign:"center"}}>
        ממוצע מנהלים פנימי
      <GaugeChart
        id="gauge-chart2"
        nrOfLevels={20}
        percent={0.86}
        colors={["#FF5F6D", "#FFC371"]} 
        textColor={"black"}
      ></GaugeChart>
      </div>
    </Card>
  );
};

export default CardWithValues;
