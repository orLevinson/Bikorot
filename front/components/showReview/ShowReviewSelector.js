import React, { useContext, useMemo,useEffect } from "react";
import { reviewContextData } from "../../context/contextReview";
import ChooseUnit from "./ChooseUnit";
import Subject1 from "./subject1";
import Subject2 from "./subject2";
import Subject3 from "./subject3";
import Subject4 from "./subject4";
import Subject5 from "./subject5";
import Subject6 from "./subject6";
import Summary from "./Summary";

const ShowReviewSelector = (props) => {
  const { step, review } = props;
  const { loadInitialData } = useContext(reviewContextData);

  useEffect(() => {
    loadInitialData({
      unitData: {
        unit: review.unit.name,
        command: review.command.name,
        division: !!review.division ? review.division.name:"אין",
        brigade: !!review.brigade ? review.brigade.name:"אין",
      },
      scores: review.scores,
      summary: review.Summary,
    });
  }, []);

  let stage = useMemo(() => null, [step]);
  switch (props.step) {
    case 0:
      stage = <ChooseUnit {...props} />;
      break;
    case 1:
      stage = (
        <div>
          <Subject1 />
        </div>
      );
      break;
    case 2:
      stage = (
        <div>
          <Subject2 />
        </div>
      );
      break;
    case 3:
      stage = (
        <div>
          <Subject3 />
        </div>
      );
      break;
    case 4:
      stage = (
        <div>
          <Subject4 />
        </div>
      );
      break;
    case 5:
      stage = (
        <div>
          <Subject5 />
        </div>
      );
      break;
    case 6:
      stage = (
        <div>
          <Subject6 />
        </div>
      );
      break;
    case 7:
      stage = (
        <div>
          <Summary />
        </div>
      );
      break;
    default:
      stage = <div>error</div>;
      break;
  }
  return stage;
};

export default React.memo(ShowReviewSelector);
