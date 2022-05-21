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

const calculateBmi = (height: number, weight: number): void => {
  const bmi = weight / (height / 100) ** 2;
  let result = '';
  if (bmi < 16) {
    result = 'Underweight (Severe thinness)';
  } else if (bmi < 17 && bmi >= 16) {
    result = 'Underweight (Moderate thinness)';
  } else if (bmi < 18.5 && bmi >= 17) {
    result = 'Underweight (Mild thinness)';
  } else if (bmi < 25 && bmi >= 18.5) {
    result = 'Normal (Healthy weight)';
  } else if (bmi < 30 && bmi >= 25) {
    result = 'Overweight (Pre-obese)';
  } else if (bmi < 35 && bmi >= 30) {
    result = 'Obese (Class I)';
  } else if (bmi < 40 && bmi >= 35) {
    result = 'Obese (Class II)';
  } else if (bmi >= 40) {
    result = 'Obese (Class III)';
  }
  console.log(`The person's BMI is in the range: ${result}.`);
};

try {
  const { height, weight } = parseBMI(process.argv);
  calculateBmi(height, weight);
} catch (error: unknown) {
  let errorMessage = 'Something bad happened.';
  if (error instanceof Error) {
    errorMessage += ' Error: ' + error.message;
  }
  console.log(errorMessage);
}
