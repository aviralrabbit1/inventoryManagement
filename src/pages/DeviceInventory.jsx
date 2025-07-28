import React from "react"
import { useState } from "react"
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Chip,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material"
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material"
import { useSelector, useDispatch } from "react-redux"
import { addDevice, updateDevice, deleteDevice, loadDevices } from "../store/slices/deviceSlice"

const DeviceInventory = () => {
  const dispatch = useDispatch()
  const devicesData = useSelector((state) => state.devices);
  const devices = [...devicesData];
  const facilities = useSelector((state) => state.facilities.facilities);
  // console.log("devices:", devices);

  const [open, setOpen] = useState(false)
  const [editingDevice, setEditingDevice] = useState(null)
  const [formData, setFormData] = useState({
    deviceID: "",
    contractType: "",
    deviceType: "",
    serialNo: "",
    facilityNPI: "",
    facilityID: "",
    status: "online",
    batteryLevel: 100,
    qrCode: "",
    installationDate: new Date().toISOString().split("T")[0],
  })

  const handleOpen = (device) => {
    if (device) {
      setEditingDevice(device)
      setFormData(device)
    } else {
      setEditingDevice(null)
      setFormData({
        deviceID: "",
        contractType: "",
        deviceType: "",
        serialNo: "",
        facilityNPI: "",
        facilityID: "",
        status: "online",
        batteryLevel: 100,
        qrCode: "",
        installationDate: new Date().toISOString().split("T")[0],
      })
    }
    setOpen(true)
  }

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h4" component="h1">
          Device Inventory
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpen()}>
          Add Device
        </Button>
      </Box>

      <Grid container spacing={3}>
        {devices.map((device) => (
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} xs={12} md={6} lg={4} key={device.serialNo}>
            <Card>
              <CardContent>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                  <Box sx={{mr: 1}}>
                    <Typography variant="h5" component="div">
                      {device.deviceType}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {device.deviceID} 
                      {/* • {device.serialNo} */}
                    </Typography>
                  </Box>
                  <Chip
                    label={device.status}
                    color={
                      device.status === "Online" ? "success" : device.status === "Maintenance" ? "warning" : "error"
                    }
                    size="small"
                  />
                </Box>

                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Facility NPI:</strong> {device.facilityNPI}
                </Typography>
                {/* <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Location:</strong> {device.city}
                </Typography> */}
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Serial No:</strong> {device.serialNo}
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  <strong>Last Service:</strong> {device.lastServiceDate}
                </Typography>

                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                    <Typography variant="body2">Battery Level</Typography>
                    <Typography variant="body2">{device.batteryLevel}%</Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={device.batteryLevel}
                    color={device.batteryLevel > 50 ? "success" : "warning"}
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>

                <Box sx={{ display: "flex", gap: 1 }}>
                  <Button size="small" startIcon={<EditIcon />} >
                    Edit
                  </Button>
                  <Button size="small" color="error" startIcon={<DeleteIcon />} >
                    Delete
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}

export default DeviceInventory
