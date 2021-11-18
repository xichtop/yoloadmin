import axiosClient from "./axiosClient";

const discountApi = {
  getAll: (token) => {
    const url = '/discount/all';
    return axiosClient.get(url, {headers: {
      "Content-type": "Application/json",
      "Authorization": `Bearer ${token}`
      }   
  });
  },
  addItem: (discount, token) => {
    const url = `/discount/add`;
    return axiosClient.post(url, discount, {headers: {
      "Content-type": "Application/json",
      "Authorization": `Bearer ${token}`
      }   
  });
  },

  update: (discount, token) => {
    const url = `/discount/update`;
    return axiosClient.post(url, discount, {headers: {
      "Content-type": "Application/json",
      "Authorization": `Bearer ${token}`
      }   
  });
  },

  get: (id, token) => {
    const url = `/discount/${id}`;
    return axiosClient.get(url, {headers: {
      "Content-type": "Application/json",
      "Authorization": `Bearer ${token}`
      }   
  });
  },

  
}

export default discountApi;