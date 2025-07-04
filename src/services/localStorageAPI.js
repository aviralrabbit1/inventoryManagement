import facilities from "../data/facilities"

const STORAGE_KEYS = {    
    FACILITIES: "facilities",
    INITIALIZED: "initialized",
}

// Initialize localStorage with mock data if not already present
export const initializeLocalStorage = () => {
  const isInitialized = localStorage.getItem(STORAGE_KEYS.INITIALIZED);

  if (!isInitialized) {
    localStorage.setItem(STORAGE_KEYS.FACILITIES, JSON.stringify(facilities))
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

// Facility API
export const facilityAPI = {
  getAll: ()=> getFromStorage(STORAGE_KEYS.FACILITIES, facilities),
  
  create: (facility) => {
    const facilities = facilityAPI.getAll()
    facilities.push(facility)
    saveToStorage(STORAGE_KEYS.FACILITIES, facilities)
    return facility
  },
  
  update: (id, updatedFacility) => {
    const facilities = facilityAPI.getAll()
    const index = facilities.findIndex(f => f.id === id)
    if (index !== -1) {
      facilities[index] = updatedFacility
      saveToStorage(STORAGE_KEYS.FACILITIES, facilities)
    }
    return updatedFacility
  },
  
  delete: (id) => {
    const facilities = facilityAPI.getAll()
    const filteredFacilities = facilities.filter(f => f.id !== id)
    saveToStorage(STORAGE_KEYS.FACILITIES, filteredFacilities)
    return true
  }
}