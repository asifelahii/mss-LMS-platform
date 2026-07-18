export type EnrollmentStatus =
  | 'pending'
  | 'active'
  | 'expired'
  | 'revoked'
  | 'rejected';

export interface Enrollment {
  id: string;
  studentId: string;
  courseId: string;
  batchId?: string | null;
  paymentRequestId?: string | null;
  status: EnrollmentStatus;
  startsAt?: string | null;
  expiresAt?: string | null;
  approvedBy?: string | null;
  createdAt: string;
  updatedAt: string;
}
