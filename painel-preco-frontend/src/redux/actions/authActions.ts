// authActions.js
import { postLogin } from '@/hooks/api'
import { IUserAuth, IUserRequest } from '@/interfaces/types'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { decodeToken, isExpired, useJwt } from 'react-jwt';

export const registerUser = createAsyncThunk(
  'auth/register',
  async (u: IUserAuth, { rejectWithValue }) : Promise<IUserRequest|undefined> => {
    try {
      const usr : IUserRequest = {
        userInfo: null,
        userToken: null
      };
      const res = await postLogin(u);
      // if (res != null && res.access_token) {
      //   usr.userToken = res;
      //   usr.userInfo = decodeToken(res.access_token);
      // }
      return usr;
    } catch (e) {
      if (typeof e === "string") {
        rejectWithValue(e.toUpperCase())
      } else if (e instanceof Error) {
        rejectWithValue(e.message)
      }
    }
  }
)