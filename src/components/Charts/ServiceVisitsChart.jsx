
import React, { useEffect, useState, useMemo } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { Card, CardContent, Typography, Box, CircularProgress, Alert } from "@mui/material"
// import { serviceVisitsAPI } from "../../services/api"
import { useSelector } from "react-redux"

const ServiceVisitsChart = () => {  
  const serviceVisits = useSelector((state) => state.services)
  // console.log("Service Visits:", serviceVisits);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    setLoading(false);
  },[serviceVisits])

  const chartData = React.useMemo(() => {
    const data = serviceVisits.reduce((acc, visit) => {
      const year = new Date(visit.date).getFullYear();
      const month = new Date(visit.date).toLocaleString('default', { month: 'long' });
      if (!acc[month]) {
        acc[month] = { month };
      }
      acc[month][visit.purpose] = (acc[month][visit.purpose] || 0) + 1;
      return acc;
    }, {});
    console.log(data);

    return Object.values(data).map(item => ({
      ...item,
      Preventive: item.Preventive || 0,
      Breakdown: item.Breakdown || 0,
    }));
    return serviceVisits.map((visit) => {
      const month = new Date(visit.date).toLocaleString('default', { month: 'long' });
      return {
        // year,
        month,
        date: visit.date,
        facilityNPI: visit.facilityNPI,
        nextServiceDate: visit.nextServiceDate,
        purpose: visit.purpose,
      };
    })
  }, [serviceVisits]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
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
            Service Visits by Type & Month
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
            Service Visits by Type & Month
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
          Service Visits by Type & Month
        </Typography>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" angle={-45} textAnchor="end" height={100} fontSize={10} />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="Preventive" stackId="a" fill="#4caf50" />
            <Bar dataKey="Breakdown" stackId="a" fill="#f44336" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

export default ServiceVisitsChart
