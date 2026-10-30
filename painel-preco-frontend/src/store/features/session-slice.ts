import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface SessionState {
  name: string;
  org: string;
}

export const sessionInitialState: SessionState = {
  name: '',
  org: '',
};

export const sessionSlice = createSlice({
  name: 'session',
  initialState: sessionInitialState,
  reducers: {
    setSessionData: (state, action: PayloadAction<{ name: string; org: string }>) => {
      state.name = action.payload.name;
      state.org = action.payload.org;
    },
    clearSessionData: (state) => {
      state.name = '';
      state.org = '';
    },
  },
});

export const { setSessionData, clearSessionData } = sessionSlice.actions;
export default sessionSlice.reducer;
