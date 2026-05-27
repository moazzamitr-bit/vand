import type {
  Category, Competition, InvitationCode, OfficialMember,
  Payment, User, AuditLog, DashboardMetrics,
} from '../types';

export const categories: Category[] = [
  { id: 'cat-1', title: 'Graphic Design', single_art: false, attachments_min: 1, attachments_max: 5, use_count: 12, last_updated: '2024-11-15' },
  { id: 'cat-2', title: 'Industrial Design', single_art: true, attachments_min: 3, attachments_max: 8, use_count: 7, last_updated: '2024-10-28' },
  { id: 'cat-3', title: 'Interior Design', single_art: false, attachments_min: 2, attachments_max: 6, use_count: 5, last_updated: '2024-09-12' },
  { id: 'cat-4', title: 'Fashion Design', single_art: true, attachments_min: 1, attachments_max: 4, use_count: 3, last_updated: '2024-08-01' },
  { id: 'cat-5', title: 'UX/UI Design', single_art: false, attachments_min: 2, attachments_max: 10, use_count: 0, last_updated: '2024-07-20' },
  { id: 'cat-6', title: 'Motion Graphics', single_art: false, attachments_min: 1, attachments_max: 3, use_count: 8, last_updated: '2024-11-03' },
  { id: 'cat-7', title: 'Architectural Design', single_art: true, attachments_min: 4, attachments_max: 12, use_count: 2, last_updated: '2024-06-30' },
  { id: 'cat-8', title: 'Packaging Design', single_art: false, attachments_min: 2, attachments_max: 6, use_count: 4, last_updated: '2024-10-11' },
];

export const competitions: Competition[] = [
  {
    id: 'comp-1', title: 'VAND Design Excellence Awards 2024', status: 'active', publication_status: 'published',
    category: 'Graphic Design', start_date: '2024-10-01', end_date: '2024-12-31', judging_end_date: '2025-01-31',
    judges_type: 'panel', price: 75, attachments_count: 3, description: 'Annual flagship design competition.',
    submissions_count: 142, judges_count: 8, last_updated: '2024-11-20',
  },
  {
    id: 'comp-2', title: 'Industrial Innovation Challenge', status: 'judging', publication_status: 'published',
    category: 'Industrial Design', start_date: '2024-08-01', end_date: '2024-10-31', judging_end_date: '2024-12-15',
    judges_type: 'expert', price: 60, attachments_count: 5, description: 'Innovation in product design.',
    submissions_count: 87, judges_count: 5, last_updated: '2024-11-01',
  },
  {
    id: 'comp-3', title: 'Interior Design Futures', status: 'draft', publication_status: 'unpublished',
    category: 'Interior Design', start_date: '2025-01-15', end_date: '2025-03-31', judging_end_date: '2025-04-30',
    judges_type: 'panel', price: 50, attachments_count: 4, description: 'Future of interior spaces.',
    submissions_count: 0, judges_count: 0, last_updated: '2024-11-18',
  },
  {
    id: 'comp-4', title: 'Fashion Forward 2023', status: 'archived', publication_status: 'unpublished',
    category: 'Fashion Design', start_date: '2023-09-01', end_date: '2023-11-30', judging_end_date: '2023-12-31',
    judges_type: 'community', price: 45, attachments_count: 3, description: 'Fashion design showcase.',
    submissions_count: 211, judges_count: 12, last_updated: '2024-01-10',
  },
  {
    id: 'comp-5', title: 'Motion + Brand Identity', status: 'active', publication_status: 'published',
    category: 'Motion Graphics', start_date: '2024-11-01', end_date: '2025-01-31', judging_end_date: '2025-02-28',
    judges_type: 'panel', price: 65, attachments_count: 2, description: 'Brand identity in motion.',
    submissions_count: 34, judges_count: 0, last_updated: '2024-11-15',
  },
  {
    id: 'comp-6', title: 'Packaging Redesign Sprint', status: 'active', publication_status: 'published',
    category: 'Packaging Design', start_date: '2024-11-10', end_date: '2024-12-20', judging_end_date: '2025-01-10',
    judges_type: 'expert', price: 40, attachments_count: 3, description: 'Sustainable packaging innovation.',
    submissions_count: 56, judges_count: 3, last_updated: '2024-11-19',
  },
];

