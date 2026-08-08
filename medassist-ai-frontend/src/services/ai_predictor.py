import google.generativeai as genai
import os

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

model = genai.GenerativeModel("gemini-1.5-flash")

async def predict_disease(symptoms):
    prompt = f"""
You are an experienced medical AI.

Symptoms:
{", ".join(symptoms)}

Return ONLY valid JSON.

Format:
{{
  "disease":"...",
  "confidence":92,
  "risk":"Low/Medium/High",
  "recommendations":[
      "...",
      "..."
  ],
  "tests":[
      "...",
      "..."
  ]
}}
"""

    response = model.generate_content(prompt)
    return response.text