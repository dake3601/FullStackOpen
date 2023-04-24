import express from 'express';

import patientsService from '../services/patientsService';

const router = express.Router();

router.get('/', (_req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.send(patientsService.getPatientsPublic());
});

export default router;
