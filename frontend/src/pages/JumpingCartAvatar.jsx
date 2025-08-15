import Avatar from '@mui/material/Avatar';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useFoldableDisplay } from '../hooks/useFoldableDisplay';

const JumpingCartAvatar = () => {
  const { isFoldable, getFoldableClasses, getResponsiveValue } =
    useFoldableDisplay();

  return (
    <Avatar
      className={getFoldableClasses()}
      sx={{
        width: getResponsiveValue(56, 60, 64, isFoldable ? 60 : undefined),
        height: getResponsiveValue(56, 60, 64, isFoldable ? 60 : undefined),
        mx: 'auto',
        mb: getResponsiveValue(1.5, 2, 2.5, isFoldable ? 1.75 : undefined),
        background: 'linear-gradient(90deg, #fffbe6 0%, #e6d897 100%)',
        boxShadow: isFoldable
          ? '0 3px 12px rgba(163,130,76,0.15)'
          : '0 2px 8px rgba(163,130,76,0.10)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: isFoldable ? 'scale(1.05)' : 'none',
          boxShadow: isFoldable
            ? '0 6px 20px rgba(163,130,76,0.25)'
            : '0 4px 16px rgba(163,130,76,0.15)',
        },
      }}
    >
      <ShoppingCartIcon
        sx={{
          fontSize: getResponsiveValue(32, 34, 36, isFoldable ? 34 : undefined),
          color: '#a3824c',
          textShadow: isFoldable
            ? '0 3px 12px rgba(163,130,76,0.25)'
            : '0 2px 8px rgba(163,130,76,0.18)',
          animation: 'bounce 2s ease-in-out infinite',
          transition: 'all 0.2s ease',
          '@keyframes bounce': {
            '0%, 20%, 50%, 80%, 100%': {
              transform: isFoldable ? 'translateY(0)' : 'translateY(0)',
            },
            '40%': {
              transform: isFoldable ? 'translateY(-10px)' : 'translateY(-8px)',
            },
            '60%': {
              transform: isFoldable ? 'translateY(-5px)' : 'translateY(-4px)',
            },
          },
        }}
      />
    </Avatar>
  );
};

export default JumpingCartAvatar;
