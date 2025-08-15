import { usePermissions } from '../hooks/usePermissions';
import PropTypes from 'prop-types';

const RoleBasedUI = ({
  children,
  adminOnly = false,
  userOnly = false,
  permissions = [],
  fallback = null,
  showForUnauthenticated = false,
}) => {
  const { user, hasPermission, hasAllPermissions } = usePermissions();

  // Show for unauthenticated users if specified
  if (!user && showForUnauthenticated) {
    return children;
  }

  // If no user, show fallback
  if (!user) {
    return fallback;
  }

  // Check admin-only access
  if (adminOnly && !hasPermission('isAdmin')) {
    return fallback;
  }

  // Check user-only access
  if (userOnly && !hasPermission('isUser')) {
    return fallback;
  }

  // Check specific permissions
  if (permissions.length > 0 && !hasAllPermissions(permissions)) {
    return fallback;
  }

  return children;
};

RoleBasedUI.propTypes = {
  children: PropTypes.node.isRequired,
  adminOnly: PropTypes.bool,
  userOnly: PropTypes.bool,
  permissions: PropTypes.arrayOf(PropTypes.string),
  fallback: PropTypes.node,
  showForUnauthenticated: PropTypes.bool,
};

export default RoleBasedUI;
