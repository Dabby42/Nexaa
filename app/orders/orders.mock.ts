export const getAllOrdersResponseMock: any = {
  status: "success",
  message: "Orders retrieved successfully",
  data: {
    orders: [
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
    current_page: 1,
    pages: 1,
  },
};

export const createOrdersMock = {
  status: "success",
  message: "Order created successfully",
  data: null,
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
