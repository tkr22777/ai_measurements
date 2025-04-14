// Simple in-memory key-value store
let store: Record<string, any> = {
  appName: "Mobile Camera App",
  version: "1.0.0",
  lastUpdated: new Date().toISOString(),
  features: ["Photo Capture", "Camera Switching", "Download Images"],
  photoCount: 0
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

// Export the function with the expected name to fix the build error
export async function getAllValues() {
  // Simulate an async operation to make this more realistic
  await new Promise(resolve => setTimeout(resolve, 50));
  return { ...store };
}

// Initialize with some default values if needed
export function initializeDb() {
  if (!store.visitCount) {
    store.visitCount = 0;
  }
}
