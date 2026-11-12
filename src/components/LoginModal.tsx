import React, { useState } from 'react';
import { User, Shield, Key, ArrowRight, Activity, Check } from './Icons';
import { UserAccount } from '../types';

interface LoginModalProps {
  users: UserAccount[];
  onLogin: (user: UserAccount) => void;
  onClose?: () => void;
  isSwitching?: boolean;
}

export const LoginModal: React.FC<LoginModalProps> = ({ users, onLogin, onClose, isSwitching }) => {
  const [selectedUsername, setSelectedUsername] = useState<string>(users[0]?.username || 'Dorean');
  const [password, setPassword] = useState<string>('password');
  const [error, setError] = useState<string>('');

  const handleSelectUser = (u: UserAccount) => {
    setSelectedUsername(u.username);
    setPassword(u.password || 'password');
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const foundUser = users.find(
      (u) => u.username.toLowerCase() === selectedUsername.toLowerCase()
    );

    if (!foundUser) {
      setError('User not found');
      return;
    }

    if (foundUser.password && foundUser.password !== password) {
      setError('Invalid password. Default password is "password"');
      return;
    }

    onLogin(foundUser);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-md w-full overflow-hidden transition-colors">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-800 to-teal-700 px-6 py-6 text-white text-center">
          <div className="mx-auto w-12 h-12 rounded-xl bg-white/10 backdrop-blur-xs border border-white/20 flex items-center justify-center mb-3 shadow-xs">
            <Activity className="w-7 h-7 text-teal-200" />
          </div>
          <h2 className="text-lg font-bold uppercase tracking-tight">
            Care & Social Polyclinic
          </h2>
          <p className="text-teal-200 text-xs font-semibold tracking-wider uppercase">
            Laboratory Information System
          </p>
          <p className="text-teal-100/80 text-xs mt-1">
            {isSwitching ? 'Switch Scientist / Admin Account' : 'Sign in to access lab reports and recording'}
          </p>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-7 space-y-5">
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-300 rounded-lg text-xs font-medium">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
              Select User Account
            </label>
            <div className="grid grid-cols-1 gap-2.5">
              {users.map((u) => {
                const isSelected = selectedUsername === u.username;
                const isAdmin = u.role === 'admin';
                return (
                  <button
                    key={u.username}
                    type="button"
                    onClick={() => handleSelectUser(u)}
                    className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                      isSelected
                        ? 'border-teal-600 bg-teal-50/70 dark:bg-teal-950/40 ring-1 ring-teal-500/30'
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center ${
                          isAdmin
                            ? 'bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-200'
                            : 'bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-300'
                        }`}
                      >
                        {isAdmin ? <Shield className="w-5 h-5" /> : <User className="w-5 h-5" />}
                      </div>
                      <div>
                        <div className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                          <span>{u.displayName}</span>
                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                              isAdmin
                                ? 'bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-200'
                                : 'bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300'
                            }`}
                          >
                            {isAdmin ? 'Admin' : 'Lab Scientist'}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                          {u.title}
                        </p>
                      </div>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-teal-600 dark:text-teal-400" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Password (default is: <span className="font-mono text-teal-600 dark:text-teal-400 font-bold">password</span>)
            </label>
            <div className="relative">
              <Key className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-600/30 focus:border-teal-600"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            {onClose ? (
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white"
              >
                Cancel
              </button>
            ) : <div />}

            <button
              type="submit"
              className="px-6 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs sm:text-sm font-semibold flex items-center space-x-2 shadow-xs transition-colors"
            >
              <span>Continue as {selectedUsername}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

