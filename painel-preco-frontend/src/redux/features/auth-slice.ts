import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type initialState = {
  value: AuthState
}

type AuthState = {
  isAuth: boolean
  username: string
  uuid: string
}

export const authInitialState = {
  value: {
    isAuth: false,
    username: '',
    uuid: ''
  } as AuthState
} as initialState;

export const auth = createSlice({
  name: 'auth',
  initialState: authInitialState,
  reducers: {
    logOut: () => {
      return authInitialState;
    },
    logIn: (state, action: PayloadAction<string>) => {
      return {
        value: {
          isAuth: true,
          username: action.payload,
          uuid: 'teste'
        }
      }
    }
  }
})

export const { logIn, logOut } = auth.actions;
export default auth.reducer;