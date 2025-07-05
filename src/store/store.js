import { configureStore } from "@reduxjs/toolkit"
import facilitySlice from "./slices/facilitySlice"
import deviceSlice from "./slices/deviceSlice"  
import contractSlice from "./slices/contractSlice"
import serviceSlice from "./slices/serviceSlice"

export const store = configureStore({
  reducer: {
    facilities: facilitySlice,
    devices: deviceSlice,
    contracts: contractSlice,
    services: serviceSlice,
  },
})

