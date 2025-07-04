import React from 'react'
import AMCExpiryChart from '../components/Charts/AMCExpiryChart.jsx';
import DeviceStatusChart from '../components/Charts/DeviceStatusChart.jsx';
import FacilityDevicesChart from '../components/Charts/FacilityDevicesChart.jsx';
import ServiceVisitsChart from '../components/Charts/ServiceVisitsChart.jsx';
import BatteryLevelChart from '../components/Charts/BatteryLevelChart.jsx';

const Dashboard = () => {
  return (
    <>
    <h1>
      Dashboard
    </h1>
    {/* Chart Section */}
    <div className="charts-container">      
      <AMCExpiryChart />
      <DeviceStatusChart />
      <FacilityDevicesChart />
      <ServiceVisitsChart />
      <BatteryLevelChart />
    </div>
    </>
  )
}

export default Dashboard