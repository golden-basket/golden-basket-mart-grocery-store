import Avatar from '@mui/material/Avatar';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

const JumpingCartAvatar = () => {
  return (
    <Avatar
      sx={{
        width: 64,
        height: 64,
        mx: 'auto',
        mb: 2,
        background: 'linear-gradient(90deg, #fffbe6 0%, #e6d897 100%)',
        boxShadow: '0 2px 8px rgba(163,130,76,0.10)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <ShoppingCartIcon
        sx={{
          fontSize: 36,
          color: '#a3824c',
          textShadow: '0 2px 8px rgba(163,130,76,0.18)',
          animation: 'bounce 2s ease-in-out infinite',
          '@keyframes bounce': {
            '0%, 20%, 50%, 80%, 100%': { transform: 'translateY(0)' },
            '40%': { transform: 'translateY(-8px)' },
            '60%': { transform: 'translateY(-4px)' },
          },
        }}
      />
    </Avatar>
  );
};

export default JumpingCartAvatar;
