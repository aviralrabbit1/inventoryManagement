import { createSlice } from "@reduxjs/toolkit";
import { deviceAPI } from "../../services/localStorageAPI"
import devices from "../../data/devices";

const deviceSlice = createSlice({
  name: "devices",
  initialState: devices,
  reducers: {
    addDevice: (state, action) => {
      const newDevice = deviceAPI.create(action.payload)
      state.push(newDevice)
    },
    updateDevice: (state, action) => {
      const updatedDevice = deviceAPI.update(action.payload.id, action.payload)
      const index = state.findIndex((device) => device.id === action.payload.id)
      if (index !== -1) {
        state[index] = updatedDevice
      }
    },
    deleteDevice: (state, action) => {
      deviceAPI.delete(action.payload)
      console.log("state deviceID is",state.deviceID,'payload is', action.payload);
      state = state.filter((device) => device.deviceID !== action.payload)
    },
    loadDevices: async (state) => {
      state = deviceAPI.getAll()
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
    },
  },
})

export const { addDevice, updateDevice, deleteDevice, loadDevices, setLoading, setError } = deviceSlice.actions
export default deviceSlice.reducer
