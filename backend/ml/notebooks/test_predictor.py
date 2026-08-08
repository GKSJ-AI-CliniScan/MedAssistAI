from predictor import predict_with_information


symptoms = [
    "fevdepressive or psychotic symptomser",
    "shortness of breath",
    "anxiety and nervousness"
]


result = predict_with_information(symptoms)


print("\nPredicted Disease:")
print(result["predicted_disease"])


print("\nDisease Information:")

if result["information"]:

    info = result["information"]

    print("\nDescription:")
    print(info["Description"])

    print("\nPrecautions:")
    print(info["Precautions"])

    print("\nMedicines:")
    print(info["Medicines"])

    print("\nDiet:")
    print(info["Diet Recommendations"])

    print("\nLifestyle:")
    print(info["Workout / Lifestyle Recommendations"])

    print("\nSpecialist:")
    print(info["Specialist"])

    print("\nSeverity:")
    print(info["Severity"])

else:

    print("Disease information not found.")