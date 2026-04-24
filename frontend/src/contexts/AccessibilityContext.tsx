import React, { createContext, useContext, useState, useEffect } from 'react';

interface AccessibilityContextType {
  highContrast: boolean;
  setHighContrast: (value: boolean) => void;
  reduceMotion: boolean;
  setReduceMotion: (value: boolean) => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const AccessibilityProvider = ({ children }: { children: React.ReactNode }) => {
  const [highContrast, setHighContrast] = useState(() => 
    localStorage.getItem('highContrast') === 'true'
  );
  const [reduceMotion, setReduceMotion] = useState(() => 
    localStorage.getItem('reduceMotion') === 'true'
  );

  useEffect(() => {
    // Apply high contrast to the root element
    if (highContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
    localStorage.setItem('highContrast', String(highContrast));
  }, [highContrast]);

  useEffect(() => {
    // Apply reduce motion to the root element
    if (reduceMotion) {
      document.documentElement.classList.add('reduce-motion');
    } else {
      document.documentElement.classList.remove('reduce-motion');
    }
    localStorage.setItem('reduceMotion', String(reduceMotion));
  }, [reduceMotion]);

  return (
    <AccessibilityContext.Provider value={{ highContrast, setHighContrast, reduceMotion, setReduceMotion }}>
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};
