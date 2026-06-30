import { createContext, useContext, useMemo, useState } from "react";

const WorkspaceContext = createContext(null);

export const WorkspaceProvider = ({ children }) => {
  const [workspace, setWorkspace] = useState(null);

  const clearWorkspace = () => {
    setWorkspace(null);
  };

  const value = useMemo(
    () => ({
      workspace,
      setWorkspace,
      clearWorkspace,
    }),
    [workspace]
  );

  return (
    <WorkspaceContext.Provider value={value}>
      {children}
    </WorkspaceContext.Provider>
  );
};

export const useWorkspace = () => {
  const context = useContext(WorkspaceContext);

  if (!context) {
    throw new Error(
      "useWorkspace must be used inside WorkspaceProvider."
    );
  }

  return context;
};