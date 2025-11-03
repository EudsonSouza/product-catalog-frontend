import { useState } from 'react';

const isServer = (): boolean => typeof window === 'undefined';

const logStorageError = (operation: string, key: string, error: unknown): void => {
  console.error(`Error ${operation} localStorage key "${key}":`, error);
};

const safeGetItem = (key: string): string | null => {
  if (isServer()) return null;

  try {
    return window.localStorage.getItem(key);
  } catch (error) {
    logStorageError('reading', key, error);
    return null;
  }
};

const safeSetItem = (key: string, value: string): void => {
  if (isServer()) return;

  try {
    window.localStorage.setItem(key, value);
  } catch (error) {
    logStorageError('setting', key, error);
  }
};

const safeRemoveItem = (key: string): void => {
  if (isServer()) return;

  try {
    window.localStorage.removeItem(key);
  } catch (error) {
    logStorageError('removing', key, error);
  }
};

const parseStoredValue = <T>(item: string | null, fallback: T): T => {
  if (!item) return fallback;

  try {
    return JSON.parse(item) as T;
  } catch (error) {
    console.error('Error parsing stored value:', error);
    return fallback;
  }
};

/**
 * Persists state in localStorage with automatic syncing
 *
 * @param key - localStorage key
 * @param initialValue - Initial value if key doesn't exist
 * @returns Tuple of [value, setValue, removeValue]
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T) => void, () => void] {
  const [state, setState] = useState<T>(() => {
    const item = safeGetItem(key);
    return parseStoredValue(item, initialValue);
  });

  const updateValue = (value: T): void => {
    setState(value);
    safeSetItem(key, JSON.stringify(value));
  };

  const removeValue = (): void => {
    setState(initialValue);
    safeRemoveItem(key);
  };

  return [state, updateValue, removeValue];
}
