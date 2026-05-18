import { UserRole } from "@/context/AuthContext"

export interface BypassUser {
  username?: string;
  role?: string | UserRole;
  planTier?: string;
  companyId?: string;
}

/**
 * Determines whether the given user has access to bypass training and simulator progression locks.
 * Allowing admins, managers, and demo accounts to see and test everything.
 */
export function canBypassTrainingLocks(user: BypassUser | null | undefined): boolean {
  if (!user) return false;
  
  const role = user.role;
  const username = user.username;

  // Strict check for approved bypass roles or explicit demo admin username
  return (
    role === "admin" ||
    role === "manager" ||
    role === "demo_admin" ||
    username === "demo_admin"
  );
}
