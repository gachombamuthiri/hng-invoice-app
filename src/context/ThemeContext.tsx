import React, { createContext, useContext, useEffect, useState } from 'react';
import { storage } from '../utils/storage';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Initialize theme before rendering to prevent flash
const initializeTheme = (): Theme => {
  const savedTheme = storage.getTheme();
  const htmlElement = document.documentElement;
  
  if (savedTheme === 'dark') {
    htmlElement.classList.add('dark');
  } else {
    htmlElement.classList.remove('dark');
  }
  
  return savedTheme;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => initializeTheme());

  useEffect(() => {
    const htmlElement = document.documentElement;
    
    if (theme === 'dark') {
      htmlElement.classList.add('dark');
    } else {
      htmlElement.classList.remove('dark');
    }
    
    storage.setTheme(theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
