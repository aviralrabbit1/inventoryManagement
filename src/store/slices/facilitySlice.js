import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { facilityAPI } from "../../services/localstorageAPI"
import facilities from '../../data/facilities'

const facilitySlice = createSlice({
  name: "facilities",
  initialState : {facilities},
  reducers: {
    addFacility: (state, action) => {
      const newFacility = facilityAPI.create(action.payload)
      state.facilities.push(newFacility)
    },
    updateFacility: (state, action) => {
      const updatedFacility = facilityAPI.update(action.payload.id, action.payload)
      const index = state.facilities.findIndex((facility) => facility.id === action.payload.id)
      if (index !== -1) {
        state.facilities[index] = updatedFacility
      }
    },
    deleteFacility: (state, action) => {
      facilityAPI.delete(action.payload)
      state.facilities = state.facilities.filter((facility) => facility.id !== action.payload)
    },
    loadFacilities : (state) => createAsyncThunk(
      'facilities',
      async () => {
        return facilityAPI.getAll(); // Fetch facilities from local storage
      }
    )
  },
})

export const { addFacility, updateFacility, deleteFacility, loadFacilities } = facilitySlice.actions
export default facilitySlice.reducer
