const average = (values) => values.reduce((a, b) => a + b) / values.length;

/**
 *
 * @param {object} estmForOneStory The estimation object from the redux state, mapping userIds (keys) to estimation values (values)
 * @return {{average: *, highest: number, estimationCount: number, lowest: number}}
 */
export default function getEstimationSummary(estmForOneStory) {
  const estmValues = Object.values(estmForOneStory);
  if (estmValues.length < 1) {
    return {
      lowest: undefined,
      highest: undefined,
      average: undefined,
      estimationCount: 0
    };
  }

  const estimationValues = estmValues.map((value) => {
    if (typeof value === 'string') {
      return parseFloat(value);
    } else {
      return value;
    }
  });

  return {
    average: average(estimationValues),
    highest: Math.max(...estimationValues),
    lowest: Math.min(...estimationValues),
    estimationCount: estimationValues.length
  };
}