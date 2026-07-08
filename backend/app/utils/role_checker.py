from fastapi import Depends, HTTPException

from app.utils.auth_handler import verify_token


def require_role(required_role: str):

    def role_checker(user=Depends(verify_token)):

        if user["role"] != required_role:
            raise HTTPException(
                status_code=403,
                detail="Access denied"
            )

        return user

    return role_checker