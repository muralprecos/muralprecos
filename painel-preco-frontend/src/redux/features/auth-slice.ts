// import { IUser } from '@/interfaces/types';
// import { createSlice } from '@reduxjs/toolkit';
// import { registerUser } from '../actions/authActions';

// type initialState = {
//   value: IUser
//   loading: 'idle' | 'pending' | 'succeeded' | 'failed'
// }

// export const initialState = {
//   value: {
//     isAuth: false,
//     error: null,
//     user: {
//       userInfo: null,
//       userToken: null
//     }
//   } as IUser,
//   loading: 'idle'
// } as initialState;

// const saveAuth = (authValue: IUser) => {
//   localStorage.setItem("authValue", JSON.stringify(authValue))
// }

// export const auth = createSlice({
//   name: 'auth',
//   initialState: initialState,
//   reducers: {
//     logOut: () => {
//       saveAuth(initialState.value);
//       return initialState;
//     }
//   },
//   extraReducers: (builder) => {
//     builder.addCase(registerUser.pending, (state) => {
//       state.loading = 'pending';
//       state.value.error = null;
//       state.value.isAuth = false;
//       saveAuth(state.value);
//     })
//     builder.addCase(registerUser.fulfilled, (state, action) => {
//       state.loading = 'succeeded';
//       state.value.user = action.payload || null;
//       state.value.isAuth = state.value.user?.userInfo != null && state.value.user?.userToken != null;
//       saveAuth(state.value);
//     })
//     builder.addCase(registerUser.rejected, (state, action) => {
//       state.loading = 'failed';
//       state.value.isAuth = false;
//       state.value.error = action.error.message || 'Ocorreu um erro durante o login';
//       saveAuth(state.value);
//     })
//   }
// })

// export const { logOut } = auth.actions;
// export default auth.reducer;