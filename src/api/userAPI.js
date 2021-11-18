import axiosClient from "./axiosClient";

const userAPI = {
  getAll: (token) => {
    const url = '/user/getall';
    return axiosClient.get(url, {headers: {
      "Content-type": "Application/json",
      "Authorization": `Bearer ${token}`
      }   
  });
  },

  updateStatus: (user, token) => {
    const url = '/user/updatestatus/';
    return axiosClient.post(url, user, {headers: {
      "Content-type": "Application/json",
      "Authorization": `Bearer ${token}`
      }   
  });
  },

}

export default userAPI;