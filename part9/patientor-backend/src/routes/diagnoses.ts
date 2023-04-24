import express from 'express';

import diagnosesService from '../services/diagnosesService';

const router = express.Router();

router.get('/', (_req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.send(diagnosesService.getDiagnoses());
});

export default router;
