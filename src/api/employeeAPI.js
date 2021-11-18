import axiosClient from "./axiosClient";

const employeeApi = {
  login: (user) => {
    const url = '/employee/login';
    return axiosClient.post(url, user);
  },
}

export default employeeApi;