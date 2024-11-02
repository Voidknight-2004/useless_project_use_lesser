import { createContext, useState, useContext } from 'react';

const PointsContext = createContext();

export function PointsProvider({ children }) {
  const [points, setPoints] = useState(0);

  return (
    <PointsContext.Provider value={{ points, setPoints }}>
      {children}
    </PointsContext.Provider>
  );
}

export function usePoints() {
  return useContext(PointsContext);
}