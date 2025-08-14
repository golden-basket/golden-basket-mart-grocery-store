// Shared styles for admin components
export const createAdminStyles = (isMobile) => ({
  sectionStyles: {
    background: 'linear-gradient(135deg, #fffbe6 0%, #f7e7c4 50%, #fffbe6 100%)',
    borderRadius: isMobile ? 2 : 3,
    p: isMobile ? 2 : 4,
    border: '2px solid #e6d897',
    boxShadow: '0 6px 24px 0 rgba(163,130,76,0.15)',
    position: 'relative',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '4px',
      background: 'linear-gradient(90deg, #a3824c 0%, #e6d897 50%, #b59961 100%)',
      borderRadius: isMobile ? '8px 8px 0 0' : '12px 12px 0 0',
    },
  },

  buttonStyles: {
    fontWeight: 700,
    background: 'linear-gradient(135deg, #a3824c 0%, #e6d897 50%, #b59961 100%)',
    color: '#fff',
    textTransform: 'none',
    boxShadow: '0 4px 12px rgba(163,130,76,0.3)',
    borderRadius: isMobile ? 1 : 2,
    '&:hover': {
      background: 'linear-gradient(135deg, #e6d897 0%, #a3824c 100%)',
      transform: 'translateY(-2px)',
      boxShadow: '0 6px 20px rgba(163,130,76,0.4)',
    },
    transition: 'all 0.3s ease',
  },

  inputStyles: {
    '& .MuiOutlinedInput-root': {
      background: 'linear-gradient(90deg, #fffbe6 0%, #f7e7c1 100%)',
      borderRadius: isMobile ? 1 : 2,
      boxShadow: '0 1px 4px 0 rgba(163,130,76,0.07)',
      '&:hover fieldset': { borderColor: '#a3824c' },
      '&.Mui-focused fieldset': { borderColor: '#a3824c' },
    },
    '& .MuiInputLabel-root': {
      color: '#a3824c',
      fontWeight: 500,
      '&.Mui-focused': {
        color: '#a3824c',
      },
    },
    '& .MuiFormHelperText-root': {
      color: '#b59961',
      fontSize: '0.75rem',
      marginLeft: 0,
    },
    '& .MuiSelect-icon': {
      color: '#a3824c',
    },
  },

  tabStyles: {
    fontWeight: 700,
    outline: 'none !important',
    borderRadius: isMobile ? '6px' : '8px',
    textTransform: 'none',
    px: isMobile ? 2 : 4,
    py: isMobile ? 1 : 2,
    fontSize: isMobile ? '0.9rem' : '1.1rem',
    transition: 'all 0.3s ease',
    border: '2px solid transparent',
    '&.Mui-selected': {
      color: '#a3824c',
      background: 'linear-gradient(135deg, #fffbe6 0%, #f7e7c1 100%)',
      border: '2px solid #e6d897',
      boxShadow: '0 4px 16px rgba(163,130,76,0.2)',
      transform: 'translateY(-2px)',
    },
    '&:hover': {
      background: 'linear-gradient(135deg, #fffbe6 0%, #f7e7c1 100%)',
      color: '#a3824c',
      border: '2px solid #e6d897',
      transform: 'translateY(-1px)',
      boxShadow: '0 2px 12px rgba(163,130,76,0.15)',
    },
  },

  containerStyles: {
    mt: isMobile ? 1 : 2,
    mb: isMobile ? 1 : 2,
    px: isMobile ? 1 : 3,
    py: isMobile ? 2 : 4,
    background: 'linear-gradient(135deg, #fffbe6 0%, #f7e7c1 50%, #fffbe6 100%)',
    borderRadius: isMobile ? 2 : 3,
    boxShadow: '0 4px 20px 0 rgba(163,130,76,0.15)',
    border: '1px solid #e6d897',
  },

  tableContainerStyles: {
    borderRadius: 3,
    boxShadow: '0 4px 20px 0 rgba(163,130,76,0.2)',
    border: '2px solid #e6d897',
    overflow: 'hidden',
    background: 'linear-gradient(135deg, #fffbe6 0%, #f7e7c4 100%)',
  },

  tableHeaderStyles: {
    background: 'linear-gradient(135deg, #a3824c 0%, #e6d897 50%, #b59961 100%)',
  },

  tableHeaderCellStyles: {
    color: '#fff',
    fontWeight: 700,
    fontSize: '1.1rem',
    textShadow: '0 1px 2px rgba(0,0,0,0.2)',
  },

  tableRowStyles: {
    '&:nth-of-type(even)': {
      background: 'linear-gradient(135deg, #fffbe6 0%, #f7e7c4 100%)',
    },
    '&:nth-of-type(odd)': {
      background: 'linear-gradient(135deg, #f7e7c4 0%, #fffbe6 100%)',
    },
    '&:hover': {
      background: 'linear-gradient(135deg, #e6d897 0%, #f7e7c4 100%)',
      transform: 'scale(1.01)',
      boxShadow: '0 4px 16px rgba(163,130,76,0.2)',
      border: '1px solid #a3824c',
    },
    transition: 'all 0.3s ease',
  },

  cardStyles: {
    background: 'linear-gradient(135deg, #fffbe6 0%, #f7e7c4 100%)',
    border: '2px solid #e6d897',
    borderRadius: 2,
    '&:hover': {
      boxShadow: '0 6px 20px rgba(163,130,76,0.25)',
      transform: 'translateY(-2px)',
    },
    transition: 'all 0.3s ease',
  },

  dialogStyles: {
    borderRadius: isMobile ? 0 : 3,
    boxShadow: '0 8px 32px 0 rgba(163,130,76,0.25)',
    border: isMobile ? 'none' : '1px solid #e6d897',
    maxWidth: isMobile ? '100%' : '800px',
    width: isMobile ? '100%' : '90%',
  },

  dialogTitleStyles: {
    background: 'linear-gradient(90deg, #a3824c 0%, #e6d897 100%)',
    color: '#fff',
    fontWeight: 700,
    borderRadius: isMobile ? 0 : '12px 12px 0 0',
    position: 'relative',
  },

  dialogContentStyles: {
    background: 'linear-gradient(90deg, #fffbe6 0%, #f7e7c1 100%)',
    p: isMobile ? 2 : 3,
    minHeight: isMobile ? 'auto' : '400px',
  },

  dialogActionsStyles: {
    background: 'linear-gradient(90deg, #f7e7c1 0%, #fffbe6 100%)',
    p: 2,
    borderRadius: isMobile ? 0 : '0 0 12px 12px',
    justifyContent: isMobile ? 'stretch' : 'flex-end',
    gap: 1,
  },

  titleStyles: {
    background: 'linear-gradient(90deg, #a3824c 0%, #e6d897 50%, #b59961 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    fontWeight: 700,
  },
});
