import axiosClient from "./axiosClient";

const orderApi = {

  getAll: () => {
    const url = `/order/getall/`;
    return axiosClient.get(url);
  },

  getItem: (orderid) => {
    const url = `/order/getitem/${orderid}`;
    return axiosClient.get(url);
  },

  getAllByStatus: (email, status) => {
    const url = `/order/all/${email}/${status}`;
    return axiosClient.get(url);
  },

  update: (orderid) => {
    const url = `/order/update/${orderid}`;
    return axiosClient.get(url);
  },

  confirm: (orderid) => {
    const url = `/order/confirm/${orderid}`;
    return axiosClient.get(url);
  },

  getStatisticByMonthAndYear: (month, year) => {
    const url = `/order/statistic/${month}/${year}`;
    return axiosClient.get(url);
  },

  getStatisticByYear: (year) => {
    const url = `/order/statistic/${year}`;
    return axiosClient.get(url);
  }

}

export default orderApi;