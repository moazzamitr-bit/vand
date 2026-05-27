export type ReviewStatus = 'pending_review' | 'approved' | 'rejected';
export type PaymentStatus = 'pending' | 'completed' | 'canceled' | 'failed';
export type CompetitionStatus = 'draft' | 'active' | 'judging' | 'archived';
export type PublicationStatus = 'published' | 'unpublished';
export type PaymentType = 'membership' | 'award';
export type CodeType = 'fixed' | 'percentage';
export type CodeScope = 'membership' | 'award' | 'all';
export type UserRole = 'admin' | 'finance' | 'competition_manager' | 'viewer' | 'member';

export interface Category {
  id: string;
  title: string;
  single_art: boolean;
  attachments_min: number;
  attachments_max: number;
  use_count: number;
  last_updated: string;
}

export interface Competition {
  id: string;
  title: string;
  status: CompetitionStatus;
  publication_status: PublicationStatus;
  category: string;
  start_date: string;
  end_date: string;
  judging_end_date: string;
  judges_type: string;
  price: number;
  attachments_count: number;
  description: string;
  cover_image?: string;
  submissions_count: number;
  judges_count: number;
  last_updated: string;
}

export interface InvitationCode {
  id: string;
  code: string;
  type: CodeType;
  value: number;
  active_status: boolean;
  use_count: number;
  max_uses: number | null;
  expires_at: string | null;
  scope: CodeScope;
  campaign_name: string;
  last_updated: string;
}

export interface OfficialMember {
  id: string;
  request_date: string;
  certificate_code: string;
  name: string;
  email: string;
  design_field: string;
  position: string;
  review_status: ReviewStatus;
  payment_status: PaymentStatus;
  reviewed_by: string | null;
  reviewed_at: string | null;
  reject_reason?: string;
  country: string;
  portfolio_url?: string;
  phone?: string;
}

export interface Payment {
  id: string;
  email: string;
  reference_code: string;
  type: PaymentType;
  amount: number;
  discount: number;
  tax: number;
  total: number;
  status: 'pending' | 'successful' | 'canceled' | 'failed';
  last_update: string;
  user_name?: string;
}

export interface User {
  id: string;
  avatar?: string;
  email: string;
  name: string;
  roles: UserRole[];
  register_date: string;
  last_activity: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  target: string;
  details: string;
}

export interface DashboardMetrics {
  visitors: number;
  earnings_eur: number;
  certificates: number;
  messages: number;
  official_members_total: number;
  payments_total: number;
  users_total: number;
  pending_reviews: number;
  pending_payments: number;
  active_competitions: number;
}
