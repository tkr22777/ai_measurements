// Simple in-memory key-value store
let store: Record<string, any> = {
  appName: "Mobile Camera App",
  version: "1.0.0",
  lastUpdated: new Date().toISOString(),
  features: ["Photo Capture", "Camera Switching", "Download Images"]
};

export const db = {
  // Get a value by key
  get: (key: string) => {
    return store[key];
  },
  
  // Set a value for a key
  set: (key: string, value: any) => {
    store[key] = value;
    return value;
  },
  
  // Get all values
  getAll: () => {
    return { ...store };
  }
};

// Initialize with some default values if needed
export function initializeDb() {
  if (!store.visitCount) {
    store.visitCount = 0;
  }
}
