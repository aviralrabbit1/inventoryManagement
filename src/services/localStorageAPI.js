import facilities from "../data/facilities"
import devices from "../data/devices"
import serviceVisits from "../data/serviceVisits"
import contracts from "../data/Contracts"

const STORAGE_KEYS = {    
    DEVICES: "devices",
    FACILITIES: "facilities",
    SERVICE_VISITS: "service_visits",
    CONTRACTS: "contracts",
    ALERTS: "alerts",
    INSTALLATION_RECORDS: "installation_records",
    INITIALIZED: "initialized",
}

// Initialize localStorage with mock data if not already present
export const initializeLocalStorage = () => {
  const isInitialized = localStorage.getItem(STORAGE_KEYS.INITIALIZED);

  if (!isInitialized) {
    localStorage.setItem(STORAGE_KEYS.FACILITIES, JSON.stringify(facilities))
    localStorage.setItem(STORAGE_KEYS.DEVICES, JSON.stringify(devices))
    localStorage.setItem(STORAGE_KEYS.CONTRACTS, JSON.stringify(contracts))
    localStorage.setItem(STORAGE_KEYS.SERVICE_VISITS, JSON.stringify(serviceVisits))
    localStorage.setItem(STORAGE_KEYS.INITIALIZED, "true")
  }
}

// localStorage operations
const getFromStorage = (key, defaultValue) => {
  try {
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : defaultValue
  } catch (error) {
    console.error(`Error reading from localStorage key ${key}:`, error)
    return defaultValue
  }
}

const saveToStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSO(data))
  } catch (error) {
    console.error(`Error saving to localStorage key ${key}:`, error)
  }
}

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