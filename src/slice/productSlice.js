import { createSlice } from '@reduxjs/toolkit';

const initialProduct = {
  ProductId: '',
  Description: '',
  CategoryId: '',
  URLPicture: '',
  Title: '',
  UnitPrice: 0,
  OldPrice: 0,
  Quantity: 0,
  colors: [],
  sizes: [],
};

const user = createSlice({
  name: 'product',
  initialState: initialProduct,
  reducers: {
    add: (state, action) => {
        return {...action.payload}
    },

    updateColor: (state, action) => {
        return {...state, colors: action.payload};
    },

    updateSize: (state, action) => {
        return {...state, sizes: action.payload};
    },

    refresh: (state, action) => {
      return initialProduct;
    }
  }
});

// export const { cartReducer } = cart;
const { reducer, actions } = user;
export const { add,  updateColor, updateSize, refresh} = actions;
export default reducer;