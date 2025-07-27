import React, { useEffect, useState } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend } from "recharts"
import { Card, CardContent, Typography, Box, CircularProgress, Alert } from "@mui/material"
import { useSelector } from "react-redux"

const AMCExpiryChart = () => {
  const amcExpiry = useSelector((state) => state.contracts);
  // console.log(amcExpiry);

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (amcExpiry) {
      setLoading(false);
    }
  },[amcExpiry])

  const chartData = React.useMemo(() => {
    const data = amcExpiry.reduce((acc, contract) => {
      const year = new Date(contract.expiryDate).getFullYear();
      const month = new Date(contract.expiryDate).toLocaleString('default', { month: 'long' }) + ' ' + year;
      const daysUntilExpiry = Math.ceil((new Date(contract.expiryDate) - new Date()) / (1000 * 60 * 60 * 24));
      if (!acc[month]) {
        acc[month] = { month };
      }
      // accumulate the devices expiring data
      acc[month][contract.contractType] = (acc[month][contract.contractType] || 0) + 1;
      // acc[month][contract.daysUntilExpiry] = (daysUntilExpiry >0)? daysUntilExpiry: 0;
      // console.log("acc: ", acc, typeof acc);
      return acc;
      
    }, {});
    // console.log(data);
    
    return Object.values(data).map(item => ({
      ...item,
      contractType: item.contractType,
    })).sort((a, b) => new Date(a.month) - new Date(b.month));
  }, [amcExpiry]);
  
  // console.log(chartData);
  // TODO: Add logic to color the bars based on days until expiry
  // const getBarColor = (daysUntilExpiry) => {
  //   if (daysUntilExpiry < 0) return "#f44336" // Expired - Red
  //   if (daysUntilExpiry <= 90) return "#ff9800" // Expiring Soon - Orange
  //   if (daysUntilExpiry <= 150) return "#ffc107" // Warning - Yellow
  //   return "#4caf50" // Active - Green
  // }

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
            {label}
          </Typography>
          {payload.map((entry, index) => (
            <Typography key={index} variant="body2" sx={{ color: entry.color }}>
              {entry.dataKey}: {entry.value}
            </Typography>
          ))}
        </Box>
      )
    }
    return null
  }

  if (loading) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            AMC Contract Expiry Timeline
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: 300 }}>
            <CircularProgress />
          </Box>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            AMC Contract Expiry Timeline
          </Typography>
          <Alert severity="error">{error}</Alert>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          AMC Contract Expiry Timeline
        </Typography>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={chartData} >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" angle={-45} textAnchor="end" height={100} fontSize={10} />
            {/* <XAxis type="number" /> */}
            <YAxis type="number" fontSize={10} />
            <Tooltip content={<CustomTooltip />} />
            {/* <Bar dataKey="daysUntilExpiry">
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getBarColor(entry.daysUntilExpiry)} />
              ))}
              
            </Bar> */}
            <Legend />
            
            <Bar dataKey="amc" stackId="a" fill="#4caf50" />
            <Bar dataKey="cmc" stackId="a" fill="#ff9800" />
                      
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

export default AMCExpiryChart
