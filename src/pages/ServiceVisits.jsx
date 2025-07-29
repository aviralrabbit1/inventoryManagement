import { useState } from "react"
import {
  Box,
  Typography,
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
import { Add as AddIcon, CloudUpload as UploadIcon, GetApp as DownloadIcon } from "@mui/icons-material"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import { useSelector, useDispatch } from "react-redux"
import { addServiceVisit } from "../store/slices/serviceSlice"
import Aviral_Verma from '../assets/Aviral_Verma.pdf';
import { downloadPDF, openPDFInNewTab } from "../utils/pdfUtils"

const ServiceVisits = () => {
  const dispatch = useDispatch()
  const visits = useSelector((state) => state.services)
  console.log(visits);
  const devices = useSelector((state) => state.devices)

  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    serialNo: "",
    deviceId: "",
    deviceName: "",
    facilityName: "",
    nextServiceDate: "",
    date: new Date().toISOString().split("T")[0],
    engineer: "",
    purpose: "",
    status: "Scheduled",
    notes: "",
    attachments: [],
  })

  const maxLengthNotes = 50; // Set the maximum character length for the shortened text
  const [isNotesExpanded, setIsNotesExpanded] = useState(false);
  const toggleNotes = () => {
    setIsNotesExpanded(!isNotesExpanded);
  };
  const getShortenedNotes = (text) => {
    if (text.length > maxLengthNotes && !isNotesExpanded) {
      return text.slice(0, maxLengthNotes) + '...';
    }
    return text;
  };

  const handleSubmit = () => {
    const newVisit = {
      ...formData,
      id: `SV${Date.now()}`,
    }

    dispatch(addServiceVisit(newVisit))
    setOpen(false)
    setFormData({
      serialNo: "",
      deviceId: "",
      deviceName: "",
      facilityName: "",
      date: new Date().toISOString().split("T")[0],
      nextServiceDate: "",
      engineer: "",
      purpose: "",
      status: "Scheduled",
      notes: "",
      attachments: [],
    })
  }

  const handleDeviceChange = (deviceId) => {
    const device = devices.find((d) => d.id === deviceId)
    setFormData({
      ...formData,
      deviceId,
      deviceName: device ? `${device.purpose} - ${device.model}` : "",
      facilityNPI: device?.facilityNPI || "",
    })
  }

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h4" component="h1">
          Service Visits
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpen(true)}>
          Schedule Visit
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ height: 400, overflowY: 'auto' }}>
        <Table>
          <TableHead sx={{ position: "sticky", top: 0, zIndex: 5, backgroundColor: "white" }}>
            <TableRow>
              <TableCell>Device</TableCell>
              <TableCell>Facility</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Next Service Date</TableCell>
              <TableCell>Engineer</TableCell>
              <TableCell>Purpose</TableCell>
              {/* <TableCell>Status</TableCell> */}
              <TableCell>Notes</TableCell>
              <TableCell>Attachments</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {visits.map((visit) => (
              <TableRow key={visit.id}>
                <TableCell>{visit.id}</TableCell>
                <TableCell>{visit.facilityNPI}</TableCell>
                <TableCell>{visit.date}</TableCell>
                <TableCell>{visit.nextServiceDate}</TableCell>
                <TableCell>{visit.engineer}</TableCell>
                <TableCell>
                  <Chip
                    label={visit.purpose}
                    color={visit.purpose === "Breakdown" ? "error" : visit.purpose === "Preventive" ? "success" : "primary"}
                    size="small"
                  />
                </TableCell>
                {/* <TableCell>
                  <Chip
                    label={visit.status}
                    color={
                      visit.status === "Completed" ? "success" : visit.status === "In Progress" ? "warning" : "default"
                    }
                    size="small"
                  />
                </TableCell> */}
                <TableCell sx={{ maxHeight: 50, overflowY: 'auto', }}>
                  <Typography variant="body2" onClick={toggleNotes} sx={{ cursor: 'pointer' }}>
                    {getShortenedNotes(visit.notes)}
                  </Typography>
                  {visit.notes.length > maxLengthNotes && (
                    <Typography variant="body2" onClick={toggleNotes} sx={{ cursor: 'pointer', color: 'primary.main' }}>
                      {isNotesExpanded ? 'Show less' : 'Read more'}
                    </Typography>
                  )}
                </TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Button size="small" onClick={() => openPDFInNewTab(Aviral_Verma)} variant="outlined">
                      {visit.attachments}
                    </Button>
                    <Button
                      size="small"
                      onClick={() => downloadPDF(Aviral_Verma,visit.attachments)}
                      variant="contained"
                      startIcon={<DownloadIcon />}
                    >
                      Download
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Schedule Service Visit</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Device</InputLabel>
                <Select value={formData.deviceId} label="Device" onChange={(e) => handleDeviceChange(e.target.value)}>
                  {devices.map((device) => (
                    <MenuItem key={device.serialNo} value={device.serialNo}>
                      {device.purpose} - {device.model} ({device.facilityNPI})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <DatePicker
                label="Visit Date"
                value={formData.date}
                onChange={(date) => setFormData({ ...formData, date: new Date().toISOString().split("T")[0] || "" })}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </Grid>            
            <Grid item xs={12} sm={6}>
              <DatePicker
                label="Visit Date"
                value={formData.nextServiceDate}
                onChange={(date) => setFormData({ ...formData, nextServiceDate: e.target.value || "" })}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Engineer"
                value={formData.engineer}
                onChange={(e) => setFormData({ ...formData, engineer: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Visit Purpose</InputLabel>
                <Select
                  value={formData.purpose}
                  label="Visit Purpose"
                  onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                >
                  <MenuItem value="Preventive">Preventive</MenuItem>
                  <MenuItem value="Breakdown">Breakdown</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={formData.status}
                  label="Status"
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <MenuItem value="Scheduled">Scheduled</MenuItem>
                  <MenuItem value="In Progress">In Progress</MenuItem>
                  <MenuItem value="Completed">Completed</MenuItem>
                  <MenuItem value="Cancelled">Cancelled</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Notes"
                type="text" 
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <Button variant="outlined" startIcon={<UploadIcon />} fullWidth sx={{ mb: 2 }}>
                Upload Attachments
              </Button>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Visit Notes"
                multiline
                rows={4}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            Schedule Visit
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default ServiceVisits
