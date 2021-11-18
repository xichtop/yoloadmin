import axiosClient from "./axiosClient";

const orderApi = {

  getAll: (token) => {
    const url = `/order/getall/`;
    return axiosClient.get(url, {headers: {
      "Content-type": "Application/json",
      "Authorization": `Bearer ${token}`
      }   
  });
  },

  getItem: (orderid, token) => {
    const url = `/order/getitem/${orderid}`;
    return axiosClient.get(url, {headers: {
      "Content-type": "Application/json",
      "Authorization": `Bearer ${token}`
      }   
  });
  },

  getAllByStatus: (email, status, token) => {
    const url = `/order/all/${email}/${status}`;
    return axiosClient.get(url, {headers: {
      "Content-type": "Application/json",
      "Authorization": `Bearer ${token}`
      }   
  });
  },

  update: (orderid, employeeId, token) => {
    const url = `/order/update/admin/${orderid}/${employeeId}`;
    return axiosClient.get(url, {headers: {
      "Content-type": "Application/json",
      "Authorization": `Bearer ${token}`
      }   
  });
  },

  deliver: (orderid, employeeId, token) => {
    const url = `/order/deliver/admin/${orderid}/${employeeId}`;
    return axiosClient.get(url, {headers: {
      "Content-type": "Application/json",
      "Authorization": `Bearer ${token}`
      }   
  });
  },

  confirm: (orderid, employeeId, token) => {
    const url = `/order/confirm/${orderid}/${employeeId}`;
    return axiosClient.get(url, {headers: {
      "Content-type": "Application/json",
      "Authorization": `Bearer ${token}`
      }   
  });
  },

  getStatisticByMonthAndYear: (month, year, token) => {
    const url = `/order/statistic/${month}/${year}`;
    return axiosClient.get(url, {headers: {
      "Content-type": "Application/json",
      "Authorization": `Bearer ${token}`
      }   
  });
  },

  getStatisticByYear: (year, token) => {
    const url = `/order/statistic/${year}`;
    return axiosClient.get(url, {headers: {
      "Content-type": "Application/json",
      "Authorization": `Bearer ${token}`
      }   
  });
  }

}

export default orderApi;