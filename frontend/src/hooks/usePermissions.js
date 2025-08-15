import { useMemo } from 'react';
import { useAuth } from './useAuth';

export const usePermissions = () => {
  const { user } = useAuth();

  const permissions = useMemo(() => {
    if (!user) {
      return {
        canRead: false,
        canWrite: false,
        canDelete: false,
        canManageUsers: false,
        canManageProducts: false,
        canManageOrders: false,
        canViewAnalytics: false,
        canInviteUsers: false,
        canChangeUserRoles: false,
        canAccessAdmin: false,
        isAdmin: false,
        isUser: false,
      };
    }

    const role = user.role;

    return {
      // Basic permissions
      canRead: true,
      canWrite: role === 'admin' || role === 'user',
      canDelete: role === 'admin' || role === 'user',

      // Admin-specific permissions
      canManageUsers: role === 'admin',
      canManageProducts: role === 'admin',
      canManageOrders: role === 'admin',
      canViewAnalytics: role === 'admin',
      canInviteUsers: role === 'admin',
      canChangeUserRoles: role === 'admin',
      canAccessAdmin: role === 'admin',

      // Role checks
      isAdmin: role === 'admin',
      isUser: role === 'user',

      // User-specific permissions
      canEditOwnProfile: true,
      canViewOwnOrders: true,
      canCancelOwnOrders: role === 'user',
      canRequestRefunds: role === 'user',
    };
  }, [user]);

  const hasPermission = permission => {
    return permissions[permission] || false;
  };

  const hasAnyPermission = permissionList => {
    return permissionList.some(permission => permissions[permission]);
  };

  const hasAllPermissions = permissionList => {
    return permissionList.every(permission => permissions[permission]);
  };

  return {
    permissions,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    user,
  };
};
