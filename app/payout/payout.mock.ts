export const getAllPayoutResponseMock: any = {
  status: "success",
  message: "Payout retrieved successfully",
  data: {
    payouts: [
      {
        payment_date: "30 Jul 2023, 3:29 pm",
        payment_status: "unpaid",
        commission: "25000.00",
        order_number: "F1234567",
      },
      {
        payment_date: "30 Jul 2023, 3:29 pm",
        payment_status: "unpaid",
        commission: "20000.12",
        order_number: "F1234567",
      },
    ],
    count: 2,
    current_page: 1,
    pages: 1,
  },
};

export const newPayOut = {
  order_id: 1,
  affiliate_id: 1,
};

export const createPayoutResponseMock = {
  status: "success",
  message: "Payout created successfully",
  data: null,
};
