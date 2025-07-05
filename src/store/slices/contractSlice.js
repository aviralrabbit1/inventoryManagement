import { createSlice } from "@reduxjs/toolkit"
import { contractAPI } from "../../services/localStorageAPI"
import contracts from '../../data/contracts';

const contractSlice = createSlice({
  name: "amc",
  initialState: contracts,
  reducers: {
    addContract: (state, action) => {
      const newContract = contractAPI.create(action.payload)
      state.contracts.push(newContract)
    },
    updateContract: (state, action) => {
      const updatedContract = contractAPI.update(action.payload.id, action.payload)
      const index = state.contracts.findIndex((contract) => contract.id === action.payload.id)
      if (index !== -1) {
        state.contracts[index] = updatedContract
      }
    },
    deleteContract: (state, action) => {
      contractAPI.delete(action.payload)
      state.contracts = state.contracts.filter((contract) => contract.id !== action.payload)
    },
    loadContracts: (state) => {
      state.contracts = contractAPI.getAll()
    },
  },
})

export const { addContract, updateContract, deleteContract, loadContracts } = contractSlice.actions
export default contractSlice.reducer
