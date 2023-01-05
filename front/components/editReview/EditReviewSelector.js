import React, { useContext, useMemo, useState, useEffect} from "react";
import { reviewContextData } from "../../context/contextReview";
import ChooseUnit from "./ChooseUnit";
import Subject1 from "./subject1";
import Subject2 from "./subject2";
import Subject3 from "./subject3";
import Subject4 from "./subject4";
import Subject5 from "./subject5";
import Subject6 from "./subject6";
import Summary from "./Summary";

const EditReviewSelector = (props) => {
  const { step, review } = props;
  const { loadInitialData } = useContext(reviewContextData);
  const [names, setNames] = useState({
    unit: null,
    command: null,
    division: null,
    brigade: null,
  });

  useEffect(() => {
    console.log(review);

    loadInitialData({
      unitData: {
        unit: review.unit._id,
        command: review.command._id,
        division: !!review.division ? review.division._id : null,
        brigade: !!review.brigade ? review.brigade._id : null,
      },
      scores: review.scores,
      summary: review.Summary,
    });

    setNames(() => {
      return {
        unit: review.unit.name,
        command: review.command.name,
        division: !!review.division ? review.division.name : null,
        brigade: !!review.brigade ? review.brigade.name : null,
      };
    });
  }, []);

  let stage = useMemo(() => null, [step]);

  switch (props.step) {
    case 0:
      stage = <ChooseUnit {...props} names={names} />;
      break;
    case 1:
      stage = (
        <div>
          <Subject1
            files={
              !!props.files && !!props.files.subject1
                ? props.files.subject1
                : {}
            }
          />
        </div>
      );
      break;
    case 2:
      stage = (
        <div>
          <Subject2
            files={
              !!props.files && !!props.files.subject2
                ? props.files.subject2
                : {}
            }
          />
        </div>
      );
      break;
    case 3:
      stage = (
        <div>
          <Subject3
            files={
              !!props.files && !!props.files.subject3
                ? props.files.subject3
                : {}
            }
          />
        </div>
      );
      break;
    case 4:
      stage = (
        <div>
          <Subject4
            files={
              !!props.files && !!props.files.subject4
                ? props.files.subject4
                : {}
            }
          />
        </div>
      );
      break;
    case 5:
      stage = (
        <div>
          <Subject5
            files={
              !!props.files && !!props.files.subject5
                ? props.files.subject5
                : {}
            }
          />
        </div>
      );
      break;
    case 6:
      stage = (
        <div>
          <Subject6
            files={
              !!props.files && !!props.files.subject6
                ? props.files.subject6
                : {}
            }
          />
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

export default React.memo(EditReviewSelector);