export const invitationCodes: InvitationCode[] = [
  { id: 'ic-1', code: 'VAND2024', type: 'percentage', value: 20, active_status: true, use_count: 143, max_uses: 500, expires_at: '2024-12-31', scope: 'all', campaign_name: 'Annual Campaign', last_updated: '2024-11-01' },
  { id: 'ic-2', code: 'MEMBER100', type: 'percentage', value: 100, active_status: true, use_count: 12, max_uses: 20, expires_at: '2024-12-15', scope: 'membership', campaign_name: 'VIP Onboarding', last_updated: '2024-10-20' },
  { id: 'ic-3', code: 'AWARD50', type: 'fixed', value: 50, active_status: true, use_count: 8, max_uses: null, expires_at: null, scope: 'award', campaign_name: 'Partner Promo', last_updated: '2024-09-15' },
  { id: 'ic-4', code: 'LAUNCH30', type: 'percentage', value: 30, active_status: false, use_count: 200, max_uses: 200, expires_at: '2024-06-30', scope: 'all', campaign_name: 'Launch Campaign', last_updated: '2024-07-01' },
  { id: 'ic-5', code: 'EARLYBIRD', type: 'percentage', value: 15, active_status: true, use_count: 67, max_uses: 150, expires_at: '2025-01-31', scope: 'membership', campaign_name: 'Early Bird 2025', last_updated: '2024-11-10' },
  { id: 'ic-6', code: 'PARTNER20', type: 'fixed', value: 20, active_status: true, use_count: 34, max_uses: 100, expires_at: '2025-03-31', scope: 'award', campaign_name: 'Partner Network', last_updated: '2024-10-05' },
  { id: 'ic-7', code: 'FREE100', type: 'percentage', value: 100, active_status: false, use_count: 5, max_uses: 5, expires_at: '2024-08-01', scope: 'all', campaign_name: 'Test Campaign', last_updated: '2024-08-02' },
];

export const officialMembers: OfficialMember[] = [
  { id: 'om-1', request_date: '2024-11-20', certificate_code: 'VAND-2024-0001', name: 'Maria Santos', email: 'maria.santos@email.com', design_field: 'Graphic Design', position: 'Senior Designer', review_status: 'approved', payment_status: 'completed', reviewed_by: 'Admin', reviewed_at: '2024-11-21', country: 'Portugal', portfolio_url: 'https://example.com', phone: '+351911234567' },
  { id: 'om-2', request_date: '2024-11-19', certificate_code: 'VAND-2024-0002', name: 'João Ferreira', email: 'joao.f@design.pt', design_field: 'Industrial Design', position: 'Product Designer', review_status: 'pending_review', payment_status: 'pending', reviewed_by: null, reviewed_at: null, country: 'Portugal' },
  { id: 'om-3', request_date: '2024-11-18', certificate_code: 'VAND-2024-0003', name: 'Ana Costa', email: 'ana.costa@studio.com', design_field: 'Interior Design', position: 'Lead Architect', review_status: 'approved', payment_status: 'pending', reviewed_by: 'Admin', reviewed_at: '2024-11-19', country: 'Brazil' },
  { id: 'om-4', request_date: '2024-11-17', certificate_code: 'VAND-2024-0004', name: 'Carlos Lima', email: 'clima@freelance.com', design_field: 'UX/UI Design', position: 'UX Designer', review_status: 'rejected', payment_status: 'canceled', reviewed_by: 'Admin', reviewed_at: '2024-11-18', reject_reason: 'Portfolio does not meet quality standards.', country: 'Brazil' },
  { id: 'om-5', request_date: '2024-11-15', certificate_code: 'VAND-2024-0005', name: 'Sofia Andrade', email: 'sofia.a@brand.com', design_field: 'Graphic Design', position: 'Creative Director', review_status: 'pending_review', payment_status: 'pending', reviewed_by: null, reviewed_at: null, country: 'Spain' },
  { id: 'om-6', request_date: '2024-11-14', certificate_code: 'VAND-2024-0006', name: 'Lucas Martins', email: 'lucas@motion.io', design_field: 'Motion Graphics', position: 'Motion Designer', review_status: 'approved', payment_status: 'completed', reviewed_by: 'Finance', reviewed_at: '2024-11-15', country: 'Brazil' },
  { id: 'om-7', request_date: '2024-11-12', certificate_code: 'VAND-2024-0007', name: 'Elena Popescu', email: 'elena.p@design.ro', design_field: 'Fashion Design', position: 'Fashion Designer', review_status: 'pending_review', payment_status: 'pending', reviewed_by: null, reviewed_at: null, country: 'Romania' },
  { id: 'om-8', request_date: '2024-11-10', certificate_code: 'VAND-2024-0008', name: 'Mikhail Ivanov', email: 'mikhail@arch.ru', design_field: 'Architectural Design', position: 'Architect', review_status: 'approved', payment_status: 'failed', reviewed_by: 'Admin', reviewed_at: '2024-11-11', country: 'Russia' },
  { id: 'om-9', request_date: '2024-11-08', certificate_code: 'VAND-2024-0009', name: 'Amira Hassan', email: 'amira.h@creative.ae', design_field: 'Packaging Design', position: 'Packaging Designer', review_status: 'approved', payment_status: 'completed', reviewed_by: 'Admin', reviewed_at: '2024-11-09', country: 'UAE' },
  { id: 'om-10', request_date: '2024-11-05', certificate_code: 'VAND-2024-0010', name: 'David Kim', email: 'david.kim@studio.kr', design_field: 'UX/UI Design', position: 'Product Designer', review_status: 'pending_review', payment_status: 'pending', reviewed_by: null, reviewed_at: null, country: 'South Korea' },
  { id: 'om-11', request_date: '2024-11-03', certificate_code: 'VAND-2024-0011', name: 'Priya Sharma', email: 'priya.s@design.in', design_field: 'Graphic Design', position: 'Brand Designer', review_status: 'approved', payment_status: 'completed', reviewed_by: 'Admin', reviewed_at: '2024-11-04', country: 'India' },
  { id: 'om-12', request_date: '2024-10-28', certificate_code: 'VAND-2024-0012', name: 'Marco Rossi', email: 'marco.r@milano.it', design_field: 'Industrial Design', position: 'Industrial Designer', review_status: 'rejected', payment_status: 'canceled', reviewed_by: 'Admin', reviewed_at: '2024-10-30', reject_reason: 'Missing required portfolio pieces.', country: 'Italy' },
];

