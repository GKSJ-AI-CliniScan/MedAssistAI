from pydantic import BaseModel, ConfigDict

class ReportResponse(BaseModel):
    id: int
    file_name: str
    report_type: str
    size_kb: int
    created_at: str
    pdf_url: str

    model_config = ConfigDict(from_attributes=True)
