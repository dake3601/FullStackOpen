type ratingType = 1 | 2 | 3;

interface excercisesResult {
  periodLength: number;
  trainingDays: number;
  target: number;
  average: number;
  success: boolean;
  rating: ratingType;
  ratingDescription: string;
}

const calculateExercises = (
  dailyExercise: Array<number>,
  target: number
): excercisesResult => {
  const periodLength = dailyExercise.length;
  const trainingDays = dailyExercise.reduce(
    (prev, curr) => prev + Number(curr > 0),
    0
  );
  const average =
    dailyExercise.reduce((prev, curr) => prev + curr, 0) / dailyExercise.length;
  const success = average >= target;
  const ratingString = {
    1: 'try harder next time',
    2: 'not too bad but could be better',
    3: 'geat job!',
  };
  let rating: ratingType = 1;
  if (average >= target) {
    rating = 3;
  } else if (average >= target / 2) {
    rating = 2;
  }
  return {
    periodLength,
    trainingDays,
    target,
    average,
    success,
    rating,
    ratingDescription: ratingString[rating],
  };
};

console.log(calculateExercises([3, 0, 2, 4.5, 0, 3, 1], 2));
console.log(calculateExercises([1, 1, 1, 1, 1], 1));
console.log(calculateExercises([1, 0, 2, 5], 2));
