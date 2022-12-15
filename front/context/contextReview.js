import React, { createContext, useContext, useEffect, useState } from "react";
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
    setReviewData({
      ...reviewData,
      unitData: { ...values },
    });
  };

  const changeSubject1Handler = (values) => {
    setReviewData({
      ...reviewData,
      scores: {
        ...reviewData.scores,
        subject1: { ...reviewData.scores.subject1, ...values },
      },
    });
  };

  const changeSubject2Handler = (values) => {
    setReviewData({
      ...reviewData,
      scores: {
        ...reviewData.scores,
        subject2: { ...reviewData.scores.subject2, ...values },
      },
    });
  };

  const changeSubject3Handler = (values) => {
    setReviewData({
      ...reviewData,
      scores: {
        ...reviewData.scores,
        subject3: { ...reviewData.scores.subject3, ...values },
      },
    });
  };

  const changeSubject4Handler = (values) => {
    setReviewData({
      ...reviewData,
      scores: {
        ...reviewData.scores,
        subject4: { ...reviewData.scores.subject4, ...values },
      },
    });
  };

  const changeSubject5Handler = (values) => {
    setReviewData({
      ...reviewData,
      scores: {
        ...reviewData.scores,
        subject5: { ...reviewData.scores.subject5, ...values },
      },
    });
  };

  const changeSubject6Handler = (values) => {
    setReviewData({
      ...reviewData,
      scores: {
        ...reviewData.scores,
        subject6: { ...reviewData.scores.subject6, ...values },
      },
    });
  };

  const changeSummaryHandler = (values) => {
    setReviewData({
      ...reviewData,
      summary: {
        ...reviewData.summary,
        ...values,
      },
    });
  };

  return (
    <reviewContextData.Provider
      value={{
        reviewData,
        loadInitialData: loadInitialDataHandler,
        changeUnit: changUnitHandler,
        clearContext: clearContextHandler,
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
