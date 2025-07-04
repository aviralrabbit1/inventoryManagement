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

function App() {
//   console.log(facilities);
//   const totalDeviceCount = facilities.reduce((total, facility) => {
//     return total + facility.deviceCount;
// }, 0);
// console.log(`Total deviceCount: ${totalDeviceCount}`);

  return (
    <>
      <Router>
        <Sidebar />
        <Header/>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/inventory" element={<DeviceInventory />} />
          <Route path="/installation" element={<InstallationTraining />} />
          <Route path="/service" element={<ServiceVisits />} />
          <Route path="/amc" element={<AMCTracker />} />
          <Route path="/alerts" element={<Alerts />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
