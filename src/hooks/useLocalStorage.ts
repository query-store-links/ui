import { useState } from 'react';

type SetValue<T> = (value: T | ((prev: T) => T)) => void;

export function useLocalStorage<T>(key: string, defaultValue: T | (() => T)): [T, SetValue<T>] {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw !== null) {
        return JSON.parse(raw) as T;
      }
    } catch { }
    return typeof defaultValue === 'function'
      ? (defaultValue as () => T)()
      : defaultValue;
  });

  const setAndStore: SetValue<T> = (newValue) => {
    const valueToStore = typeof newValue === 'function'
      ? (newValue as (prev: T) => T)(value)
      : newValue;
    setValue(valueToStore);
    localStorage.setItem(key, JSON.stringify(valueToStore));
  };

  return [value, setAndStore];
}
