import { useState, useEffect } from 'react';

function getSavedValue(key: string, initialValue: any) {
  if (typeof window === "undefined") return typeof initialValue === "function" ? (initialValue as Function)() : initialValue;
  const jsonValue = localStorage.getItem(key)
  if (jsonValue != null) return JSON.parse(jsonValue)
  if (initialValue instanceof Function) return initialValue()
  return initialValue
}


export default function useLocalStorage(key: string, initialValue?: any) {
  const [value, setValue] = useState(() => {
    return getSavedValue(key, initialValue)
  })

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value))
  }, [value])

  return [value, setValue]
}
