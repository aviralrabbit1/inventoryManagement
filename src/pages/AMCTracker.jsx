import React from "react"
import { useState } from "react"
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material"
import { Add as AddIcon, GetApp as ExportIcon } from "@mui/icons-material"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import { useSelector, useDispatch } from "react-redux"
import { addContract } from "../store/slices/contractSlice"

const AMCTracker = () => {
  const dispatch = useDispatch()
  const contracts = useSelector((state) => state.contracts)
  console.log("Contracts:", contracts);
  const devices = useSelector((state) => state.devices)

  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    serialNo: "",
    deviceName: "",
    facilityName: "",
    contractType: "",
    startDate: "",
    expiryDate: "",
    status: "",
    cost: 0,
    vendor: "",
    terms: "",
  })

  const handleSubmit = () => {
    const newContract = {
      ...formData,
      id: `${Date.now()}`,
    }

    dispatch(addContract(newContract))
    setOpen(false)
    setFormData({
      serialNo: "",
      deviceName: "",
      facilityName: "",
      contractType: "",
      startDate: new Date().toISOString().split("T")[0],
      expiryDate: "",
      status: "Active",
      cost: 0,
      vendor: "",
      terms: "",
    })
  }

  const maxLengthNotes = 30; // Set the maximum character length for the shortened text
  // const [isNotesExpanded, setIsNotesExpanded] = useState(false);
  // const toggleNotes = () => {
    //   setIsNotesExpanded(!isNotesExpanded);
    // };
  const [expandedRowIndex, setExpandedRowIndex] = useState(null);
  const toggleRow = (index) => {
    setExpandedRowIndex(expandedRowIndex === index ? null : index);
  };
  const getShortenedNotes = (text, isNotesExpanded) => {
    if (text.length > maxLengthNotes && !isNotesExpanded) {
      return text.slice(0, maxLengthNotes) + '...';
    }
    return text;
  };

  const handleDeviceChange = (serialNo) => {
    const device = devices.find((d) => d.id === serialNo)
    setFormData({
      ...formData,
      serialNo,
      deviceName: device ? `${device.type} - ${device.model}` : "",
      facilityName: device?.facilityName || "",
    })
  }

  const exportToCSV = () => {
    const csvContent = [
      ["Contract ID", "Device", "Facility", "Type", "Start Date", "End Date", "Status", "Cost", "Vendor"],
      ...contracts.map((contract) => [
        contract.id,
        contract.deviceName,
        contract.facilityName,
        contract.contractType,
        contract.startDate,
        contract.expiryDate,
        contract.status,
        contract.cost,
        contract.vendor,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "amc_contracts.csv"
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const getDaysUntilExpiry = (startDate, expiryDate) => {
    const differenceInTime = new Date(expiryDate)- new Date(startDate);
    const differenceInDays = Math.ceil(differenceInTime / (1000 * 60*60 * 24));
    return differenceInDays
  }

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h4" component="h1">
          AMC/CMC Tracker
        </Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button variant="outlined" startIcon={<ExportIcon />} onClick={exportToCSV}>
            Export CSV
          </Button>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpen(true)}>
            Add Contract
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="success.main">
                Active Contracts
              </Typography>
              <Typography variant="h4">{contracts.filter((c) => c.status === "Active").length}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="warning.main">
                Expiring Soon
              </Typography>
              <Typography variant="h4">{contracts.filter((c) => c.status === "Expiring Soon").length}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="error.main">
                Expired
              </Typography>
              <Typography variant="h4">{contracts.filter((c) => c.status === "Expired").length}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="primary.main">
                Total Value
              </Typography>
              <Typography variant="h4">${contracts.reduce((sum, c) => sum + c.cost, 0).toLocaleString()}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Contract ID</TableCell>
              <TableCell>Device</TableCell>
              <TableCell>Terms</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Start Date</TableCell>
              <TableCell>End Date</TableCell>
              <TableCell>Days Left</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Cost</TableCell>
              <TableCell>Vendor</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {contracts.map((contract) => (
              <TableRow key={contract.id}>
                <TableCell>{contract.id}</TableCell>
                <TableCell>{contract.serialNo}</TableCell>
                <TableCell>
                  <Typography variant="body2" onClick={(e) => {
                    // console.log(e)
                      toggleRow(contract.id)
                    }
                  } sx={{ cursor: 'pointer' }}>
                    {getShortenedNotes(contract.terms, expandedRowIndex === contract.id)}
                  </Typography>
                  {contract.terms.length > maxLengthNotes && (
                    <Typography variant="body2" onClick={(e) => {                      
                      // console.log("currenttarget:", e.currenttarget)
                        toggleRow(contract.id)
                      }
                    } sx={{ cursor: 'pointer', color: 'primary.main' }}>
                      {expandedRowIndex === contract.id ? 'Show less' : 'Read more'}
                    </Typography>
                  )}
                </TableCell>
                <TableCell>
                  <Chip
                    label={contract.contractType}
                    color={contract.contractType === "AMC" ? "primary" : "secondary"}
                    size="small"
                  />
                </TableCell>
                <TableCell>{contract.startDate}</TableCell>
                <TableCell>{contract.expiryDate}</TableCell>
                <TableCell>
                  {getDaysUntilExpiry(contract.startDate, contract.expiryDate) > 0
                    ? `${getDaysUntilExpiry(contract.startDate, contract.expiryDate)} days`
                    : "Expired"}
                </TableCell>
                <TableCell>
                  <Chip
                    label={contract.status}
                    color={
                      contract.status === "Active" || contract.status === "Renewed"
                        ? "success"
                        : contract.status === "Under Review" || contract.status === "Draft" || contract.status === "Pending"
                          ? "default"
                          : "error"
                    }
                    size="small"
                  />
                </TableCell>
                <TableCell>${contract.cost.toLocaleString()}</TableCell>
                <TableCell>{contract.vendor}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Add New Contract</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Device</InputLabel>
                <Select value={formData.serialNo} label="Device" onChange={(e) => handleDeviceChange(e.target.value)}>
                  {devices.map((device) => (
                    <MenuItem key={device.id} value={device.id}>
                      {device.type} - {device.model} ({device.facilityName})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Contract Type</InputLabel>
                <Select
                  value={formData.contractType}
                  label="Contract Type"
                  onChange={(e) => setFormData({ ...formData, contractType: e.target.value })}
                >
                  <MenuItem value="AMC">AMC (Annual Maintenance Contract)</MenuItem>
                  <MenuItem value="CMC">CMC (Comprehensive Maintenance Contract)</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <DatePicker
                label="Start Date"
                value={formData.startDate}
                onChange={(date) => setFormData({ ...formData, startDate: date?.format("YYYY-MM-DD") || "" })}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <DatePicker
                label="End Date"
                value={formData.expiryDate}
                onChange={(date) => setFormData({ ...formData, expiryDate: date?.format("YYYY-MM-DD") || "" })}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Cost ($)"
                type="number"
                value={formData.cost}
                onChange={(e) => setFormData({ ...formData, cost: Number.parseFloat(e.target.value) })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Vendor"
                value={formData.vendor}
                onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Contract Terms"
                multiline
                rows={3}
                value={formData.terms}
                onChange={(e) => setFormData({ ...formData, terms: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            Add Contract
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default AMCTracker
