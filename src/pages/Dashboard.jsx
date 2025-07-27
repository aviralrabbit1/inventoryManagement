import React from "react"
import { Grid, Card, CardContent, Typography, Box, Chip, LinearProgress, Button } from "@mui/material"
import {
  Devices as DevicesIcon,
  Build as BuildIcon,
  Warning as WarningIcon,
  Assignment as AssignmentIcon,
  GetApp as ExportIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material"
import AMCExpiryChart from '../components/Charts/AMCExpiryChart.jsx';
import DeviceStatusChart from '../components/Charts/DeviceStatusChart.jsx';
import FacilityDevicesChart from '../components/Charts/FacilityDevicesChart.jsx';
import ServiceVisitsChart from '../components/Charts/ServiceVisitsChart.jsx';
// import BatteryLevelChart from '../components/Charts/BatteryLevelChart.jsx';
import { useSelector, useDispatch } from "react-redux"
import { loadDevices } from "../store/slices/deviceSlice"
import { loadFacilities } from "../store/slices/facilitySlice"


const Dashboard = () => {
  const dispatch = useDispatch()
  const devices = useSelector((state) => state.devices.devices)
  const facilities = useSelector((state) => state.facilities.facilities)

  const handleRefreshData = () => {
    dispatch(loadDevices())
    dispatch(loadFacilities())
  }
  const exportAllData = () => {
    console.log("Exporting all data...")
  }

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h4" component="h1">
          Dashboard Overview
        </Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button variant="outlined" startIcon={<RefreshIcon />} onClick={handleRefreshData}>
            Refresh Data
          </Button>
          <Button variant="outlined" startIcon={<ExportIcon />} onClick={exportAllData}>
            Export All Data
          </Button>
        </Box>
      </Box>
      {/* Chart Section */}
      <div className="charts-container">      
        <AMCExpiryChart />
        <DeviceStatusChart /> 
        <FacilityDevicesChart />
        <ServiceVisitsChart />
        {/* <BatteryLevelChart /> */}
      </div>
    </Box>
  )
}

export default Dashboard