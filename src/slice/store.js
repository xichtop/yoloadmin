import { configureStore } from "@reduxjs/toolkit";
import  employeeReducer  from './employeeSlice';
import  productReducer  from './productSlice';


const rootReducer = {
  product: productReducer,
  employee: employeeReducer,
}

const store = configureStore({
    reducer: rootReducer,
});


export default store;