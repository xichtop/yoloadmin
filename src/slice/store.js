import { configureStore } from "@reduxjs/toolkit";
import  userReducer  from './userSlice';
import  productReducer  from './productSlice';


const rootReducer = {
  product: productReducer,
  user: userReducer,
}

const store = configureStore({
    reducer: rootReducer,
});


export default store;