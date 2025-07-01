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

I used [Mockaroo](https://mockaroo.com/) for generating mock data, which fortunately contained US hospitals data

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
</details>