import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.js';
import { Menu, X, User as UserIcon, Calendar, Shield, LogOut, Activity } from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  onNavigate: (tab: string, param?: any) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onNavigate }) => {
  const { user, isAdmin, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'tests', label: 'Tests' },
    { id: 'bookings', label: 'Bookings' },
    { id: 'about', label: 'About' },
    { id: 'contact', label: 'Contact' },
  ];

  const handleNavClick = (tabId: string) => {
    onNavigate(tabId);
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Zone 1: Single-element Brand Wordmark */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2 group cursor-pointer text-left focus-visible:outline-teal-600 rounded-md p-1"
          >
            <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center text-white shadow-xs group-hover:bg-teal-700 transition-colors">
              <Activity className="w-5 h-5" />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-slate-900 group-hover:text-teal-700 transition-colors">
              MediLab
            </span>
          </button>

          {/* Zone 2: 4-6 Clean Text Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
            {navLinks.map((link) => {
              const isActive = currentTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`transition-colors cursor-pointer py-1 border-b-2 ${
                    isActive
                      ? 'text-teal-700 border-teal-600 font-bold'
                      : 'border-transparent hover:text-slate-900 hover:border-slate-300'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
            {isAdmin && (
              <button
                onClick={() => handleNavClick('admin')}
                className={`transition-colors cursor-pointer py-1 border-b-2 flex items-center gap-1.5 ${
                  currentTab === 'admin'
                    ? 'text-indigo-700 border-indigo-600 font-bold'
                    : 'border-transparent text-indigo-600 hover:text-indigo-900'
                }`}
              >
                <Shield className="w-4 h-4" />
                <span>Admin Console</span>
              </button>
            )}
          </nav>

          {/* Zone 3: 1-2 Primary Actions / Profile */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer text-xs font-semibold text-slate-800"
                >
                  <div className="w-6 h-6 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-xs">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="max-w-[120px] truncate">{user.name.split(' ')[0]}</span>
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 text-xs z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                    <div className="px-3.5 py-2 border-b border-slate-100">
                      <p className="font-semibold text-slate-900 truncate">{user.name}</p>
                      <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                    </div>

                    <button
                      onClick={() => handleNavClick('dashboard')}
                      className="w-full text-left px-3.5 py-2 hover:bg-slate-50 flex items-center gap-2 text-slate-700 cursor-pointer"
                    >
                      <Calendar className="w-4 h-4 text-teal-600" />
                      <span>My Bookings Dashboard</span>
                    </button>

                    <button
                      onClick={() => handleNavClick('profile')}
                      className="w-full text-left px-3.5 py-2 hover:bg-slate-50 flex items-center gap-2 text-slate-700 cursor-pointer"
                    >
                      <UserIcon className="w-4 h-4 text-teal-600" />
                      <span>Profile & Family</span>
                    </button>

                    {isAdmin && (
                      <button
                        onClick={() => handleNavClick('admin')}
                        className="w-full text-left px-3.5 py-2 hover:bg-slate-50 flex items-center gap-2 text-indigo-700 cursor-pointer"
                      >
                        <Shield className="w-4 h-4 text-indigo-600" />
                        <span>Admin Management</span>
                      </button>
                    )}

                    <div className="border-t border-slate-100 my-1" />

                    <button
                      onClick={() => {
                        logout();
                        setUserDropdownOpen(false);
                        onNavigate('home');
                      }}
                      className="w-full text-left px-3.5 py-2 hover:bg-rose-50 text-rose-600 flex items-center gap-2 cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleNavClick('login')}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-700 hover:text-teal-700 transition-colors cursor-pointer"
                >
                  Sign In
                </button>
                <button
                  onClick={() => handleNavClick('register')}
                  className="px-4 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-xs transition-all whitespace-nowrap cursor-pointer"
                >
                  Register
                </button>
              </div>
            )}

            <button
              onClick={() => handleNavClick('tests')}
              className="px-4 py-2 text-xs font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-lg border border-teal-200 transition-colors whitespace-nowrap cursor-pointer"
            >
              Book a Test
            </button>
          </div>

          {/* Mobile Hamburger Toggle */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2 text-sm font-semibold">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNavClick(link.id)}
              className={`block w-full text-left py-2.5 px-3 rounded-lg min-h-[44px] flex items-center ${
                currentTab === link.id
                  ? 'bg-teal-50 text-teal-800 font-bold'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              {link.label}
            </button>
          ))}

          {isAdmin && (
            <button
              onClick={() => handleNavClick('admin')}
              className="block w-full text-left py-2.5 px-3 rounded-lg min-h-[44px] flex items-center text-indigo-700 bg-indigo-50 font-bold"
            >
              Admin Management Console
            </button>
          )}

          <div className="border-t border-slate-100 pt-3 mt-2">
            {user ? (
              <div className="space-y-2">
                <div className="px-3 py-1">
                  <p className="font-bold text-slate-900">{user.name}</p>
                  <p className="text-xs text-slate-500">{user.email}</p>
                </div>
                <button
                  onClick={() => handleNavClick('dashboard')}
                  className="block w-full text-left py-2 px-3 text-slate-700 hover:bg-slate-50 rounded-lg min-h-[44px] flex items-center"
                >
                  My Bookings
                </button>
                <button
                  onClick={() => handleNavClick('profile')}
                  className="block w-full text-left py-2 px-3 text-slate-700 hover:bg-slate-50 rounded-lg min-h-[44px] flex items-center"
                >
                  Profile & Family
                </button>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                    onNavigate('home');
                  }}
                  className="block w-full text-left py-2 px-3 text-rose-600 hover:bg-rose-50 rounded-lg min-h-[44px] flex items-center"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => handleNavClick('login')}
                  className="py-2.5 px-3 text-center border border-slate-200 rounded-lg text-slate-800 font-semibold min-h-[44px]"
                >
                  Sign In
                </button>
                <button
                  onClick={() => handleNavClick('register')}
                  className="py-2.5 px-3 text-center bg-teal-600 text-white rounded-lg font-semibold min-h-[44px]"
                >
                  Register
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
