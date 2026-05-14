from fastapi import Depends, HTTPException, status, Header
from fastapi.security import OAuth2PasswordBearer
from sqlmodel import Session, select
from typing import List, Optional
from uuid import UUID

from database import get_session
from models.user import User, Membership, UserRole
from auth_utils import decode_access_token

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

async def get_current_user(
    token: str = Depends(oauth2_scheme),
    session: Session = Depends(get_session)
) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    payload = decode_access_token(token)
    if payload is None:
        raise credentials_exception
    
    user_id: str = payload.get("sub")
    if user_id is None:
        raise credentials_exception
    
    user = session.get(User, UUID(user_id))
    if user is None:
        raise credentials_exception
    
    return user

async def get_current_membership(
    user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
) -> Membership:
    # For now, we assume a user has at least one membership
    # In a more complex system, we might take X-Company-ID header
    statement = select(Membership).where(Membership.user_id == user.id)
    membership = session.exec(statement).first()
    
    if not membership:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No active company membership found"
        )
    return membership

def require_role(allowed_roles: List[UserRole]):
    async def role_checker(membership: Membership = Depends(get_current_membership)):
        if membership.role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Insufficient permissions for this action"
            )
        return membership
    return role_checker

async def require_admin(user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    # Platform-wide admin check
    # We can check for a membership in a special 'admin' company or a specific flag on the User
    # For this architecture, we'll check if they have an ADMIN role in ANY membership
    statement = select(Membership).where(Membership.user_id == user.id).where(Membership.role == UserRole.ADMIN)
    admin_membership = session.exec(statement).first()
    
    if not admin_membership:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Platform Admin access required"
        )
    return admin_membership
