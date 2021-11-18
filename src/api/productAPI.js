import axiosClient from "./axiosClient";

const productApi = {

  get: (id) => {
    const url = `/products/${id}`;
    return axiosClient.get(url);
  },
  
  //Admin

  update: (product, token) => {
    const url = `/products/update`;
    return axiosClient.post(url, product, {headers: {
      "Content-type": "Application/json",
      "Authorization": `Bearer ${token}`
      }   
  });
  },

  updateStatus: (product, token) => {
    const url = `/products/updatestatus`;
    return axiosClient.post(url, product, {headers: {
      "Content-type": "Application/json",
      "Authorization": `Bearer ${token}`
      }   
  });
  },

  updateQuantity: (product, token) => {
    const url = `/products/updatequantity`;
    return axiosClient.post(url, product, {headers: {
      "Content-type": "Application/json",
      "Authorization": `Bearer ${token}`
      }   
  });
  },

  getAllAdmin: (token) => {
    const url = '/products/getall';
    return axiosClient.get(url, {headers: {
      "Content-type": "Application/json",
      "Authorization": `Bearer ${token}`
      }   
  });
  },

  addItem: (product, token) => {
    const url = '/products/additem';
    return axiosClient.post(url, product, {headers: {
      "Content-type": "Application/json",
      "Authorization": `Bearer ${token}`
      }   
  });
  },
}

export default productApi;