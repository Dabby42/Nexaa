export const createCategoryResponseData: any = {
  status: "success",
  message: "Category created successfully",
  data: null,
};

export const createCategoryData: any = {
  category_name: "Phone and accessories",
  commission: 10,
};

export const updateCategoryStatusData: any = {
  status: 2,
};

export const getActiveCategoryResponseMock: any = {
  status: "success",
  message: "Categories retrieved successfully",
  data: {
    categories: [
      {
        id: 1,
        category_name: "string",
        status: 1,
        commission: 10,
        created_at: "2023-02-21T21:53:43.371Z",
        updated_at: "2023-02-21T21:53:43.371Z",
      },
    ],
  },
};
