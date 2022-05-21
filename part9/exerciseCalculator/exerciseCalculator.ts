interface ExcerciseValues {
  target: number;
  dailyExercise: Array<number>;
}

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

const parseExcercise = (args: Array<string>): ExcerciseValues => {
  if (args.length < 4) throw new Error('Not enough arguments');

  const target = Number(args[2]);
  const dailyExercise = [];

  for (let i = 2; i < args.length; i++) {
    if (isNaN(Number(args[i]))) {
      throw new Error('Provided values were not numbers!');
    }
    if (i > 2) {
      dailyExercise.push(Number(args[i]));
    }
  }
  return {
    target,
    dailyExercise,
  };
};

const calculateExercises = (
  target: number,
  dailyExercise: Array<number>
): void => {
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
  const result: excercisesResult = {
    periodLength,
    trainingDays,
    target,
    average,
    success,
    rating,
    ratingDescription: ratingString[rating],
  };
  console.log(result);
};

try {
  const { target, dailyExercise } = parseExcercise(process.argv);
  calculateExercises(target, dailyExercise);
} catch (error: unknown) {
  let errorMessage = 'Something bad happened.';
  if (error instanceof Error) {
    errorMessage += ' Error: ' + error.message;
  }
  console.log(errorMessage);
}
