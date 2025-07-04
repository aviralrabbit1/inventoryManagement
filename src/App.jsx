import { useState } from 'react'
import './App.css'
import facilities from '../backend/Facilities.js'
import Sidebar from './components/Layout/Sidebar.jsx'
import Header from './components/Layout/Header.jsx'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard.jsx'
import DeviceInventory from './pages/DeviceInventory.jsx'
import InstallationTraining from './pages/InstallationTraining.jsx'
import ServiceVisits from './pages/ServiceVisits.jsx';
import AMCTracker from './pages/AMCTracker.jsx';
import Alerts from './pages/Alerts.jsx';
import { Box, ThemeProvider, createTheme } from "@mui/material";
import Main from './components/Layout/Main.jsx'

function App() {
//   console.log(facilities);
//   const totalDeviceCount = facilities.reduce((total, facility) => {
//     return total + facility.deviceCount;
// }, 0);
// console.log(`Total deviceCount: ${totalDeviceCount}`);
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [darkMode, setDarkMode] = useState(false)
  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
      primary: {
        main: "#1976d2",
      },
      secondary: {
        main: "#dc004e",
      },
    },
  })

  return (
    <Router>
      <ThemeProvider theme={theme}>
        <Box sx={{ display: "flex", minHeight: "100vh" }}>
          <Sidebar open={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
          <Main open={sidebarOpen} sx={{ display: "flex", flexDirection: "column" }}>
            <Header
              open={sidebarOpen}
              onMenuClick={() => setSidebarOpen(!sidebarOpen)}
              darkMode={darkMode}
              onThemeToggle={() => setDarkMode(!darkMode)}
            />
            <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/inventory" element={<DeviceInventory />} />
                <Route path="/installation" element={<InstallationTraining />} />
                <Route path="/service" element={<ServiceVisits />} />
                <Route path="/amc" element={<AMCTracker />} />
                <Route path="/alerts" element={<Alerts />} />
              </Routes>
            </Box>
          </Main>
        </Box>
      </ThemeProvider>
    </Router>
  )
}

export default App
