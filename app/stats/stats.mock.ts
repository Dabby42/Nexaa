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

export const affiliateClicksRawOnceMockResponse: any = {
  totalClicks: "0",
  uniqueClicks: "0",
};

export const affiliateClicksSalesAndCommissionsDataResponse: any = {
  status: "success",
  message: "Affiliate total clicks, sales, and commissions retrieved successfully.",
  data: {
    sales: {
      pending: 0,
      declined: 0,
      approved: 0,
    },
    clicks: {
      total: "0",
      repeated: "0",
      unique: "0",
    },
    commissions: {
      pending: "66000.00",
      declined: "0.00",
      approved_paid: "0.00",
      approved_unpaid: "0.00",
    },
  },
};

export const affiliateApprovedCommissionDataResponse: any = {
  status: "success",
  message: "Affiliate approved commissions retrieved successfully",
  data: {
    Nov: "0.00",
    Dec: "0.00",
    Jan: "0.00",
    Feb: "0.00",
    Mar: "0.00",
    Apr: "0.00",
    May: "0.00",
    Jun: "0.00",
    Jul: "0.00",
  },
};

export const campaignClicksCountResponse: any = {
  status: "success",
  message: "Campaigns clicks count fetched.",
  data: {
    clicksCount: "1344",
    uniqueClicksCount: "60",
    repeatedClicksCount: "1284",
  },
};
