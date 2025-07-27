import React from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Card, CardContent, Typography, Box } from "@mui/material"
import { useSelector } from "react-redux"

const FacilityDeviceChart = () => {
  const devicesData = useSelector((state) => state.devices)
  // console.log('devicesData: ', devicesData, typeof devicesData);
  const facilities = useSelector((state) => state.facilities.facilities)
  // console.log('facilities: ', facilities, typeof facilities);

  const chartData = React.useMemo(() => {
    let facilityDeviceCount = {}

    for(const device of devicesData) {      
        facilityDeviceCount[device.facilityName] = (facilityDeviceCount[device.facilityName] || 0) + 1
    }
    // console.log('facilityDeviceCount: ', facilityDeviceCount); // 100

    return facilities
      .map((facility) => ({
        name: facility.facilityName.length > 20 ? facility.facilityName.substring(0, 15) + "..." : facility.facilityName,
        fullName: facility.facilityName,
        city: facility.city,
        npi: facility.facilityNPI,
        deviceCount: facility.deviceCount || 0,
      }))
      .sort((a, b) => b.id - a.id) // Sort by what you want, e.g., deviceCount
  }, [devicesData, facilities])

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <Box
          sx={{
            bgcolor: "background.paper",
            p: 2,
            border: 1,
            borderColor: "divider",
            borderRadius: 1,
            boxShadow: 2,
          }}
        >
          <Typography variant="subtitle2" gutterBottom>
            {data.fullName}
          </Typography>
          <Typography variant="body2">City: {data.city}</Typography>
          <Typography variant="body2">FacilityNPI: {data.npi}</Typography>
          <Typography variant="body2">Devices: {data.deviceCount}</Typography>
        </Box>
      )
    }
    return null
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Devices per Facility
        </Typography>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} fontSize={10} />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="deviceCount" fill="#2196f3" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

export default FacilityDeviceChart
