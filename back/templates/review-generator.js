const categoryScoresCreator = (arrayLen) => {
  const arr = [];
  for (let i = 0; i < arrayLen; i++) {
    arr.push({
      score: Math.floor(Math.random() * 101),
      text: Math.random() > 0.5 ? "הציון הלך בסדר" : "לא משהו",
    });
  }
  return arr;
};

const reviewGenerator = ({
  authorId,
  unitId,
  commandId,
  divisionId,
  brigadeId,
}) => {
  const review = {};
  review.author = authorId;
  review.unit = unitId;
  review.command = commandId;
  review.division = !!divisionId ? divisionId : null;
  review.brigade = !!brigadeId ? brigadeId : null;
  review.scores = {
    subject1: {
      category1: categoryScoresCreator(4),
      category2: categoryScoresCreator(14),
      category3: categoryScoresCreator(6),
      category4: categoryScoresCreator(15),
      category5: categoryScoresCreator(8),
      category6: categoryScoresCreator(3),
      category7: categoryScoresCreator(1),
      category8: categoryScoresCreator(7),
      category9: categoryScoresCreator(4),
      category10: categoryScoresCreator(6),
    },
    subject2: {
      category1: categoryScoresCreator(5),
      category2: categoryScoresCreator(4),
    },
    subject3: {
      category1: categoryScoresCreator(1),
      category2: categoryScoresCreator(1),
      category3: categoryScoresCreator(1),
      category4: categoryScoresCreator(1),
      category5: categoryScoresCreator(1),
      category6: categoryScoresCreator(1),
    },
    subject4: {
      category1: categoryScoresCreator(1),
      category2: categoryScoresCreator(1),
      category3: categoryScoresCreator(1),
      category4: categoryScoresCreator(1),
      category5: categoryScoresCreator(1),
      category6: categoryScoresCreator(1),
      category7: categoryScoresCreator(1),
    },
    subject5: {
      category1: categoryScoresCreator(8),
      category2: categoryScoresCreator(5),
      category3: categoryScoresCreator(3),
    },
    subject6:{
      category1: categoryScoresCreator(11),
    },
    Summary: {
      subject1: {
        text: Math.random() > 0.5 ? "הציון הלך בסדר" : "לא משהו",
      },
      subject2: {
        text: Math.random() > 0.5 ? "הציון הלך בסדר" : "לא משהו",
      },
      subject3: {
        text: Math.random() > 0.5 ? "הציון הלך בסדר" : "לא משהו",
      },
      subject4: {
        text: Math.random() > 0.5 ? "הציון הלך בסדר" : "לא משהו",
      },
      subject5: {
        text: Math.random() > 0.5 ? "הציון הלך בסדר" : "לא משהו",
      },
    },
  };

  return { ...review };
};

module.exports = reviewGenerator;
