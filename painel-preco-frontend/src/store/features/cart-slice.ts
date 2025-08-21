import { ICart, ICartItem } from '@/interfaces/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export const initialState : ICart = {};

export const cart = createSlice({
  name: 'carts',
  initialState: initialState,
  reducers: {
    clear: (state, action: PayloadAction<string>) => {
      const usr = action.payload;
      if (usr == null) return;
      const userCart = state[usr];
      if (!!userCart) {
        state[usr] = [];
      }
    },
    add: (state, action: PayloadAction<ICartItem>) => {
      const usr = action.payload.user;
      const item = action.payload.item;
      if (usr == null || item == null) return;

      const userCart = state[usr];
      if (!!userCart) {
        const has = userCart.filter((el) => el.uuid == item.uuid).length > 0;
        if (!has) {
          userCart.push(item)
        }
      } else {
        state[usr] = [item];
      }
    },
    remove: (state, action: PayloadAction<ICartItem>) => {
      const usr = action.payload.user;
      const item = action.payload.item;
      if (usr == null || item == null) return;

      const userCart = state[usr];
      if (!!userCart) {
        state[usr] = userCart.filter((el) => el.uuid != item.uuid);
      }
    }
  }
})

export const { clear, add, remove } = cart.actions;
export default cart.reducer;