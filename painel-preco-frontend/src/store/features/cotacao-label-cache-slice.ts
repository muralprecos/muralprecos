import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type LabelCacheState = {
  labelCache: Record<string, Record<string, string>>;
  labelCacheMeta: Record<string, Record<string, { updatedAt: number }>>;
};

const MAX_CACHE_PER_FIELD = 200;

const initialState: LabelCacheState = {
  labelCache: {},
  labelCacheMeta: {},
};

type SetLabelPayload = {
  field: string;
  id: string;
  label: string;
  updatedAt?: number;
};

const pruneField = (state: LabelCacheState, field: string) => {
  const meta = state.labelCacheMeta[field];
  if (!meta) return;
  const ids = Object.keys(meta);
  if (ids.length <= MAX_CACHE_PER_FIELD) return;

  const sortedByOldest = ids.sort((a, b) => {
    return meta[a].updatedAt - meta[b].updatedAt;
  });

  const excess = ids.length - MAX_CACHE_PER_FIELD;
  for (let i = 0; i < excess; i += 1) {
    const id = sortedByOldest[i];
    delete state.labelCache[field][id];
    delete state.labelCacheMeta[field][id];
  }
};

export const cotacaoLabelCache = createSlice({
  name: "cotacaoLabelCache",
  initialState,
  reducers: {
    setLabel: (state, action: PayloadAction<SetLabelPayload>) => {
      const { field, id, label, updatedAt } = action.payload;
      if (!field || !id) return;
      if (!state.labelCache[field]) state.labelCache[field] = {};
      if (!state.labelCacheMeta[field]) state.labelCacheMeta[field] = {};

      state.labelCache[field][id] = label;
      state.labelCacheMeta[field][id] = { updatedAt: updatedAt ?? Date.now() };

      pruneField(state, field);
    },
  },
});

export const { setLabel } = cotacaoLabelCache.actions;
export default cotacaoLabelCache.reducer;
export { initialState as cotacaoLabelCacheInitialState };
