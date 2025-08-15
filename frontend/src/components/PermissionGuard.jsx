import { useAuth } from '../hooks/useAuth';
import PropTypes from 'prop-types';

const PermissionGuard = ({
  children,
  permissions = [],
  fallback = null,
  requireAllPermissions = false,
  checkRole = true,
}) => {
  const { user } = useAuth();

  if (!user) {
    return fallback;
  }

  // Check role-based permissions
  if (checkRole) {
    const rolePermissions = {
      admin: [
        'read',
        'write',
        'delete',
        'manage_users',
        'manage_products',
        'manage_orders',
        'view_analytics',
      ],
      user: ['read', 'write_own', 'delete_own'],
    };

    const userPermissions = rolePermissions[user.role] || [];

    // If no specific permissions are required, allow access
    if (permissions.length === 0) {
      return children;
    }

    // Check if user has required permissions
    const hasPermissions = requireAllPermissions
      ? permissions.every(permission => userPermissions.includes(permission))
      : permissions.some(permission => userPermissions.includes(permission));

    if (!hasPermissions) {
      return fallback;
    }
  }

  return children;
};

PermissionGuard.propTypes = {
  children: PropTypes.node.isRequired,
  permissions: PropTypes.arrayOf(PropTypes.string),
  fallback: PropTypes.node,
  requireAllPermissions: PropTypes.bool,
  checkRole: PropTypes.bool,
};

export default PermissionGuard;
