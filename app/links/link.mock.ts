export const createCustomUrlData: any = {
  redirect_url: "https://www.konga.com?user_id=1",
};

export const generateCustomUrlResponseData: any = {
  status: "success",
  message: "Custom link generated successfully",
  data: {
    custom_url: "http://0.0.0.0:12345/d8f95a6c-1c7a-4e37-8e3d-2b3e7e59455d",
  },
};

export const recordClickResponseData: any = {
  status: "success",
  message: "Click recorded successfully",
  data: null,
};

export const userRequestMock: any = {
  headers: {
    "X-Forwarded-For": "123.45.67.89",
  },
  socket: {
    remoteAddress: "123.45.67.89",
  },
  user: {
    id: 1,
  },
};

export const getClickByDaysData: any = {
  daysAgo: 3,
};

export const recordClicksData: any = {
  k_id: "d8f95a6c-1c7a-4e37-8e3d-2b3e7e59455d",
};

export const getLinkResponseMock: any = {
  status: "success",
  message: "Link retrieved successfully",
  data: {
    id: 1,
    user_id: 1,
    redirect_url: "https://www.konga.com?user_id=1",
    k_id: 10,
    created_at: "2023-02-21T21:53:43.371Z",
    updated_at: "2023-02-21T21:53:43.371Z",
  },
};

export const getIpResponseMock: any = {
  status: "success",
  message: "Ip retrieved successfully",
  data: {
    id: 1,
    link_id: 4,
    ip_address: "123.45.67.89",
    created_at: "2023-02-21T21:53:43.371Z",
    updated_at: "2023-02-21T21:53:43.371Z",
  },
};

export const getClickResponseMock: any = {
  status: "success",
  message: "Click retrieved successfully",
  data: {
    Clicks: [
      {
        id: 1,
        link_id: 4,
        unique_count: 1,
        count: 2,
        ip_id: 1,
        //created_at: "2023-02-21T21:53:43.371Z",
        updated_at: new Date(),
        created_at: {
          getFullYear(): number {
            return new Date().getFullYear();
          },
          getMonth(): number {
            return new Date().getMonth();
          },
          getDate(): number {
            return new Date().getDate();
          },
        },
      },
    ],
  },
};

export const getAllCampaignsResponseDataMock = {
  status: "success",
  message: "Campaigns retrieved successfully",
  data: [
    {
      date_created: "30 Mar 2023, 10:07 am",
      campaign_name: "Electronics",
      campaign_status: "disabled",
    },
    {
      date_created: "3 Apr 2023, 11:58 am",
      campaign_name: "Soap",
      campaign_status: "disabled",
    },
    {
      date_created: "30 Mar 2023, 10:07 am",
      campaign_name: "Electronics",
      campaign_status: "disabled",
    },
  ],
};
