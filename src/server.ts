import express from 'express';
import cors from 'cors';
import predictionRouter from './routes/prediction';
import reportsRouter from './routes/reports';
import symptomsRouter from './routes/symptoms';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is running' });
});

app.use('/api/predict', predictionRouter);
app.use('/api/reports', reportsRouter);
app.use('/api/symptoms', symptomsRouter);

app.listen(PORT, () => {
  console.log(`🚀 Backend server is running on http://localhost:${PORT}`);
});
