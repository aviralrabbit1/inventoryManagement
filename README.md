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
bun add @mui/material @emotion/react @emotion/styled @mui/icons-material react-router-dom @reduxjs/toolkit react-redux recharts 
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

<details>
<summary>
2.4 Postgres Database
</summary>
After much pondering and searching, i built a postgres database on [Tonic Fabricate](https://fabricate.tonic.ai/) with this schema (and some tweakings) and build api on top of it.

```sql
-- Create the device types table
CREATE TABLE device_types (
    deviceID VARCHAR(6) PRIMARY KEY CHECK (deviceID GLOB 'DEV00[1-9]' OR deviceID GLOB 'DEV01[0-5]'),
    deviceName VARCHAR(100) NOT NULL UNIQUE
);

-- Create the facilities table
CREATE TABLE facilities (
    facilityNPI VARCHAR(15) PRIMARY KEY,
    facilityID VARCHAR(3) GENERATED ALWAYS AS (SUBSTR(facilityNPI, 1, 3)) STORED NOT NULL,
    facilityName VARCHAR(255) NOT NULL,
    city VARCHAR(100),
    address VARCHAR(255),
    personInCharge VARCHAR(100),
    contactPIC VARCHAR(15),
    emailPIC VARCHAR(100),
    deviceCount INT,
    CONSTRAINT unique_facilityID UNIQUE (facilityID)  -- Ensure facilityID is unique
);

-- Create the devices table
CREATE TABLE devices (
    serialNo VARCHAR(15) PRIMARY KEY,  -- Unique identifier for devices
    deviceID VARCHAR(6) NOT NULL CHECK (deviceID GLOB 'DEV00[1-9]' OR deviceID GLOB 'DEV01[0-5]'),
    facilityNPI VARCHAR(15) REFERENCES facilities(facilityNPI) ON DELETE CASCADE,  -- Link to facilities
    facilityID VARCHAR(3) GENERATED ALWAYS AS (SUBSTR(facilityNPI, 1, 3)) STORED NOT NULL,  -- Auto-generated from NPI
    status VARCHAR(15),
    contractType VARCHAR(3),
    batteryLevel INT CHECK (batteryLevel BETWEEN 0 AND 100),
    installationDate DATE,
    lastServiceDate DATE,
    qrCode VARCHAR(255)
);

-- Create the serviceVisits table
CREATE TABLE serviceVisits (
    id VARCHAR(10) PRIMARY KEY,
    serialNo VARCHAR(15) REFERENCES devices(serialNo) ON DELETE CASCADE,  -- Link to devices
    facilityNPI VARCHAR(15) REFERENCES facilities(facilityNPI) ON DELETE CASCADE,  -- Link to facilities
    facilityID VARCHAR(3) REFERENCES facilities(facilityID) ON DELETE CASCADE,  -- Link to facilities
    date DATE,
    engineer VARCHAR(100),
    purpose VARCHAR(15),  -- Limited to small array of words
    notes TEXT,
    attachments VARCHAR(255),
    nextServiceDate DATE
);

-- Create the contracts table
CREATE TABLE contracts (
    id VARCHAR(10) PRIMARY KEY,
    serialNo VARCHAR(15) REFERENCES devices(serialNo) ON DELETE CASCADE,  -- Link to devices
    contractType VARCHAR(3),  -- This can be a reference to a predefined set of contract types
    startDate DATE,
    expiryDate DATE,
    status VARCHAR(50),
    cost INT CHECK (cost BETWEEN 100 AND 999),
    vendor VARCHAR(100),
    terms TEXT
);
```
</details>
<details>
<summary>
2.5 API
</summary>
I build `api` on top of this postgres database.

```js
api
  // List all facilities
  .get('/facilities')
  // Get a single facility
  .get('/facilities/:id')
  // List all service visits
  .get('/services')
  .get('/services/:id')
  // Get a single service visit by serialNo and facilityNPI (composite key)
  .get('/services/:facilityID/:serialNo')
  // List all devices
  .get('/devices')
  // Get a single device by serialNo
  .get('/devices/:serialNo')
  // List all contracts
  .get('/contracts')
  // Get a single contract by id
  .get('/contracts/:id')
```
</details>

<details>
<summary>
2.6 Localstorage
</summary>

I had trouble with the api_key, so for shortage of time, copied all the generated data from my mock databse in `data` folder, and saved it in `localStorage`.

```js
// localStorageAPI.js
// common skeleton for using in Slice creation for redux store
const createAPI = (storageKey, initialData) => ({
    getAll: () => getFromStorage(storageKey, initialData),
    create: (item) => {
        const items = createAPI(storageKey, initialData).getAll();
        items.push(item);
        saveToStorage(storageKey, items);
        return item;
    },
    update: (id, updatedItem) => {
        const items = createAPI(storageKey, initialData).getAll();
        const index = items.findIndex(i => i.id === id);
        if (index !== -1) {
            items[index] = { ...items[index], ...updatedItem };
            saveToStorage(storageKey, items);
        }
        return updatedItem;
    },
    delete: (id) => {
        const items = createAPI(storageKey, initialData).getAll();
        const filteredItems = items.filter(i => i.id !== id);
        saveToStorage(storageKey, filteredItems);
        return true;
    }
});
// Creating specific APIs for each data type
export const facilityAPI = createAPI(STORAGE_KEYS.FACILITIES, facilities);
export const deviceAPI = createAPI(STORAGE_KEYS.DEVICES, devices);
export const serviceVisitAPI = createAPI(STORAGE_KEYS.SERVICE_VISITS, serviceVisits);
export const contractAPI = createAPI(STORAGE_KEYS.AMC_CONTRACTS, contracts);
```

</details>
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


<details>
<summary>
4. Charts
</summary>
I have used [Recharts](https://recharts.org/en-US) to create the charts.

<details>
<summary>
4.1 Device Status
</summary>
Tells us the data/ratio about how many devices are `online`, `offline` or need `maintainence` by building a pie chart.
All the charts are in `src/components/Charts/` folder.

```js
// DeviceStatusChart.js
const COLORS = { // for respresenting the pie chart
  online: "#4caf50",
  offline: "#f44336",
  maintenance: "#ff9800",
}

const DeviceStatusChart = () => {
  // Fetch devices data from the redux store
  const devicesState = useSelector((state) => state.devices)
  const devices = [...devicesState] // Ensure devices is an array for the chart to work correctly

  const statusData = React.useMemo(() => {
    // Kee track of the status of each device
    let statusCount = {};
    for(const device of devices) {
      if (!device.status) {
        console.warn("Device without status found:", device);
        continue; // Skip devices without a status
      }
      statusCount[device.status] = (statusCount[device.status] || 0) + 1;
    }

    return Object.entries(statusCount).map(([status, count]) => ({
      name: status,
      value: count,
      color: COLORS[status.toLowerCase()],
    }))
  }, [devices])

  ...
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
}

```

</details>

<details>
<summary>
4.2 Facility and Devices Chart
</summary>
It depicts the number of devices in each facilty.

```js
// FacilityDeviceChart.js

const FacilityDeviceChart = () => {
  const devicesData = useSelector((state) => state.devices)
  const facilities = useSelector((state) => state.facilities.facilities)

  const chartData = React.useMemo(() => {
    let facilityDeviceCount = {}

    for(const device of devicesData) {      
        facilityDeviceCount[device.facilityName] = (facilityDeviceCount[device.facilityName] || 0) + 1
    }

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
  ...
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} fontSize={10} />
        <YAxis />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="deviceCount" fill="#2196f3" />
      </BarChart>
    </ResponsiveContainer>
}

```

</details>

</details>