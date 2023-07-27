export const affiliateSalesAmountDataResponse: any = {
  status: "success",
  message: "Affiliate sales data success.",
  data: {
    total: "66000.00",
    pending: "66000.00",
    declined: "0.00",
    approved: "0.00",
  },
};

export const averageCommissionsRawManyMockData: any = [
  { status: "pending", total_commission: "38.80", order_count: "2" },
  { status: "approved", total_commission: "52.99", order_count: "1" },
];
export const affiliateCommissionsDataResponse: any = {
  status: "success",
  message: "Affiliate commissions data success.",
  data: {
    total: "66000.00",
    pending: "66000.00",
    declined: "0.00",
    approved_paid: "0.00",
    approved_unpaid: "0.00",
  },
};

export const affiliateAverageCommissionsDataResponse: any = {
  status: "success",
  message: "Affiliate average commissions data success.",
  data: {
    pending: 19.4,
    approved: 52.99,
    declined: 0,
    total: 72.39,
  },
};
