import { Router } from 'express';

const router = Router();

router.post('/', async (req, res) => {
  try {
    const { symptoms } = req.body;
    
    if (!symptoms || !Array.isArray(symptoms)) {
      return res.status(400).json({ error: 'Symptoms array is required' });
    }

    // Call Python ML Microservice
    const mlResponse = await fetch('http://localhost:8000/predict', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ symptoms })
    });

    if (!mlResponse.ok) {
      throw new Error(`ML Service Error: ${mlResponse.statusText}`);
    }

    const data = await mlResponse.json();
    
    const predictions = data.predictions || [];
    
    let riskLevel = "Low";
    let severityScore = 0;
    
    if (predictions.length > 0) {
      const topProb = predictions[0].probability;
      severityScore = Math.round(topProb * 100);
      
      if (severityScore > 80) riskLevel = "High";
      else if (severityScore > 50) riskLevel = "Medium";
      else riskLevel = "Low";
    }

    const result = {
      predictions,
      riskLevel,
      severityScore,
      timestamp: new Date().toISOString()
    };
    
    // TODO: Connect to Firebase and save the result

    return res.json(result);
  } catch (error) {
    console.error('Prediction Error:', error);
    return res.status(500).json({ error: 'Internal server error during prediction' });
  }
});

export default router;
