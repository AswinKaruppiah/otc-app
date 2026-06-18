// In-memory store fallback for development before a native build completes
const memoryStore = new Map();
const listeners = new Set();
let tokenCache = null;

let SecureStore = null;
try {
  SecureStore = require("expo-secure-store");
} catch (e) {
  console.warn(
    "ExpoSecureStore native module is not compiled in the current native build. Using fallback in-memory storage. Run 'npx expo run:android' or 'npx expo run:ios' to compile the native module."
  );
}

export function subscribeToToken(listener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getTokenSync() {
  return tokenCache || memoryStore.get("accessToken") || null;
}

function notifyListeners(key) {
  if (key === "accessToken") {
    listeners.forEach((l) => l());
  }
}

/**
 * Safely sets an item in SecureStore or falls back to in-memory store.
 */
export async function setItemAsync(key, value) {
  if (key === "accessToken") {
    tokenCache = value;
  }
  if (SecureStore && typeof SecureStore.setItemAsync === "function") {
    try {
      await SecureStore.setItemAsync(key, value);
      notifyListeners(key);
      return;
    } catch (e) {
      console.error("SecureStore.setItemAsync failed:", e);
    }
  }
  memoryStore.set(key, value);
  notifyListeners(key);
}

/**
 * Safely retrieves an item from SecureStore or falls back to in-memory store.
 */
export async function getItemAsync(key) {
  let val = null;
  if (SecureStore && typeof SecureStore.getItemAsync === "function") {
    try {
      val = await SecureStore.getItemAsync(key);
    } catch (e) {
      console.error("SecureStore.getItemAsync failed:", e);
    }
  } else {
    val = memoryStore.get(key) || null;
  }
  if (key === "accessToken" && val) {
    tokenCache = val;
  }
  return val;
}

/**
 * Safely deletes an item from SecureStore or falls back to in-memory store.
 */
export async function deleteItemAsync(key) {
  if (key === "accessToken") {
    tokenCache = null;
  }
  if (SecureStore && typeof SecureStore.deleteItemAsync === "function") {
    try {
      await SecureStore.deleteItemAsync(key);
      notifyListeners(key);
      return;
    } catch (e) {
      console.error("SecureStore.deleteItemAsync failed:", e);
    }
  }
  memoryStore.delete(key);
  notifyListeners(key);
}
