import { configureStore } from "@reduxjs/toolkit"
import facilitySlice from "./slices/facilitySlice"
import deviceSlice from "./slices/deviceSlice"  
import contractSlice from "./slices/contractSlice"
import serviceSlice from "./slices/serviceSlice"

export const store = configureStore({
  reducer: {
    devices: deviceSlice,
    facilities: facilitySlice,
    contracts: contractSlice,
    services: serviceSlice,
  },
})

