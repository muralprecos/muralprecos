import type { FormDataCotacao } from '@/app/(system)/cotacoes/realizar-cotacao/_components/utils';
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';

type initialState = {
  value: FormDataCotacao
}

export const initialFormData: FormDataCotacao = {
  ano: '',
  formaCompraId: '',
  modalidadeCompraId: '',
  periodoCompraId: '',
  esferaId: '',
  fornecedorId: '',
  materialId: '',
  municipioId: '',
  orgaoId: '',
  orgaoSuperiorId: '',
  porteFornecedor: '',
  situacao_licitacao: '',
  ufId: '',
  unidade_fornecimento: '',
  ugId: '',
  objeto: '',
  descricao: '',
  descricaoComplementar: '',
}
export type CotacaoSearchKeysFormData = keyof typeof initialFormData;

export const initialState = {
  value: initialFormData as FormDataCotacao
} as initialState;

// export const fetchContent = createAsyncThunk(
//   'content/fetchContent',
//   async (userId: number) => {
//     const res = await fetch(`https://jsonplaceholder.typicode.com/photos/${userId}`);
//     const data = await res.json()
//   }
// )

export const cotacaoSearch = createSlice({
  name: 'cotacaoSearch',
  initialState: initialState,
  reducers: {
    clearForm: () => {
      return initialState;
    },
    doSearch: (state, action: PayloadAction<FormDataCotacao>) => {
      return {
        value: action.payload
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

export const { clearForm, doSearch } = cotacaoSearch.actions;
export default cotacaoSearch.reducer;