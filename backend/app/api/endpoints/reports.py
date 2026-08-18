from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse
from app.core.database import get_database
from app.core.security import get_current_user
from app.services.pdf_service import create_report

router = APIRouter()


@router.get("")
async def get_reports(current_user: dict = Depends(get_current_user)):
    db = get_database()

    reports = []

    async for report in db.consultations.find(
        {"user_email": current_user["email"]}
    ).sort("created_at", -1):

        # MongoDB ObjectId cannot be returned directly as JSON
        report.pop("_id", None)

        reports.append(report)

    return reports


@router.get("/{report_id}/download")
async def download_report(
    report_id: str,
    current_user: dict = Depends(get_current_user),
):
    db = get_database()

    report = None

    # Search MongoDB for the report
    async for item in db.consultations.find(
        {"user_email": current_user["email"]}
    ):
        item_id = str(item.get("id") or item.get("_id"))

        if item_id == report_id:
            report = item
            break

    if report is None:
        raise HTTPException(
            status_code=404,
            detail="Report not found"
        )

    pdf_path = create_report(report)

    return FileResponse(
        path=pdf_path,
        media_type="application/pdf",
        filename="MedAssist_Report.pdf",
    )


@router.delete("/{report_id}")
async def delete_report(
    report_id: str,
    current_user: dict = Depends(get_current_user),
):
    db = get_database()

    print("REPORT ID RECEIVED:", report_id)
    print("ALL REPORTS:", db.consultations.data)

    reports = db.consultations.data



    for i, report in enumerate(reports):

        report_id_db = str(report.get("id") or report.get("_id"))

        if (
            report_id_db == report_id
            and report.get("user_email") == current_user["email"]
        ):

            reports.pop(i)

            db.consultations._save_data()

            return {
                "message": "Report deleted successfully"
            }

    raise HTTPException(
        status_code=404,
        detail="Report not found"
    )

    await db.consultations.delete_one({"_id": report["_id"]})

    return {"message": "Report deleted successfully"}