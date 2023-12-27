import { IRetornoPesquisaItensLicitacao } from '@/interfaces/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type initialState = {
  value: IRetornoPesquisaItensLicitacao[]
}

export const initialState = {
  value: new Array() as IRetornoPesquisaItensLicitacao[]
} as initialState;

export const cart = createSlice({
  name: 'cart',
  initialState: initialState,
  reducers: {
    clear: () => {
      return initialState;
    },
    add: (state, action: PayloadAction<IRetornoPesquisaItensLicitacao>) => {
      const has = state.value.filter((el) => el.uuid == action.payload.uuid).length > 0;
      if (!has) {
        state.value.push(action.payload)
      }
    },
    remove: (state, action: PayloadAction<IRetornoPesquisaItensLicitacao>) => {
      state.value = state.value.filter((el) => el.uuid != action.payload.uuid);
    }
  }
})

export const { clear, add, remove } = cart.actions;
export default cart.reducer;