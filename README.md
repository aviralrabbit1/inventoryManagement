# Inventory Management

<details>
<summary>
1. Initialise your project
</summary>

1.1 Bootstrap your project

```sh
bun create vite@latest
```
I chose react, javascript-swc.

1.2 Install additionally required packages and dependencies (I kept adding as i went on about building the project)- 

```sh
bun add @mui/material @emotion/react @emotion/styled @mui/icons-material react-router-dom @reduxjs/toolkit react-redux
```

</details>

<details>
<summary>
2. Generate Mock data for the site
</summary>

I used [Mockaroo](https://mockaroo.com/) for generating mock data, which fortunately contained US hospitals data. I also used [Supabase](https://supabase.com/) to create a public database table with the mock data.

Schema: 
```
A postgreSQL schema with example
devices = {"deviceType":"Infusion pump","deviceID":"DEV08","serialNo":"4879338850","deviceLocationWard":"Operating Room","facilityID":"1861678757","status":"Offline","batteryLevel":11,"installationDate":"18/12/2023","lastServiceDate":"18/10/2024","amcExpiryDate":"15/06/2025"}

const facilities = [{"facilityNPI":"1558573386","facilityName":"MERCY HOSPITAL SPRINGFIELD","facilityType":"Hospital","city":"SPRINGFIELD","address":"1235 E CHEROKEE ST ","personInCharge":"Law Moysey","contactPIC":"554-14-8011","emailPIC":"lmoysey0@china.com.cn","deviceCount":22}]

serviceVisits = {"id":"SV01","deviceID":"DEV0[1-15]","serialNo":"2699738387","facilityNPI":"1124266762","date":"21/03/2025","engineer":"Derrik Leggis","purpose":"Preventive","notes":"Electrode connections cleaned.","attachments":"service_report_001.pdf","nextServiceDate":"16/08/2025"}

amcContract = {
    id: "AMC001",
    deviceId: "DEV001",
    serialNo: 2699738387,
    deviceName: "VentMax Pro 3000",
    "facilityNPI":"1124266762",
    contractType: "AMC",
    startDate: "2023-06-01",
    endDate: "2024-06-01",
    status: "Active",
    cost: 12000,
    vendor: "MedTech Solutions Inc.", \\ taken from an array of vendors
    terms: "Quarterly maintenance visits, 24/7 emergency support, parts replacement included",
  }

facilitiesNPI is a foreign key from facilities to visits, amcContract and devices
serialNo is foreign key from devices to serviceVisits, amcContract
deviceID is foreign key from devices to amcContract, 
```

<details>
<summary>
2.1 Facilities
</summary>
<img src="backend\Facilities data fields.PNG">
</details>

<details>
<summary>
2.2 Devices
</summary>

I took 15 device types => `[X-ray machine, Ultrasound machine, MRI machine, CT scanner, Defibrillator, Ventilator, EKG machine, Infusion pump, Anesthesia machine, Blood pressure monitor, Pulse oximeter, Surgical laser, Autoclave, Electrocardiograph, Nebulizer]`

Distributed in 10 different wards => `[Emergency Room, Intensive Care Unit, Operating Room, Pediatrics Ward, Cardiology Ward, Radiology Department, Labor and Delivery, Neurology Ward, Orthopedics Ward, Oncology Ward]`

<img src="backend/Devicedistribution in wards.PNG">

And these are the device details/fields, each `deviceType` pertaining to a unique `deviceID` -

<img src="backend/Device data fields.PNG">

According to my mock data of `facilities` - 100 in number, which had `number of devices` ranging from 7 to 44 which i set on a whim, the total number of devices came to be `2505`, but the limit on `Mockaroo` is max 1000 free rows.

```js
const totalDeviceCount = facilities.reduce((total, facility) => {
    return total + facility.deviceCount;
}, 0);
console.log(`Total deviceCount: ${totalDeviceCount}`); //2505
```

</details>

<details>
<summary>
2.3 Service Visits
</summary>
<img src="backend\Facilities data fields.PNG">

Notes and attachment field values are taken randomly from -

```js
const Notes = [
All systems functioning normally., 
Replaced air filters and calibrated sensors.,
Display flickering issue reported., 
Investigating potential LCD panel failure., 
Ordered replacement parts.,
Battery test passed. Electrode pads checked and replaced.,
Device not powering on. Suspected power supply failure. Scheduled for emergency repair.,
New software update installed. System recalibrated. Staff training provided on new features.,
Electrode connections cleaned., 
Software updated to latest version.,
Gas flow irregularities reported. Requires immediate attention before next surgery.]

const attachments = ["service_report_001.pdf", "maintenance_report_001.pdf", "calibration_cert_001.pdf", "installation_guide_001.pdf", "training_materials_001.pdf", "battery_test_001.pdf","diagnostic_report_001.pdf"]
```
</details>

</details>

<details>
<summary>
3. Routing
</summary>

Set up basic routing in `App.jsx` and Charts/Analytics in `Dashboard.jsx`.

```js
// App.jsx
<Routes>
  <Route path="/" element={<Dashboard />} />
  <Route path="/inventory" element={<DeviceInventory />} />
  <Route path="/installation" element={<InstallationTraining />} />
  <Route path="/service" element={<ServiceVisits />} />
  <Route path="/amc" element={<AMCTracker />} />
  <Route path="/alerts" element={<Alerts />} />
</Routes>
```

```js
// Dashboard.jsx
<div className="charts-container">      
  <AMCExpiryChart />
  <DeviceStatusChart />
  <FacilityDevicesChart />
  <ServiceVisitsChart />
  <BatteryLevelChart />
</div>
```

```js
// Sidebar.jsx
const menuItems = [
  { text: "Dashboard", icon: DashboardIcon, path: "/" },
  { text: "Device Inventory", icon: InventoryIcon, path: "/inventory" },
  { text: "Installation & Training", icon: BuildIcon, path: "/installation" },
  { text: "Service Visits", icon: AssignmentIcon, path: "/service" },
  { text: "AMC/CMC Tracker", icon: DescriptionIcon, path: "/amc" },
  { text: "Alerts & Photos", icon: WarningIcon, path: "/alerts" },
]

<Drawer>
  <List>
    {menuItems.map((item) => (
      <ListItem key={item.text} disablePadding>
        <ListItemButton selected={location.pathname === item.path} onClick={() => navigate(item.path)}>
          <ListItemIcon>
            <item.icon />
          </ListItemIcon>
          <ListItemText primary={item.text} />
        </ListItemButton>
      </ListItem>
    ))}
  </List>
</Drawer>
```

</details>

