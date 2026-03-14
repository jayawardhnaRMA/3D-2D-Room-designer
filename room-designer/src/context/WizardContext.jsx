import { createContext, useContext, useState } from "react";

const WizardContext = createContext(null);

const initialWizardData = {
  roomType: "living-room",
  dimensions: {
    unit: "m",
    length: 4.5,
    width: 3.8,
    height: 2.4,
  },
  shape: "rectangle",
  colors: {
    wall: "#f5f5f3",
    floorMaterial: "wood",
    floorColor: "#5c3a29",
    ceilingColor: "#ffffff",
  },
  lighting: {
    naturalLightDirection: "south",
    timeOfDay: 14,
    fixtures: ["ceiling-light"],
  },
  projectName: "New Living Room Setup",
};

export function WizardProvider({ children }) {
  const [wizardData, setWizardData] = useState(initialWizardData);

  const updateWizardData = (section, value) => {
    setWizardData((prev) => ({
      ...prev,
      [section]:
        typeof value === "function" ? value(prev[section]) : value,
    }));
  };

  const resetWizardData = () => {
    setWizardData(initialWizardData);
  };

  return (
    <WizardContext.Provider
      value={{
        wizardData,
        setWizardData,
        updateWizardData,
        resetWizardData,
      }}
    >
      {children}
    </WizardContext.Provider>
  );
}

export function useWizard() {
  const context = useContext(WizardContext);
  if (!context) {
    throw new Error("useWizard must be used inside WizardProvider");
  }
  return context;
}