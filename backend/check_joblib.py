import joblib

models = [
    "decision_tree_model.pkl",
    "random_forest_model.pkl",
    "extra_tree_model.pkl",
    "gradient_boosting_model.pkl",
    "stacking_classifier.pkl",
    "voting_classifier.pkl"
]

for m in models:
    print("\nChecking:", m)

    try:
        model = joblib.load("backend/" + m)
        print("✅ Loaded successfully")
        print(type(model))

    except Exception as e:
        print("❌ Failed")
        print(e)