import pickle

models = [
    "decision_tree_model.pkl",
    "random_forest_model.pkl",
    "extra_tree_model.pkl",
    "gradient_boosting_model.pkl",
    "catboost_model.pkl",
    "xgboost_model.pkl",
    "stacking_classifier.pkl",
    "voting_classifier.pkl"
]

for m in models:
    print("\nChecking:", m)
    try:
        with open("backend/" + m, "rb") as f:
            model = pickle.load(f)

        print("✅ Loaded successfully")
        print("Type:", type(model))

    except Exception as e:
        print("❌ Failed")
        print(e)