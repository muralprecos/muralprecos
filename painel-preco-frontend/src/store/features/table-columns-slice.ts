import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface TableColumnsPreference {
  showUnidade: boolean;
  showQuantidade: boolean;
  showValorTotal: boolean;
  showLocalizacao: boolean;
}

export type TableColumnsPreferenceState = Record<string, TableColumnsPreference>;

export const defaultTableColumnsPreference: TableColumnsPreference = {
  showUnidade: true,
  showQuantidade: true,
  showValorTotal: false,
  showLocalizacao: false,
};

export const tableColumnsPreferenceInitialState: TableColumnsPreferenceState = {};

interface IUserColumnPreferencePayload {
  user: string;
}

interface ISetShowUnidadePayload extends IUserColumnPreferencePayload {
  showUnidade: boolean;
}

interface ISetShowQuantidadePayload extends IUserColumnPreferencePayload {
  showQuantidade: boolean;
}

interface ISetShowValorTotalPayload extends IUserColumnPreferencePayload {
  showValorTotal: boolean;
}

interface ISetShowLocalizacaoPayload extends IUserColumnPreferencePayload {
  showLocalizacao: boolean;
}

const ensureUserPreference = (
  state: TableColumnsPreferenceState,
  user: string
): TableColumnsPreference => {
  if (!state[user]) {
    state[user] = { ...defaultTableColumnsPreference };
  }

  return state[user];
};

export const tableColumnsPreferenceSlice = createSlice({
  name: "tableColumnsPreference",
  initialState: tableColumnsPreferenceInitialState,
  reducers: {
    setShowUnidade: (state, action: PayloadAction<ISetShowUnidadePayload>) => {
      const { user, showUnidade } = action.payload;
      if (!user) return;

      const userPreference = ensureUserPreference(state, user);
      userPreference.showUnidade = showUnidade;
    },
    setShowQuantidade: (
      state,
      action: PayloadAction<ISetShowQuantidadePayload>
    ) => {
      const { user, showQuantidade } = action.payload;
      if (!user) return;

      const userPreference = ensureUserPreference(state, user);
      userPreference.showQuantidade = showQuantidade;
    },
    setShowValorTotal: (
      state,
      action: PayloadAction<ISetShowValorTotalPayload>
    ) => {
      const { user, showValorTotal } = action.payload;
      if (!user) return;

      const userPreference = ensureUserPreference(state, user);
      userPreference.showValorTotal = showValorTotal;
    },
    setShowLocalizacao: (
      state,
      action: PayloadAction<ISetShowLocalizacaoPayload>
    ) => {
      const { user, showLocalizacao } = action.payload;
      if (!user) return;

      const userPreference = ensureUserPreference(state, user);
      userPreference.showLocalizacao = showLocalizacao;
    },
    resetUserColumnsPreference: (
      state,
      action: PayloadAction<IUserColumnPreferencePayload>
    ) => {
      const { user } = action.payload;
      if (!user) return;

      state[user] = { ...defaultTableColumnsPreference };
    },
  },
});

export const {
  setShowUnidade,
  setShowQuantidade,
  setShowValorTotal,
  setShowLocalizacao,
  resetUserColumnsPreference,
} = tableColumnsPreferenceSlice.actions;

export const getTableColumnsPreferenceByUser = (
  state: TableColumnsPreferenceState,
  user: string
): TableColumnsPreference => {
  if (!user || !state[user]) {
    return defaultTableColumnsPreference;
  }

  return state[user];
};

export default tableColumnsPreferenceSlice.reducer;
