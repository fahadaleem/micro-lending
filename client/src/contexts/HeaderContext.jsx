import React, { createContext, useContext, useState, useCallback } from "react";

const HeaderContext = createContext(null);

export function HeaderProvider({ children }) {
  const [options, setOptions] = useState({
    title: null,
    actionLabel: null,
    onAction: null,
    showAction: false,
    disabled: false,
    tooltip: null,
  });

  const setHeader = useCallback((opts = {}) => {
    setOptions((prev) => ({ ...prev, ...opts }));
  }, []);

  const resetHeader = useCallback(() => {
    setOptions({
      title: null,
      actionLabel: null,
      onAction: null,
      showAction: false,
      disabled: false,
      tooltip: null,
    });
  }, []);

  return (
    <HeaderContext.Provider value={{ options, setHeader, resetHeader }}>
      {children}
    </HeaderContext.Provider>
  );
}

export function useHeader() {
  const ctx = useContext(HeaderContext);
  if (!ctx) throw new Error("useHeader must be used within a HeaderProvider");
  return ctx;
}

export default HeaderContext;
