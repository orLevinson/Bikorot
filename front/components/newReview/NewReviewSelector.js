import React from "react";
import ChooseUnit from "./ChooseUnit";
import Questions from "./Questions";
import Summary from "./Summary";

const NewReviewSelector = (props) => {
  let stage;
  switch (props.step) {
    case 0:
      stage = <ChooseUnit next={props.next} />;
      break;
    case 1:
      stage = (
        <div>
          <Questions />
        </div>
      );
      break;
    case 2:
      stage = (
        <div>
          <Questions />
        </div>
      );
      break;
    case 3:
      stage = (
        <div>
          <Questions />
        </div>
      );
      break;
    case 4:
      stage = (
        <div>
          <Questions />
        </div>
      );
      break;
    case 5:
      stage = (
        <div>
          <Questions />
        </div>
      );
      break;
    case 6:
      stage = <Summary/>;
      break;
    default:
      stage = <div>error</div>;
      break;
  }
  return <div>{stage}</div>;
};

export default NewReviewSelector;
