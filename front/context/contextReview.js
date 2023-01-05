import React, { createContext, useContext, useEffect, useState } from "react";
import { useHttpClient } from "../components/Hooks/http-hook";
import template from "../reviewTemplate";

export const reviewContextData = createContext({
  reviewData: {
    unitData: {
      unit: template.unit,
      command: template.command,
      division: template.division,
      brigade: template.brigade,
    },
    scores: template.scores,
    summary: template.Summary,
  },
  clearContext: () => {},
  loadInitialData: () => {},
  sendReview: () => {},
  editReview: () => {},
  changeUnit: () => {},
  changeSubject1: () => {},
  changeSubject2: () => {},
  changeSubject3: () => {},
  changeSubject4: () => {},
  changeSubject5: () => {},
  changeSubject6: () => {},
  changeSummary: () => {},
});

export const ReviewContextProvider = (props) => {
  const [reviewData, setReviewData] = useState({
    unitData: {
      unit: template.unit,
      command: template.command,
      division: template.division,
      brigade: template.brigade,
    },
    scores: template.scores,
    summary: template.Summary,
  });
  const { sendRequest, clearError } = useHttpClient();

  const loadInitialDataHandler = (values) => {
    setReviewData({ ...values });
  };

  const clearContextHandler = () => {
    loadInitialDataHandler({
      unitData: {
        unit: template.unit,
        command: template.command,
        division: template.division,
        brigade: template.brigade,
      },
      scores: template.scores,
      summary: template.Summary,
    });
  };

  const changUnitHandler = (values) => {
    setReviewData((prev) => {
      return {
        ...prev,
        unitData: { ...prev.unitData, ...values },
      };
    });
  };

  const changeSubject1Handler = (values) => {
    setReviewData((prev) => {
      return {
        ...prev,
        scores: {
          ...prev.scores,
          subject1: { ...prev.scores.subject1, ...values },
        },
      };
    });
  };

  const changeSubject2Handler = (values) => {
    setReviewData((prev) => {
      return {
        ...prev,
        scores: {
          ...prev.scores,
          subject2: { ...prev.scores.subject2, ...values },
        },
      };
    });
  };

  const changeSubject3Handler = (values) => {
    setReviewData((prev) => {
      return {
        ...prev,
        scores: {
          ...prev.scores,
          subject3: { ...prev.scores.subject3, ...values },
        },
      };
    });
  };

  const changeSubject4Handler = (values) => {
    setReviewData((prev) => {
      return {
        ...prev,
        scores: {
          ...prev.scores,
          subject4: { ...prev.scores.subject4, ...values },
        },
      };
    });
  };

  const changeSubject5Handler = (values) => {
    setReviewData((prev) => {
      return {
        ...prev,
        scores: {
          ...prev.scores,
          subject5: { ...prev.scores.subject5, ...values },
        },
      };
    });
  };

  const changeSubject6Handler = (values) => {
    setReviewData((prev) => {
      return {
        ...prev,
        scores: {
          ...prev.scores,
          subject6: { ...prev.scores.subject6, ...values },
        },
      };
    });
  };

  const changeSummaryHandler = (values) => {
    setReviewData((prev) => {
      return {
        ...prev,
        summary: {
          ...prev.summary,
          ...values,
        },
      };
    });
  };

  const sendReviewHandler = async (userId, userToken) => {
    // check if unit and command is not empty

    if (
      !reviewData.unitData.unit ||
      reviewData.unitData.unit === "" ||
      !reviewData.unitData.command ||
      reviewData.unitData.command === ""
    ) {
      // console.log(reviewContext);
      // openModal("danger", "אנא הזן יחידה");
      throw new Error("אנא הזן שם יחידה");
    }

    const body = {
      author: userId,
      unit: reviewData.unitData.unit,
      command: reviewData.unitData.command,
      division: !!reviewData.unitData.division
        ? reviewData.unitData.division
        : null,
      brigade: !!reviewData.unitData.brigade
        ? reviewData.unitData.brigade
        : null,
      scores: reviewData.scores,
      Summary: reviewData.summary,
    };

    console.log(body);

    try {
      const response = await sendRequest(
        `${process.env.NEXT_PUBLIC_API_ADDRESS}api/reviews/newReview`,
        "POST",
        JSON.stringify(body),
        {
          "Content-Type": "application/json",
          Authorization: userToken,
        }
      );
      if (!!response.success) {
        // openModal("success", "הביקורת נוספה בהצלחה");
        // setLoading(false);
        // reviewContext.clearContext();
        clearContextHandler();
        // router.push("/dashboard");
      } else {
        throw new Error("קרתה תקלה במהלך שליחת הביקורת");
      }
    } catch (err) {
      clearError();
      // openModal("danger", "קרתה תקלה במהלך שליחת הביקורת");
      // setLoading(false);
      throw new Error("קרתה תקלה במהלך שליחת הביקורת");
    }

    return body;
  };

  const editReviewHandler = async (authorId,reviewId, userToken) => {
    // check if unit and command is not empty

    if (
      !reviewData.unitData.unit ||
      reviewData.unitData.unit === "" ||
      !reviewData.unitData.command ||
      reviewData.unitData.command === ""
    ) {
      // console.log(reviewContext);
      // openModal("danger", "אנא הזן יחידה");
      throw new Error("קרתה שגיאה במהלך עדכון הביקורת");
    }

    const body = {
      author: authorId,
      unit: reviewData.unitData.unit,
      command: reviewData.unitData.command,
      division: !!reviewData.unitData.division
        ? reviewData.unitData.division
        : null,
      brigade: !!reviewData.unitData.brigade
        ? reviewData.unitData.brigade
        : null,
      scores: reviewData.scores,
      Summary: reviewData.summary,
    };

    console.log(body);

    try {
      const response = await sendRequest(
        `${process.env.NEXT_PUBLIC_API_ADDRESS}api/reviews/${reviewId}`,
        "PATCH",
        JSON.stringify(body),
        {
          "Content-Type": "application/json",
          Authorization: userToken,
        }
      );
      if (!!response.success) {
        // openModal("success", "הביקורת נוספה בהצלחה");
        // setLoading(false);
        // reviewContext.clearContext();
        clearContextHandler();
        // router.push("/dashboard");
      } else {
        throw new Error("קרתה תקלה במהלך עדכון הביקורת");
      }
    } catch (err) {
      clearError();
      // openModal("danger", "קרתה תקלה במהלך שליחת הביקורת");
      // setLoading(false);
      throw new Error("קרתה תקלה במהלך עדכון הביקורת");
    }

    return body;
  };

  return (
    <reviewContextData.Provider
      value={{
        reviewData,
        loadInitialData: loadInitialDataHandler,
        changeUnit: changUnitHandler,
        clearContext: clearContextHandler,
        sendReview: sendReviewHandler,
        editReview:editReviewHandler,
        changeSubject1: changeSubject1Handler,
        changeSubject2: changeSubject2Handler,
        changeSubject3: changeSubject3Handler,
        changeSubject4: changeSubject4Handler,
        changeSubject5: changeSubject5Handler,
        changeSubject6: changeSubject6Handler,
        changeSummary: changeSummaryHandler,
      }}
    >
      {props.children}
    </reviewContextData.Provider>
  );
};
