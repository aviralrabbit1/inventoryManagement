import { configureStore } from "@reduxjs/toolkit"
import facilitySlice from "./slices/facilitySlice"
export const store = configureStore({
  reducer: {
    facilities: facilitySlice,
  },
})

