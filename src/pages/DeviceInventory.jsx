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
  Autocomplete,
} from "@mui/material"
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material"
import { useSelector, useDispatch } from "react-redux"
import { addDevice, updateDevice, deleteDevice, loadDevices } from "../store/slices/deviceSlice"
import deviceTypes from "../data/device_types.js";

const DeviceInventory = () => {
  const dispatch = useDispatch()
  const devicesData = useSelector((state) => state.devices);
  const devices = [...devicesData];
  const facilities = useSelector((state) => state.facilities.facilities);
  // console.log("facilities:", facilities[0]);
  // let m = new Map();
  // for(let x of facilities) {
  //     m.set(x.facilityNPI, (m.get(x.facilityNPI) || 0) +1);
  // } 
  // console.log(m)
  console.log("devices:", devices[0]);

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

  const handleClose = () => {
    setOpen(false)
    setEditingDevice(null)
  }

  const handleSubmit = () => {
    const deviceData = {
      ...formData,
      id: editingDevice?.id || `DEV${Date.now()}`,
      lastServiceDate: editingDevice?.lastServiceDate || new Date().toISOString().split("T")[0],
      installationDate: editingDevice?.installationDate || new Date().toISOString().split("T")[0],
      amcStatus: editingDevice?.amcStatus || "Active",
      amcExpiryDate:
        editingDevice?.amcExpiryDate || new Date(Date.now() + 365 * 24 * 60 * 60 * 2).toISOString().split("T")[0],
    }

    if (editingDevice) {
      dispatch(updateDevice(deviceData))
    } else {
      dispatch(addDevice(deviceData))
    }
    handleClose()
  }

  const handleDelete = (serialNo) => {
    if (window.confirm("Are you sure you want to delete this device?")) {
      dispatch(deleteDevice(serialNo))
    }
  }

  const handleFacilityChange = (facilityNPI) => {
    const facility = facilities.find((f) => f.facilityNPI === facilityNPI)
    setFormData({
      ...formData,
      facilityNPI,
      facilityName: facility?.name || "",
    })
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
                  <Button size="small" startIcon={<EditIcon />} onClick={() => handleOpen(device)}>
                    Edit
                  </Button>
                  <Button size="small" color="error" startIcon={<DeleteIcon />} onClick={() => handleDelete(device.serialNo)}>
                    Delete
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>{editingDevice ? "Edit Device" : "Add New Device"}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
                {/* <Autocomplete
                  disablePortal
                  options={deviceTypes}
                  sx={{ width: 200 }}
                  renderInput={(params) => 
                    <TextField
                      {...params}
                      fullWidth
                      label="Device Type"
                      value={formData.deviceType}
                      onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    />                
                }
                /> */}
              <FormControl fullWidth sx={{ width: 200 }}>
                <InputLabel id="deviceTypeLabel" >Device Type</InputLabel>
                <Select
                  labelId="deviceTypeLabel"
                  value={formData.deviceType}
                  label="Device Type"
                  onChange={(e) => setFormData({ ...formData, deviceType: e.target.value })}
                >
                  {deviceTypes.map((device) => (
                    <MenuItem key={device.deviceID} value={device.deviceName}>
                      {device.deviceName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="QR Code"
                value={formData.qrCode}
                onChange={(e) => setFormData({ ...formData, qrCode: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Serial Number"
                value={formData.serialNo}
                onChange={(e) => setFormData({ ...formData, serialNo: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth sx={{ width: 200 }}>
                <InputLabel>Facility NPI</InputLabel>
                <Select
                  value={formData.facilityNPI}
                  label="Facility NPI"
                  onChange={(e) => handleFacilityChange(e.target.value)}
                >
                  {facilities.map((facility) => (
                    <MenuItem key={facility.id} value={facility.facilityNPI}>
                      {facility.facilityNPI}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {/* <Autocomplete
                  disablePortal
                  options={facilities}
                  sx={{ width: 200 }}
                  renderInput={(params) => 
                    <TextField
                      {...params}
                      fullWidth
                      label="Device Type"
                      value={formData.facilityNPI}
                      onChange={(e) => setFormData({ ...formData, facilityNPI: e.target.value })}
                    />                
                }
                /> */}
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth sx={{ width: 200 }}>
                <InputLabel>Status</InputLabel>
                <Select
                  value={formData.status}
                  label="Status"
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <MenuItem value="online">Online</MenuItem>
                  <MenuItem value="offline">Offline</MenuItem>
                  <MenuItem value="maintenance">Maintenance</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Battery Level (%)"
                type="number"
                value={formData.batteryLevel}
                onChange={(e) => setFormData({ ...formData, batteryLevel: Number.parseInt(e.target.value) })}
                inputProps={{ min: 0, max: 100 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth sx={{ width: 200 }}>
                <InputLabel>Contract Type</InputLabel>
                <Select
                  value={formData.contractType}
                  label="Contract Type"
                  onChange={(e) => setFormData({ ...formData, contractType: e.target.value })}
                >
                  <MenuItem value="amc">AMC</MenuItem>
                  <MenuItem value="cmc">CMC</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Assigned Engineer"
                value={formData.assignedEngineer}
                onChange={(e) => setFormData({ ...formData, assignedEngineer: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingDevice ? "Update" : "Add"} Device
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default DeviceInventory
