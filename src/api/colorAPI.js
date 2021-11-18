import axiosClient from "./axiosClient";

const colorApi = {

  update: (item, token) => {
    const url = '/productvariants/update';
    return axiosClient.post(url, item, {headers: {
      "Content-type": "Application/json",
      "Authorization": `Bearer ${token}`
      }   
  });
  },

  checkColor: (item, token) => {
    const url = '/productvariants/checkcolor';
    return axiosClient.post(url, item, {headers: {
      "Content-type": "Application/json",
      "Authorization": `Bearer ${token}`
      }   
  });
  }
}

export default colorApi;