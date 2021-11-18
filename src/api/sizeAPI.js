import axiosClient from "./axiosClient";

const sizeAPI = {

  update: (item, token) => {
    const url = '/productsize/update';
    return axiosClient.post(url, item, {
      headers: {
        "Content-type": "Application/json",
        "Authorization": `Bearer ${token}`
      }
    });
  },

  checkSize: (item, token) => {
    const url = '/productvariants/checksize';
    return axiosClient.post(url, item, {
      headers: {
        "Content-type": "Application/json",
        "Authorization": `Bearer ${token}`
      }
    });
  }
}

export default sizeAPI;