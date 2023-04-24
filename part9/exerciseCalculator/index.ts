import express from 'express';
import { calculateBmi } from './bmiCalculator';
import { calculateExercises } from './exerciseCalculator';

const app = express();
app.use(express.json());

app.get('/hello', (_req, res) => {
  res.send('Hello Full Stack!');
});

// /bmi?height=180&weight=72
app.get('/bmi', (req, res) => {
  if (!isNaN(Number(req.query.height)) && !isNaN(Number(req.query.weight))) {
    const height = Number(req.query.height);
    const weight = Number(req.query.weight);
    res.send({
      height,
      weight,
      bmi: calculateBmi(height, weight),
    });
  } else {
    res.send({
      error: 'malformatted parameters',
    });
  }
});

app.post('/exercises', (request, response) => {
  const data = request.body;
  if (!data.target || !data.daily_exercises) {
    return response.send({
      error: 'parameters missing',
    });
  }
  
  if (typeof data.target != 'number' || !Array.isArray(data.daily_exercises)) {
    return response.send({
      error: 'malformatted parameters',
    });
  }

  for (let i = 0; i < data.daily_exercises.length; i++) {
    if (typeof data.daily_exercises[i] != 'number') {
      return response.send({
        error: 'malformatted parameters',
      });
    }
  }

  const target: number = data.target;
  const daily_exercises: Array<number> = data.daily_exercises;

  return response.send(calculateExercises(target, daily_exercises));
});

const PORT = 3002;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
