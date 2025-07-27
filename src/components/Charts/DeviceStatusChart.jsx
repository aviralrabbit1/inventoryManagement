import React from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { Card, CardContent, Typography, Box } from "@mui/material"
import { useSelector } from "react-redux"

const COLORS = {
  online: "#4caf50",
  offline: "#f44336",
  maintenance: "#ff9800",
}

const DeviceStatusChart = () => {
  const devicesState = useSelector((state) => state.devices)
  const devices = [...devicesState] // Ensure devices is an array for the chart to work correctly
  // console.log("Devices:", devices, typeof devices)

  const statusData = React.useMemo(() => {
    let statusCount = {};
    for(const device of devices) {
      if (!device.status) {
        console.warn("Device without status found:", device);
        continue; // Skip devices without a status
      }
      statusCount[device.status] = (statusCount[device.status] || 0) + 1;
    }
    // const statusCount = devices.reduce(
    //   (acc, device) => {
    //     acc[device.status] = (acc[device.status] || 0) + 1;
    //     // console.log("Device status:", device.status, "Count:", acc[device.status]);
    //     // console.log("Current accumulator:", acc);
    //     return acc
    //   },
    //   {},
    // )
    // console.log("Status count:", statusCount);
    // console.log("Object entries" ,Object.entries(statusCount));

    return Object.entries(statusCount).map(([status, count]) => ({
      name: status,
      value: count,
      color: COLORS[status.toLowerCase()],
    }))
  }, [devices])

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0]
      return (
        <Box
          sx={{
            bgcolor: "background.paper",
            p: 1,
            border: 1,
            borderColor: "divider",
            borderRadius: 1,
            boxShadow: 2,
          }}
        >
          <Typography variant="body2">
            {data.name}: {data.value} devices
          </Typography>
        </Box>
      )
    }
    return null
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Device Status Distribution
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={statusData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {statusData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

export default DeviceStatusChart
