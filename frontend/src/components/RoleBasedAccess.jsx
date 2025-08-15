import { useAuth } from '../hooks/useAuth';
import PropTypes from 'prop-types';

const RoleBasedAccess = ({
  children,
  allowedRoles = [],
  fallback = null,
  requireAllRoles = false,
}) => {
  const { user } = useAuth();

  if (!user) {
    return fallback;
  }

  // If no specific roles are required, allow access
  if (allowedRoles.length === 0) {
    return children;
  }

  // Check if user has any of the allowed roles
  const hasAccess = requireAllRoles
    ? allowedRoles.every(role => user.role === role)
    : allowedRoles.includes(user.role);

  if (hasAccess) {
    return children;
  }

  return fallback;
};

RoleBasedAccess.propTypes = {
  children: PropTypes.node.isRequired,
  allowedRoles: PropTypes.arrayOf(PropTypes.string),
  fallback: PropTypes.node,
  requireAllRoles: PropTypes.bool,
};

export default RoleBasedAccess;
