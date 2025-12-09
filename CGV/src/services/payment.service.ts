// Payment Service - Handles payment processing

import { apiClient, API_ENDPOINTS, USE_MOCK_DATA } from "./api/client";
import {
  CreatePaymentRequest,
  PaymentResponse,
  Payment,
  PaymentStatus,
} from "@/types/payment.types";
import { ApiResponse } from "@/types/common.types";

class PaymentService {
  async createPayment(data: CreatePaymentRequest): Promise<ApiResponse<PaymentResponse>> {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 600));

      // Simulate different payment methods
      const paymentResponse: PaymentResponse = {
        paymentId: `payment-${Date.now()}`,
        status: PaymentStatus.Pending,
        transactionId: `TXN-${Date.now()}`,
      };

      // For online payment methods, provide payment URL
      if (["momo", "zalopay", "vnpay"].includes(data.method)) {
        paymentResponse.paymentUrl = `https://payment-gateway.example.com/pay/${paymentResponse.paymentId}`;
      }

      // For QR payment
      if (data.method === "banking") {
        paymentResponse.qrCode = `QR-PAYMENT-${paymentResponse.paymentId}`;
      }

      return {
        success: true,
        datas: paymentResponse,
        message: "Đã tạo thanh toán",
      };
    }

    const response = await apiClient.post<ApiResponse<PaymentResponse>>(
      API_ENDPOINTS.PAYMENT.CREATE,
      data
    );
    return response.data;
  }

  async getPaymentDetail(id: string): Promise<ApiResponse<Payment>> {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));

      const mockPayment: Payment = {
        id,
        bookingId: "booking-001",
        userId: "user-001",
        amount: 240000,
        method: "momo" as any,
        status: PaymentStatus.Success,
        transactionId: `TXN-${id}`,
        gatewayResponse: {
          message: "Thanh toán thành công",
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      return {
        success: true,
        datas: mockPayment,
      };
    }

    const response = await apiClient.get<ApiResponse<Payment>>(
      API_ENDPOINTS.PAYMENT.DETAIL(id)
    );
    return response.data;
  }

  async verifyPayment(paymentId: string): Promise<ApiResponse<PaymentStatus>> {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Simulate successful payment verification
      return {
        success: true,
        datas: PaymentStatus.Success,
        message: "Thanh toán thành công",
      };
    }

    const response = await apiClient.get<ApiResponse<PaymentStatus>>(
      `/payments/${paymentId}/verify`
    );
    return response.data;
  }
}

export const paymentService = new PaymentService();
