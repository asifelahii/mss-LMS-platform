export type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed';
export type TicketCategory = 'payment' | 'access' | 'device' | 'lesson' | 'material' | 'other';

export interface SupportTicket {
  id: string;
  studentId: string;
  category: TicketCategory;
  subject: string;
  message: string;
  status: TicketStatus;
  assignedTo?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AuditLog {
  id: string;
  actorId: string;
  action: string;
  entityType: string;
  entityId: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}
