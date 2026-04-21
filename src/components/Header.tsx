import React from 'react';
import { Moon, Sun, Plus } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { Link } from 'react-router-dom';

export const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link
            to="/"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              💼 Invoice Manager
            </h1>
          </Link>

          <div className="flex items-center gap-4">
            <Link to="/invoices/new">
              <button className="btn-primary flex items-center gap-2">
                <Plus size={20} />
                <span className="hidden sm:inline">New Invoice</span>
                <span className="sm:hidden">New</span>
              </button>
            </Link>

            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? (
                <Moon size={20} className="text-gray-700" />
              ) : (
                <Sun size={20} className="text-yellow-400" />
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