export const payments: Payment[] = [
  { id: 'pay-1', email: 'maria.santos@email.com', reference_code: 'REF-20241120-001', type: 'membership', amount: 150, discount: 0, tax: 12, total: 162, status: 'successful', last_update: '2024-11-21', user_name: 'Maria Santos' },
  { id: 'pay-2', email: 'lucas@motion.io', reference_code: 'REF-20241114-002', type: 'membership', amount: 150, discount: 30, tax: 9.6, total: 129.6, status: 'successful', last_update: '2024-11-15', user_name: 'Lucas Martins' },
  { id: 'pay-3', email: 'amira.h@creative.ae', reference_code: 'REF-20241108-003', type: 'membership', amount: 150, discount: 0, tax: 12, total: 162, status: 'successful', last_update: '2024-11-09', user_name: 'Amira Hassan' },
  { id: 'pay-4', email: 'priya.s@design.in', reference_code: 'REF-20241103-004', type: 'membership', amount: 150, discount: 22.5, tax: 10.2, total: 137.7, status: 'successful', last_update: '2024-11-04', user_name: 'Priya Sharma' },
  { id: 'pay-5', email: 'ana.costa@studio.com', reference_code: 'REF-20241118-005', type: 'membership', amount: 150, discount: 0, tax: 12, total: 162, status: 'pending', last_update: '2024-11-18', user_name: 'Ana Costa' },
  { id: 'pay-6', email: 'mikhail@arch.ru', reference_code: 'REF-20241110-006', type: 'membership', amount: 150, discount: 0, tax: 12, total: 162, status: 'failed', last_update: '2024-11-11', user_name: 'Mikhail Ivanov' },
  { id: 'pay-7', email: 'sofia.entry@awards.com', reference_code: 'REF-20241115-007', type: 'award', amount: 75, discount: 15, tax: 4.8, total: 64.8, status: 'successful', last_update: '2024-11-15' },
  { id: 'pay-8', email: 'david.kim@studio.kr', reference_code: 'REF-20241105-008', type: 'award', amount: 60, discount: 0, tax: 4.8, total: 64.8, status: 'canceled', last_update: '2024-11-06', user_name: 'David Kim' },
  { id: 'pay-9', email: 'j.designer@email.com', reference_code: 'REF-20241119-009', type: 'award', amount: 75, discount: 0, tax: 6, total: 81, status: 'successful', last_update: '2024-11-19' },
  { id: 'pay-10', email: 'carlos.entry@comp.com', reference_code: 'REF-20241117-010', type: 'award', amount: 40, discount: 0, tax: 3.2, total: 43.2, status: 'pending', last_update: '2024-11-17' },
];

