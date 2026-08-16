from typing import List
from sqlalchemy.orm import Session

from app.models.symptom import Symptom
from app.schemas.symptom_schema import SymptomCreate

# Predefined standard medical symptoms list for seeding
DEFAULT_SYMPTOMS = [
    {"name": "fever", "category": "General", "severity_weight": 2, "description": "Elevated body temperature"},
    {"name": "high_fever", "category": "General", "severity_weight": 3, "description": "High fever above 102F"},
    {"name": "cough", "category": "Respiratory", "severity_weight": 1, "description": "Dry or productive cough"},
    {"name": "persistent_cough", "category": "Respiratory", "severity_weight": 3, "description": "Cough lasting more than 2 weeks"},
    {"name": "headache", "category": "Neurological", "severity_weight": 1, "description": "Head pain or pressure"},
    {"name": "severe_headache", "category": "Neurological", "severity_weight": 3, "description": "Severe debilitating head pain"},
    {"name": "fatigue", "category": "General", "severity_weight": 1, "description": "Feeling weak or exhausted"},
    {"name": "nausea", "category": "Digestive", "severity_weight": 1, "description": "Feeling like vomiting"},
    {"name": "vomiting", "category": "Digestive", "severity_weight": 2, "description": "Throwing up contents of stomach"},
    {"name": "persistent_vomiting", "category": "Digestive", "severity_weight": 3, "description": "Inability to keep liquids down"},
    {"name": "chest_pain", "category": "Cardiovascular", "severity_weight": 5, "description": "Pain or pressure in chest area"},
    {"name": "difficulty_breathing", "category": "Respiratory", "severity_weight": 5, "description": "Shortness of breath or dyspnea"},
    {"name": "shortness_of_breath", "category": "Respiratory", "severity_weight": 5, "description": "Inability to catch breath"},
    {"name": "dizziness", "category": "Neurological", "severity_weight": 3, "description": "Feeling lightheaded or faint"},
    {"name": "abdominal_pain", "category": "Digestive", "severity_weight": 3, "description": "Stomach cramp or abdominal discomfort"},
    {"name": "unconsciousness", "category": "Emergency", "severity_weight": 5, "description": "Loss of consciousness or fainting"},
    {"name": "seizure", "category": "Emergency", "severity_weight": 5, "description": "Uncontrolled electrical disturbance in brain"},
    {"name": "severe_bleeding", "category": "Emergency", "severity_weight": 5, "description": "Uncontrolled external or internal bleeding"},
]


def seed_symptoms(db: Session) -> None:
    from app.database.seed_symptoms import seed_symptoms as db_seed_symptoms
    db_seed_symptoms(db)


def get_all_symptoms(db: Session, skip: int = 0, limit: int = 500) -> List[Symptom]:
    """
    Retrieve paginated list of symptoms with deterministic ID ordering before pagination.
    Supports fetching the full 370+ symptom catalogue.
    """
    count = db.query(Symptom).count()
    if count == 0:
        seed_symptoms(db)
    query = db.query(Symptom).order_by(Symptom.id.asc()).offset(skip)
    if limit is not None and limit > 0:
        query = query.limit(limit)
    return query.all()


def create_symptom(db: Session, data: SymptomCreate) -> Symptom:
    symptom = Symptom(
        name=data.name.strip().lower().replace(" ", "_"),
        description=data.description,
        category=data.category or "General",
        severity_weight=data.severity_weight or 1,
    )
    db.add(symptom)
    db.commit()
    db.refresh(symptom)
    return symptom
