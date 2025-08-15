import React from 'react';
import { useAuth } from '../hooks/useAuth';
import PropTypes from 'prop-types';

const RoleBasedNavigation = ({ roleConfig = {}, fallback = null }) => {
  const { user } = useAuth();

  if (!user) {
    return fallback;
  }

  const userRole = user.role;
  const roleItems = roleConfig[userRole] || [];

  // If no specific items for this role, show fallback or nothing
  if (roleItems.length === 0) {
    return fallback;
  }

  // Render role-specific navigation items
  return (
    <>
      {roleItems.map((item, index) => (
        <React.Fragment key={index}>
          {typeof item === 'function' ? item(user) : item}
        </React.Fragment>
      ))}
    </>
  );
};

RoleBasedNavigation.propTypes = {
  children: PropTypes.node,
  roleConfig: PropTypes.objectOf(PropTypes.array),
  fallback: PropTypes.node,
};

export default RoleBasedNavigation;
