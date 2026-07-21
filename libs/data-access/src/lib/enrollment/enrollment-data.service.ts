import { inject, Injectable } from '@angular/core';

import {
  DbEnrollmentRow,
  DbPaymentMethod,
  DbPaymentRequestRow,
} from '../database/database-row.types';
import { SupabaseClientService } from '../supabase/supabase-client.service';

export interface CreateEnrollmentWithPaymentInput {
  studentId: string;
  courseId?: string;
  packageId?: string;
  batchId?: string;
  paymentMethod: DbPaymentMethod;
  amount: number;
  senderNumber: string;
  transactionId: string;
  proofPath?: string;
  note?: string;
}

export interface CreateEnrollmentWithPaymentResult {
  enrollment: DbEnrollmentRow;
  paymentRequest: DbPaymentRequestRow;
}

@Injectable({
  providedIn: 'root',
})
export class EnrollmentDataService {
  private readonly supabase = inject(SupabaseClientService);

  isConfigured(): boolean {
    return this.supabase.isConfigured();
  }

  async createEnrollmentWithPayment(
    input: CreateEnrollmentWithPaymentInput
  ): Promise<CreateEnrollmentWithPaymentResult> {
    if (!input.courseId && !input.packageId) {
      throw new Error('A course or package must be selected before enrollment.');
    }

    if (input.amount < 0) {
      throw new Error('Payment amount cannot be negative.');
    }

    const { data: enrollmentData, error: enrollmentError } = await this.supabase.client
      .from('enrollments')
      .insert({
        student_id: input.studentId,
        course_id: input.courseId ?? null,
        package_id: input.packageId ?? null,
        batch_id: input.batchId ?? null,
        status: 'pending',
      })
      .select('*')
      .single();

    if (enrollmentError) {
      throw new Error(`Failed to create enrollment: ${enrollmentError.message}`);
    }

    const enrollment = enrollmentData as DbEnrollmentRow;

    const { data: paymentData, error: paymentError } = await this.supabase.client
      .from('payment_requests')
      .insert({
        enrollment_id: enrollment.id,
        student_id: input.studentId,
        method: input.paymentMethod,
        amount: input.amount,
        currency: 'BDT',
        sender_number: input.senderNumber,
        transaction_id: input.transactionId,
        proof_path: input.proofPath ?? null,
        note: input.note ?? null,
        status: 'pending',
      })
      .select('*')
      .single();

    if (paymentError) {
      throw new Error(`Failed to create payment request: ${paymentError.message}`);
    }

    return {
      enrollment,
      paymentRequest: paymentData as DbPaymentRequestRow,
    };
  }

  async listMyEnrollments(studentId: string): Promise<DbEnrollmentRow[]> {
    const { data, error } = await this.supabase.client
      .from('enrollments')
      .select('*')
      .eq('student_id', studentId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to load enrollments: ${error.message}`);
    }

    return (data ?? []) as DbEnrollmentRow[];
  }

  async listMyPaymentRequests(studentId: string): Promise<DbPaymentRequestRow[]> {
    const { data, error } = await this.supabase.client
      .from('payment_requests')
      .select('*')
      .eq('student_id', studentId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to load payment requests: ${error.message}`);
    }

    return (data ?? []) as DbPaymentRequestRow[];
  }
}
