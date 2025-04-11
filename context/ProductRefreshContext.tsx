// context/ProductRefreshContext.tsx
"use client";
import { createContext, useContext, useState } from "react";

const ProductRefreshContext = createContext({
  trigger: 0,
  refetch: () => {},
});

export const useProductRefresh = () => useContext(ProductRefreshContext);

export const ProductRefreshProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [trigger, setTrigger] = useState(0);
  const refetch = () => setTrigger((prev) => prev + 1);

  return (
    <ProductRefreshContext.Provider value={{ trigger, refetch }}>
      {children}
    </ProductRefreshContext.Provider>
  );
};