export const users: User[] = [
  { id: 'usr-1', email: 'admin@vand.io', name: 'Admin User', roles: ['admin'], register_date: '2023-01-01', last_activity: '2024-11-21' },
  { id: 'usr-2', email: 'maria.santos@email.com', name: 'Maria Santos', roles: ['member'], register_date: '2024-11-20', last_activity: '2024-11-21' },
  { id: 'usr-3', email: 'joao.f@design.pt', name: 'João Ferreira', roles: ['member'], register_date: '2024-11-19', last_activity: '2024-11-19' },
  { id: 'usr-4', email: 'ana.costa@studio.com', name: 'Ana Costa', roles: ['member'], register_date: '2024-11-18', last_activity: '2024-11-20' },
  { id: 'usr-5', email: 'clima@freelance.com', name: 'Carlos Lima', roles: ['member'], register_date: '2024-11-17', last_activity: '2024-11-18' },
  { id: 'usr-6', email: 'sofia.a@brand.com', name: 'Sofia Andrade', roles: ['member'], register_date: '2024-11-15', last_activity: '2024-11-21' },
  { id: 'usr-7', email: 'lucas@motion.io', name: 'Lucas Martins', roles: ['member'], register_date: '2024-11-14', last_activity: '2024-11-15' },
  { id: 'usr-8', email: 'finance@vand.io', name: 'Finance Manager', roles: ['finance'], register_date: '2023-02-15', last_activity: '2024-11-21' },
  { id: 'usr-9', email: 'competitions@vand.io', name: 'Competition Manager', roles: ['competition_manager'], register_date: '2023-03-10', last_activity: '2024-11-20' },
  { id: 'usr-10', email: 'elena.p@design.ro', name: 'Elena Popescu', roles: ['member'], register_date: '2024-11-12', last_activity: '2024-11-13' },
  { id: 'usr-11', email: 'mikhail@arch.ru', name: 'Mikhail Ivanov', roles: ['member'], register_date: '2024-11-10', last_activity: '2024-11-11' },
  { id: 'usr-12', email: 'amira.h@creative.ae', name: 'Amira Hassan', roles: ['member'], register_date: '2024-11-08', last_activity: '2024-11-20' },
  { id: 'usr-13', email: 'david.kim@studio.kr', name: 'David Kim', roles: ['member'], register_date: '2024-11-05', last_activity: '2024-11-06' },
  { id: 'usr-14', email: 'priya.s@design.in', name: 'Priya Sharma', roles: ['member'], register_date: '2024-11-03', last_activity: '2024-11-19' },
  { id: 'usr-15', email: 'PRIYA.S@DESIGN.IN', name: 'Priya S (duplicate)', roles: ['member'], register_date: '2024-11-04', last_activity: '2024-11-04' },
  { id: 'usr-16', email: 'viewer@vand.io', name: 'Report Viewer', roles: ['viewer'], register_date: '2023-06-01', last_activity: '2024-11-15' },
];

export const auditLogs: AuditLog[] = [
  { id: 'al-1', timestamp: '2024-11-21T14:32:00', user: 'Admin', action: 'APPROVED', target: 'Member: Maria Santos', details: 'Membership application approved' },
  { id: 'al-2', timestamp: '2024-11-21T10:15:00', user: 'Admin', action: 'PAYMENT_CONFIRMED', target: 'REF-20241120-001', details: 'Payment marked as completed' },
  { id: 'al-3', timestamp: '2024-11-20T16:45:00', user: 'Admin', action: 'REJECTED', target: 'Member: Carlos Lima', details: 'Reason: Portfolio does not meet quality standards.' },
  { id: 'al-4', timestamp: '2024-11-20T09:00:00', user: 'Admin', action: 'CODE_DEACTIVATED', target: 'Code: LAUNCH30', details: 'Code reached maximum uses' },
  { id: 'al-5', timestamp: '2024-11-19T14:00:00', user: 'Finance', action: 'APPROVED', target: 'Member: Lucas Martins', details: 'Membership application approved' },
];

export const dashboardMetrics: DashboardMetrics = {
  visitors: 3811,
  earnings_eur: 190,
  certificates: 1,
  messages: 0,
  official_members_total: 599,
  payments_total: 1029,
  users_total: 906,
  pending_reviews: 5,
  pending_payments: 3,
  active_competitions: 3,
};

export const revenueByStream = [
  { month: 'Jun', membership: 2400, competitions: 1800, materials: 600 },
  { month: 'Jul', membership: 3200, competitions: 2100, materials: 750 },
  { month: 'Aug', membership: 2800, competitions: 2400, materials: 820 },
  { month: 'Sep', membership: 4100, competitions: 3200, materials: 900 },
  { month: 'Oct', membership: 3800, competitions: 2800, materials: 1100 },
  { month: 'Nov', membership: 4600, competitions: 3500, materials: 1250 },
];

export const monthlyProfit = [
  { month: 'Jun', profit: 3200 },
  { month: 'Jul', profit: 4100 },
  { month: 'Aug', profit: 3600 },
  { month: 'Sep', profit: 5800 },
  { month: 'Oct', profit: 5200 },
  { month: 'Nov', profit: 6800 },
];

export const topCountries = [
  { country: 'Brazil', users: 234, revenue: 18200 },
  { country: 'Portugal', users: 187, revenue: 14900 },
  { country: 'India', users: 156, revenue: 11400 },
  { country: 'Spain', users: 98, revenue: 7800 },
  { country: 'UAE', users: 76, revenue: 12300 },
  { country: 'South Korea', users: 64, revenue: 5100 },
  { country: 'Italy', users: 58, revenue: 4600 },
  { country: 'Romania', users: 43, revenue: 3400 },
];
