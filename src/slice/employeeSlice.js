import { createSlice } from '@reduxjs/toolkit';

const initialEmployee = {
  user: {
    EmployeeId: '',
    Password: '',
    Fullname: '',
    Workphone: '',
  },
  token: '',
};

const employee = createSlice({
  name: 'user',
  initialState: initialEmployee,
  reducers: {
    login: (state, action) => {
      // const newProduct = action.payload;
        return {...action.payload}
    },

    logout: () => {
        // const newProduct = action.payload;
        return initialEmployee;
    },
  }
});

// export const { cartReducer } = cart;
const { reducer, actions } = employee;
export const { login,  logout } = actions;
export default reducer;