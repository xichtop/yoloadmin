import axiosClient from "./axiosClient";

const categoryApi = {
  getAll: (params) => {
    const url = '/categories';
    return axiosClient.get(url, { params });
  },

  getProductId: (id) => {
    const url = `/categories/${id}`;
    return axiosClient.get(url);
  }
}

export default categoryApi;