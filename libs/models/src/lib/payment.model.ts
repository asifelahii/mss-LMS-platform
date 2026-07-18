export type PaymentMethod = 'bkash' | 'nagad' | 'rocket' | 'bank_transfer';
export type PaymentStatus = 'pending' | 'approved' | 'rejected';

export interface PaymentRequest {
  id: string;
  studentId: string;
  courseId: string;
  batchId?: string | null;
  method: PaymentMethod;
  senderNumber: string;
  transactionId: string;
  amount: number;
  proofUrl?: string | null;
  status: PaymentStatus;
  rejectionReason?: string | null;
  reviewedBy?: string | null;
  reviewedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}
