interface person {
  height: number;
  weight: number;
}
const parseBMI = (args: Array<string>): person => {
  if (args.length < 4) throw new Error('Not enough arguments');
  if (args.length > 4) throw new Error('Too many arguments');

  if (!isNaN(Number(args[2])) && !isNaN(Number(args[3]))) {
    return {
      height: Number(args[2]),
      weight: Number(args[3]),
    };
  } else {
    throw new Error('Provided values were not numbers!');
  }
};

const calculateBmi = (height: number, weight: number): string => {
  const bmi = weight / (height / 100) ** 2;
  if (bmi < 16) {
    return 'Underweight (Severe thinness)';
  } else if (bmi < 17 && bmi >= 16) {
    return 'Underweight (Moderate thinness)';
  } else if (bmi < 18.5 && bmi >= 17) {
    return 'Underweight (Mild thinness)';
  } else if (bmi < 25 && bmi >= 18.5) {
    return 'Normal (Healthy weight)';
  } else if (bmi < 30 && bmi >= 25) {
    return 'Overweight (Pre-obese)';
  } else if (bmi < 35 && bmi >= 30) {
    return 'Obese (Class I)';
  } else if (bmi < 40 && bmi >= 35) {
    return 'Obese (Class II)';
  }
  return 'Obese (Class III)';
};

try {
  const { height, weight } = parseBMI(process.argv);
  const result = calculateBmi(height, weight);
  console.log(`The person's BMI is in the range: ${result}.`);
} catch (error: unknown) {
  let errorMessage = 'Something bad happened.';
  if (error instanceof Error) {
    errorMessage += ' Error: ' + error.message;
  }
  console.log(errorMessage);
}

export { calculateBmi };
