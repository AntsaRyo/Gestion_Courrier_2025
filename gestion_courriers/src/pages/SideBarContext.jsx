import React, { createContext, useState, useEffect } from "react";

export const SidebarContext = createContext();

export const SidebarProvider = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    const saved = localStorage.getItem("sidebarOpen");
    return saved ? JSON.parse(saved) : true;
  });

  useEffect(() => {
    localStorage.setItem("sidebarOpen", JSON.stringify(sidebarOpen));
  }, [sidebarOpen]);

  return (
    <SidebarContext.Provider value={{ sidebarOpen, setSidebarOpen }}>
      {children}
    </SidebarContext.Provider>
  );
};
