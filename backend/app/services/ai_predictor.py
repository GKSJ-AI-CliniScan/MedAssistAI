from app.core.config import settings
from groq import Groq
import json

client = Groq(api_key=settings.GROQ_API_KEY)

async def predict_disease(symptoms):

    prompt = f"""
You are an experienced medical AI assistant.

Patient symptoms:
{', '.join(symptoms)}

Based on the symptoms, predict the MOST LIKELY disease.

Return ONLY a valid JSON object.

Do NOT use markdown.
Do NOT use ```json.
Do NOT write any explanation.

Example:

{{
  "prediction": "...",
  "confidence": 90,
  "risk": "Low",
  "reason": "...",
  "recommendations": [],
  "tests": [],
  "precautions": [],
  "when_to_see_doctor": "..."
}}
"""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0.2
    )

    text = response.choices[0].message.content

    print("\n========== GROQ RESPONSE ==========")
    print(text)
    print("===================================\n")

    text = text.replace("```json", "")
    text = text.replace("```", "")
    text = text.strip()

    data = json.loads(text)

    # Add selected symptoms to response
    data["symptoms"] = symptoms

    return data