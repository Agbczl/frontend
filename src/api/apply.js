import request from "./request";

export const getMyApplyListApi = (params) => {
  return request({
    url: "/stus",
    method: "get",
    params: {
      category: params?.category,
      title: params?.title,
    },
  });
};
