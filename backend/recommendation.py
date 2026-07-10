from backend.disease_info import (
    get_description,
    get_precautions,
    get_diet,
    get_medication,
    get_workout
)

def get_recommendations(disease):
    return {
        "Disease": disease,
        "Description": get_description(disease),
        "Precautions": get_precautions(disease),
        "Diet": get_diet(disease),
        "Medication": get_medication(disease),
        "Workout": get_workout(disease)
    }

# Test
print(get_recommendations("Diabetes"))