import { useEffect, useState } from "react";

export function useLocalStorage<T>(key: string, fallbackValue: T) {
  const [value, setValue] = useState(fallbackValue);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(key);

      if (stored === null) {
        setValue(fallbackValue);
      } else {
        if (typeof fallbackValue === "string" || fallbackValue === null) {
          setValue(stored as T);
        } else {
          try {
            const parsed = JSON.parse(stored) as T;
            setValue(parsed);
          } catch (parseError) {
            console.error(
              `useLocalStorage [${key}]. JSON parse failed, using fallback:`,
              parseError
            );
            setValue(fallbackValue);
          }
        }
      }
    } catch (error) {
      console.error(
        `useLocalStorage [${key}]. Error reading from localStorage:`,
        error
      );
      setValue(fallbackValue);
    } finally {
      setIsHydrated(true);
      console.log(`useLocalStorage [${key}]. Hydration complete`);
    }
  }, [key]);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    try {
      if (value === null || value === undefined) {
        localStorage.removeItem(key);
        console.log(`useLocalStorage [${key}]. Removed from localStorage`);
      } else {
        const valueToStore =
          typeof value === "string" ? value : JSON.stringify(value);
        localStorage.setItem(key, valueToStore);
        console.log(
          `useLocalStorage [${key}]. Saved to localStorage successfully`
        );
      }
    } catch (error) {
      console.error(
        `useLocalStorage [${key}]. Error saving to localStorage:`,
        error
      );
    }
  }, [key, value, isHydrated]);

  return [value, setValue, isHydrated] as const;
}
