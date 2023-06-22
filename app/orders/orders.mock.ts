export const getAllOrdersResponseMock: any = {
  status: "success",
  message: "Orders retrieved successfully",
  data: {
    Orders: [
      {
        id: 1,
        link_id: 4,
        unique_count: 1,
        count: 2,
        ip_id: 1,
        updated_at: new Date(),
        created_at: new Date(),
      },
    ],
  },
};

export const createOrdersMock = {
  status: "success",
  message: "Order created successfully",
  data: null,
};

export const createOrderData = {
  affiliate_id: 1,
  product_id: 12345,
  order_id: "F1234567",
  status: "complete",
  category: "phones",
  return_id: "Z12345678",
  commission_payment_status: "1",
  commission: 20000.0,
  total_amount: 35000.0,
};

export const getOrderResponseMock = {
  status: "success",
  message: "Order retrieved successfully",
  data: {
    id: 1,
    affiliate_id: 2,
    product_id: 14567,
    order_id: "F1234567889",
    status: "complete",
    category: "Computers",
    total_amount: 120000,
    updated_at: new Date(),
    created_at: new Date(),
  },
};

export const getCommissionStatsMock = {
  data: {
    totalCommissions: "20000",
    totalSales: "2500.00",
    pendingCommissions: "1500",
    unpaidCommissions: "500",
  },
  message: "Commission statistics retrieved successfully",
  status: "success",
};

export const importReqFileMock = {
  _readableState: {
    buffer: [{}],
  },
};

export const importFileRespMock = {
  status: "success",
  message: "Paid commissions uploaded successfully",
  data: null,
};
