import axiosClient from "./axiosClient";

const categoryApi = {
  getAll: (params) => {
    const url = '/categories';
    return axiosClient.get(url, { params });
  },

  getProductId: (id) => {
    const url = `/categories/${id}`;
    return axiosClient.get(url);
  },

  getStatisticByMonthAndYear: (month, year, token) => {
    const url = `/categories/statistic/${month}/${year}`;
    return axiosClient.get(url, {headers: {
      "Content-type": "Application/json",
      "Authorization": `Bearer ${token}`
      }   
  });
  },

  getStatisticByYear: (year, token) => {
    const url = `/categories/statistic/${year}`;
    return axiosClient.get(url, {headers: {
      "Content-type": "Application/json",
      "Authorization": `Bearer ${token}`
      }   
  });
  }
}

export default categoryApi;