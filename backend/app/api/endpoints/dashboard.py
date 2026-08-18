from fastapi import APIRouter, Depends
from app.core.database import get_database
from app.core.security import get_current_user

router = APIRouter()


@router.get("")
async def dashboard(current_user: dict = Depends(get_current_user)):
    db = get_database()

    reports = []

    async for report in db.consultations.find(
        {"user_email": current_user["email"]}
    ).sort("created_at", -1):
        reports.append(report)

    report_count = len(reports)

    healthy = 0
    risk = 0
    critical = 0
    monitoring = 0

    analytics_values = []

    for report in reports:
        confidence = int(report.get("confidence", 0))
        analytics_values.append(confidence)

        level = str(report.get("risk", "")).lower()

        if "healthy" in level or "low" in level:
            healthy += 1
        elif "medium" in level:
            monitoring += 1
        elif "high" in level:
            risk += 1
        else:
            critical += 1

    if report_count == 0:
        health_score = 100
    else:
        health_score = max(
            0,
            int(sum(analytics_values) / report_count)
        )

    recent_reports = []

    for report in reports[:5]:
        recent_reports.append({
            "id": report.get("id"),
            "title": report.get("prediction", "Health Report"),
            "date": report.get("date", ""),
            "risk_level": report.get("risk", "")
        })

    recent_activity = []

    for report in reports[:5]:
        recent_activity.append({
            "title": f"Prediction Generated - {report.get('prediction','')}",
            "time": report.get("date", "")
        })

    return {
        "health_score": health_score,

        "trend": 0,

        "profile_completion": 85,

        "completion_items": [
            "Personal Information",
            "Medical Information",
            "Emergency Contact"
        ],

        "stats": {
            "symptoms": report_count,
            "reports": report_count
        },

        "analytics": {
            "labels": [
                f"Report {i+1}" for i in range(report_count)
            ],
            "values": analytics_values,
            "distribution": [
                healthy,
                risk,
                critical,
                monitoring
            ]
        },

        "recent_reports": recent_reports,

        "recent_activity": recent_activity,

        "recommendations": [
            {
                "title": "Stay Hydrated",
                "body": "Drink at least 2-3 liters of water daily.",
                "tone": "brand"
            },
            {
                "title": "Exercise Daily",
                "body": "Walk 30 minutes every day.",
                "tone": "emerald"
            },
            {
                "title": "Sleep Well",
                "body": "Sleep at least 7-8 hours.",
                "tone": "amber"
            }
        ]
    }