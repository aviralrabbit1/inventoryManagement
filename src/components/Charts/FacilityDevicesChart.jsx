import React from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Card, CardContent, Typography, Box } from "@mui/material"
import { useSelector } from "react-redux"

const FacilityDeviceChart = () => {
  const devices = useSelector((state) => state.devices.devices)
  const facilities = useSelector((state) => state.facilities.facilities)

  const chartData = React.useMemo(() => {
    const facilityDeviceCount = devices.reduce(
      (acc, device) => {
        acc[device.facilityName] = (acc[device.facilityName] || 0) + 1
        return acc
      },
      {},
    )

    return facilities
      .map((facility) => ({
        name: facility.name.length > 20 ? facility.name.substring(0, 20) + "..." : facility.name,
        fullName: facility.name,
        deviceCount: facilityDeviceCount[facility.name] || 0,
        type: facility.type,
      }))
      .sort((a, b) => b.deviceCount - a.deviceCount)
  }, [devices, facilities])

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
          <Typography variant="body2">Devices: {data.deviceCount}</Typography>
          <Typography variant="body2">Type: {data.type}</Typography>
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
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} fontSize={10} />
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
