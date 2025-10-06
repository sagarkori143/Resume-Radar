export type ResumeStatus = "pending" | "approved" | "needs_revision" | "rejected"

export interface User {
  id: string
  email: string
  full_name: string | null
  is_admin: boolean
  created_at: string
  updated_at: string
}

export interface Resume {
  id: string
  user_id: string
  file_name: string
  file_url: string
  file_size: number
  status: ResumeStatus
  score: number | null
  reviewer_notes: string | null
  reviewed_by: string | null
  reviewed_at: string | null
  created_at: string
  updated_at: string
}

export interface ResumeWithUser extends Resume {
  user: Pick<User, "email" | "full_name">
}

export interface LeaderboardEntry {
  user_id: string
  email: string
  full_name: string | null
  score: number
  file_name: string
  reviewed_at: string
}

export type AdminRequestStatus = "pending" | "approved" | "rejected"

export interface AdminRequest {
  id: string
  user_id: string
  reason: string
  status: AdminRequestStatus
  reviewed_by: string | null
  reviewed_at: string | null
  admin_notes: string | null
  created_at: string
  updated_at: string
}

export interface AdminRequestWithUser extends AdminRequest {
  user: Pick<User, "email" | "full_name">
  reviewer?: Pick<User, "email" | "full_name">
}