import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Theme } from '../types';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('railway-theme') as Theme;
    return savedTheme || 'light';
  });

  useEffect(() => {
    localStorage.setItem('railway-theme', theme);
    
    // Apply theme to document
    const root = document.documentElement;
    const body = document.body;
    
    // Remove all theme classes
    root.classList.remove('light', 'dark', 'high-contrast');
    body.classList.remove('light', 'dark', 'high-contrast');
    
    // Add current theme class
    root.classList.add(theme);
    body.classList.add(theme);
    
    // Set data attribute for additional styling
    root.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};