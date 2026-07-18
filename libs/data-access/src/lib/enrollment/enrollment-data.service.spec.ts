import { TestBed } from '@angular/core/testing';

import { SupabaseClientService } from '../supabase/supabase-client.service';
import { EnrollmentDataService } from './enrollment-data.service';

describe('EnrollmentDataService', () => {
  afterEach(() => {
    TestBed.resetTestingModule();
  });

  function setupCreateFlow(options?: {
    enrollmentError?: { message: string } | null;
    paymentError?: { message: string } | null;
  }) {
    const enrollmentRow = {
      id: 'enrollment-1',
      student_id: 'student-1',
      course_id: 'course-1',
      package_id: null,
      batch_id: null,
      status: 'pending',
      starts_at: null,
      expires_at: null,
      approved_by: null,
      approved_at: null,
      rejected_reason: null,
      created_at: '2026-07-18T00:00:00Z',
      updated_at: '2026-07-18T00:00:00Z',
    };

    const paymentRow = {
      id: 'payment-1',
      enrollment_id: 'enrollment-1',
      student_id: 'student-1',
      method: 'bkash',
      amount: 1200,
      currency: 'BDT',
      sender_number: '01700000000',
      transaction_id: 'TXN123',
      proof_path: null,
      note: null,
      status: 'pending',
      reviewed_by: null,
      reviewed_at: null,
      rejection_reason: null,
      created_at: '2026-07-18T00:00:00Z',
      updated_at: '2026-07-18T00:00:00Z',
    };

    const enrollmentSingle = jest.fn().mockResolvedValue({
      data: options?.enrollmentError ? null : enrollmentRow,
      error: options?.enrollmentError ?? null,
    });

    const paymentSingle = jest.fn().mockResolvedValue({
      data: options?.paymentError ? null : paymentRow,
      error: options?.paymentError ?? null,
    });

    const enrollmentSelect = jest.fn(() => ({ single: enrollmentSingle }));
    const paymentSelect = jest.fn(() => ({ single: paymentSingle }));

    const enrollmentInsert = jest.fn(() => ({ select: enrollmentSelect }));
    const paymentInsert = jest.fn(() => ({ select: paymentSelect }));

    const from = jest.fn((tableName: string) => {
      if (tableName === 'enrollments') {
        return { insert: enrollmentInsert };
      }

      if (tableName === 'payment_requests') {
        return { insert: paymentInsert };
      }

      throw new Error(`Unexpected table: ${tableName}`);
    });

    TestBed.configureTestingModule({
      providers: [
        EnrollmentDataService,
        {
          provide: SupabaseClientService,
          useValue: {
            client: {
              from,
            },
          },
        },
      ],
    });

    return {
      service: TestBed.inject(EnrollmentDataService),
      enrollmentInsert,
      paymentInsert,
    };
  }

  function setupListFlow(data: unknown[], error: { message: string } | null = null) {
    const order = jest.fn().mockResolvedValue({ data, error });
    const eq = jest.fn(() => ({ order }));
    const select = jest.fn(() => ({ eq }));
    const from = jest.fn(() => ({ select }));

    TestBed.configureTestingModule({
      providers: [
        EnrollmentDataService,
        {
          provide: SupabaseClientService,
          useValue: {
            client: {
              from,
            },
          },
        },
      ],
    });

    return {
      service: TestBed.inject(EnrollmentDataService),
      from,
      eq,
    };
  }

  it('creates a pending enrollment and matching payment request', async () => {
    const { service, enrollmentInsert, paymentInsert } = setupCreateFlow();

    const result = await service.createEnrollmentWithPayment({
      studentId: 'student-1',
      courseId: 'course-1',
      paymentMethod: 'bkash',
      amount: 1200,
      senderNumber: '01700000000',
      transactionId: 'TXN123',
    });

    expect(enrollmentInsert).toHaveBeenCalled();
    expect(paymentInsert).toHaveBeenCalled();
    expect(result.enrollment.id).toBe('enrollment-1');
    expect(result.paymentRequest.id).toBe('payment-1');
  });

  it('requires either a course or package before enrollment', async () => {
    const { service } = setupCreateFlow();

    await expect(
      service.createEnrollmentWithPayment({
        studentId: 'student-1',
        paymentMethod: 'bkash',
        amount: 1200,
        senderNumber: '01700000000',
        transactionId: 'TXN123',
      })
    ).rejects.toThrow('A course or package must be selected before enrollment.');
  });

  it('rejects negative payment amounts', async () => {
    const { service } = setupCreateFlow();

    await expect(
      service.createEnrollmentWithPayment({
        studentId: 'student-1',
        courseId: 'course-1',
        paymentMethod: 'bkash',
        amount: -1,
        senderNumber: '01700000000',
        transactionId: 'TXN123',
      })
    ).rejects.toThrow('Payment amount cannot be negative.');
  });

  it('throws readable enrollment errors', async () => {
    const { service } = setupCreateFlow({
      enrollmentError: { message: 'RLS blocked enrollment' },
    });

    await expect(
      service.createEnrollmentWithPayment({
        studentId: 'student-1',
        courseId: 'course-1',
        paymentMethod: 'bkash',
        amount: 1200,
        senderNumber: '01700000000',
        transactionId: 'TXN123',
      })
    ).rejects.toThrow('Failed to create enrollment: RLS blocked enrollment');
  });

  it('throws readable payment errors', async () => {
    const { service } = setupCreateFlow({
      paymentError: { message: 'duplicate transaction id' },
    });

    await expect(
      service.createEnrollmentWithPayment({
        studentId: 'student-1',
        courseId: 'course-1',
        paymentMethod: 'bkash',
        amount: 1200,
        senderNumber: '01700000000',
        transactionId: 'TXN123',
      })
    ).rejects.toThrow('Failed to create payment request: duplicate transaction id');
  });

  it('lists student enrollments', async () => {
    const { service, from, eq } = setupListFlow([
      {
        id: 'enrollment-1',
        student_id: 'student-1',
      },
    ]);

    const result = await service.listMyEnrollments('student-1');

    expect(from).toHaveBeenCalledWith('enrollments');
    expect(eq).toHaveBeenCalledWith('student_id', 'student-1');
    expect(result).toHaveLength(1);
  });

  it('lists student payment requests', async () => {
    const { service, from, eq } = setupListFlow([
      {
        id: 'payment-1',
        student_id: 'student-1',
      },
    ]);

    const result = await service.listMyPaymentRequests('student-1');

    expect(from).toHaveBeenCalledWith('payment_requests');
    expect(eq).toHaveBeenCalledWith('student_id', 'student-1');
    expect(result).toHaveLength(1);
  });
});
