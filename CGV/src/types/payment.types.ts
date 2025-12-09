// Payment Types - Mapping to PaymentService

import { BaseEntity } from "./common.types";

export interface Payment extends BaseEntity {
  bookingId: string;
  userId: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  transactionId?: string;
  gatewayResponse?: Record<string, any>;
}

export enum PaymentMethod {
  Cash = "cash",
  CreditCard = "credit_card",
  DebitCard = "debit_card",
  Momo = "momo",
  ZaloPay = "zalopay",
  VNPay = "vnpay",
  Banking = "banking",
}

export enum PaymentStatus {
  Pending = "pending",
  Processing = "processing",
  Success = "success",
  Failed = "failed",
  Refunded = "refunded",
}

export interface CreatePaymentRequest {
  bookingId: string;
  method: PaymentMethod;
  returnUrl?: string;
}

export interface PaymentResponse {
  paymentId: string;
  status: PaymentStatus;
  paymentUrl?: string; // For redirect to payment gateway
  qrCode?: string; // For QR payment methods
  transactionId?: string;
}

export interface PaymentCallback {
  paymentId: string;
  status: PaymentStatus;
  transactionId: string;
  message?: string;
}
