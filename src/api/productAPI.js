import axiosClient from "./axiosClient";

const productApi = {

  getAll: () => {
    const url = '/products';
    return axiosClient.get(url);
  },

  get: (id) => {

    const url = `/products/${id}`;
    return axiosClient.get(url);
  },

  //Admin
  updateStatus: (product) => {
    const url = `/products/updatestatus`;
    return axiosClient.post(url, product);
  },

  getAllAdmin: () => {
    const url = '/products/getall';
    return axiosClient.get(url);
  },

  addItem: (product) => {
    const url = '/products/additem';
    return axiosClient.post(url, product);
  },
}

export default productApi;