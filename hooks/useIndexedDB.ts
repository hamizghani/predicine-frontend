"use client";

import { useState, useEffect, useCallback } from "react";

// Define the generic type for any object store.
interface DBItem {
  id?: number; // Auto-incremented primary key.
  [key: string]: any;
}

const DB_NAME = "predicine";
const VERSION = 1;

const openDB = (stores: string[]): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") return reject("IndexedDB not available");

    const request = indexedDB.open(DB_NAME, VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      stores.forEach((store) => {
        if (!db.objectStoreNames.contains(store)) {
          db.createObjectStore(store, { keyPath: "id", autoIncrement: true });
        }
      });
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

// Global listeners registry.
const globalListeners: Record<string, Set<() => void>> = {};

// Trigger update for all hook instances using the same store.
const triggerGlobalUpdate = (storeName: string) => {
  if (globalListeners[storeName]) {
    globalListeners[storeName].forEach((listener) => listener());
  }
};

export const useIndexedDB = <T extends DBItem>(storeName: string) => {
  const [items, setItems] = useState<T[]>([]);

  // Fetch items from the database.
  const fetchItems = useCallback(async () => {
    const db = await openDB([storeName]);
    const tx = db.transaction(storeName, "readonly");
    const store = tx.objectStore(storeName);
    const request = store.getAll();
    request.onsuccess = () => {
      setItems(request.result as T[]);
    };
  }, [storeName]);

  // Subscribe to global updates.
  useEffect(() => {
    // Create the listener function.
    const listener = () => {
      fetchItems();
    };

    // Initialize the set if it doesn't exist.
    if (!globalListeners[storeName]) {
      globalListeners[storeName] = new Set();
    }
    globalListeners[storeName].add(listener);

    // Fetch items initially.
    fetchItems();

    // Cleanup: remove the listener when the component unmounts.
    return () => {
      globalListeners[storeName].delete(listener);
    };
  }, [storeName, fetchItems]);

  // Helper: wait for transaction to complete.
  const awaitTxComplete = (tx: IDBTransaction) =>
    new Promise<void>((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
      tx.onabort = () => reject(tx.error);
    });

  const addItem = async (item: Omit<T, "id">) => {
    const db = await openDB([storeName]);
    const tx = db.transaction(storeName, "readwrite");
    const store = tx.objectStore(storeName);
    store.add(item);
    await awaitTxComplete(tx);
    triggerGlobalUpdate(storeName); // Notify all listeners.
  };

  const updateItem = async (updatedItem: T) => {
    if (!updatedItem.id) return;
    const db = await openDB([storeName]);
    const tx = db.transaction(storeName, "readwrite");
    const store = tx.objectStore(storeName);
    store.put(updatedItem);
    await awaitTxComplete(tx);
    triggerGlobalUpdate(storeName); // Notify all listeners.
  };

  const deleteItem = async (id: number) => {
    const db = await openDB([storeName]);
    const tx = db.transaction(storeName, "readwrite");
    const store = tx.objectStore(storeName);
    store.delete(id);
    await awaitTxComplete(tx);
    triggerGlobalUpdate(storeName); // Notify all listeners.
  };

  return { items, addItem, updateItem, deleteItem };
};
