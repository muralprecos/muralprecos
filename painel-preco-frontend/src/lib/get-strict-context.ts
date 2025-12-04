import { createContext, useContext } from "react";

export function getStrictContext<T>(name: string) {
  const Context = createContext<T | undefined>(undefined);

  function useStrictContext() {
    const value = useContext(Context);
    if (!value) {
      throw new Error(`use${name} must be used within ${name}Provider`);
    }
    return value;
  }

  return [Context.Provider, useStrictContext] as const;
}
