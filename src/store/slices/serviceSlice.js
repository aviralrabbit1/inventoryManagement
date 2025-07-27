import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { serviceVisitAPI } from "../../services/localStorageAPI"
import serviceVisits from '../../data/serviceVisits';

const serviceSlice = createSlice({
  name: "services",
  initialState: serviceVisits,
  reducers: {
    addServiceVisit: (state, action) => {
      const newVisit = serviceVisitAPI.create(action.payload)
      state.visits.push(newVisit)
    },
    updateServiceVisit: (state, action) => {
      const updatedVisit = serviceVisitAPI.update(action.payload.id, action.payload)
      const index = state.visits.findIndex((visit) => visit.id === action.payload.id)
      if (index !== -1) {
        state.visits[index] = updatedVisit
      }
    },
    deleteServiceVisit: (state, action) => {
      serviceVisitAPI.delete(action.payload)
      state.visits = state.visits.filter((visit) => visit.id !== action.payload)
    },
    loadServiceVisits: (state) => {
      state.visits = serviceVisitAPI.getAll()
    },
  },
})

export const { addServiceVisit, updateServiceVisit, deleteServiceVisit, loadServiceVisits } = serviceSlice.actions
export default serviceSlice.reducer
