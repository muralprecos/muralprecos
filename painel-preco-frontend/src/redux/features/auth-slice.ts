import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';

type initialState = {
  value: AuthState
}

type AuthState = {
  isAuth: boolean
  username: string
  uuid: string
}

export const initialState = {
  value: {
    isAuth: false,
    username: '',
    uuid: ''
  } as AuthState
} as initialState;

// export const fetchContent = createAsyncThunk(
//   'content/fetchContent',
//   async (userId: number) => {
//     const res = await fetch(`https://jsonplaceholder.typicode.com/photos/${userId}`);
//     const data = await res.json()
//   }
// )

export const auth = createSlice({
  name: 'auth',
  initialState: initialState,
  reducers: {
    logOut: () => {
      return initialState;
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
  },
  extraReducers: (builder) => {
    // builder.addCase(fetchContent.pending, (state) => {
    //   state.isLoading = true
    // })
    // builder.addCase(fetchContent.fulfilled, (state, action) => {
    //   state.isLoading = false
    //   state.contents = action.payload
    // })
    // builder.addCase(fetchContent.rejected, (state, action) => {
    //   state.isLoading = false
    //   state.error = action.error.message
    // })
  }
})

export const { logIn, logOut } = auth.actions;
export default auth.reducer;