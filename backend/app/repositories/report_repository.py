import os
import datetime
from typing import Optional, List
from sqlalchemy.orm import Session
from app.models.report import Report

class ReportRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, patient_id: int, prediction_id: int, file_name: str, file_path: str) -> Report:
        report = Report(
            patient_id=patient_id,
            prediction_id=prediction_id,
            file_name=file_name,
            file_path=file_path,
            size_kb=round(os.path.getsize(file_path) / 1024) if os.path.exists(file_path) else 240,
        )
        self.db.add(report)
        self.db.commit()
        self.db.refresh(report)
        return report

    def get_by_patient(self, patient_id: int) -> List[Report]:
        return (
            self.db.query(Report)
            .filter(Report.patient_id == patient_id)
            .order_by(Report.created_at.desc())
            .all()
        )

    def get_by_id(self, report_id: int) -> Optional[Report]:
        return self.db.query(Report).filter(Report.id == report_id).first()

    def get_by_prediction(self, prediction_id: int) -> Optional[Report]:
        return self.db.query(Report).filter(Report.prediction_id == prediction_id).first()

    def count(self) -> int:
        return self.db.query(Report).count()
