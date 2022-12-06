
  const scoreRangeFinder = (value) => {
    switch (true) {
      case value === 0:
        return 0;
        break;
      case value < 20:
        return 1;
        break;
      case value < 40:
        return 2;
      case value < 60:
        return 3;
        break;
      case value < 80:
        return 4;
        break;
      default:
        return 5;
        break;
    }
  };

  module.exports = scoreRangeFinder;