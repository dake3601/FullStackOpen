import express from 'express';
import { calculateBmi } from './bmiCalculator';

const app = express();

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

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
