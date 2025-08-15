// AuthProvider.js
import React, { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import ApiService from './services/api';
import { AuthContext } from './contexts/AuthContext';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (user, token) => {
    setUser(user);
    setToken(token);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const getProfile = async () => {
    try {
      const profileData = await ApiService.getProfile();
      setUser(profileData);
      localStorage.setItem('user', JSON.stringify(profileData));
      return profileData;
    } catch (error) {
      console.error('Failed to get profile:', error);
      throw error;
    }
  };

  const updateProfile = async profileData => {
    try {
      const updatedProfile = await ApiService.updateProfile(profileData);
      setUser(updatedProfile);
      localStorage.setItem('user', JSON.stringify(updatedProfile));
      return updatedProfile;
    } catch (error) {
      console.error('Failed to update profile:', error);
      throw error;
    }
  };

  const value = useMemo(
    () => ({
      user,
      token,
      login,
      logout,
      loading,
      getProfile,
      updateProfile,
    }),
    [user, token, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
