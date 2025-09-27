// Shared styles for admin components
export const createAdminStyles = (isMobile, theme) => ({
  sectionStyles: {
    background: theme.palette.background.paper,
    p: isMobile ? 2 : 4,
    boxShadow: theme.shadows[4],
    position: 'relative',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '4px',
      background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 50%, ${theme.palette.primary.dark} 100%)`,
    },
  },

  buttonStyles: {
    fontWeight: 700,
    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 50%, ${theme.palette.primary.dark} 100%)`,
    color: theme.palette.primary.contrastText,
    textTransform: 'none',
    boxShadow: theme.shadows[4],
    '&:hover': {
      background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
      transform: 'translateY(-2px)',
      boxShadow: theme.shadows[6],
    },
    transition: 'all 0.3s ease',
  },

  inputStyles: {
    '& .MuiOutlinedInput-root': {
      background: theme.palette.background.paper,
      boxShadow: theme.shadows[1],
      '&:hover fieldset': { borderColor: theme.palette.primary.main },
      '&.Mui-focused fieldset': { borderColor: theme.palette.primary.main },
    },
    '& .MuiInputLabel-root': {
      color: theme.palette.text.secondary,
      fontWeight: 500,
      '&.Mui-focused': {
        color: theme.palette.primary.main,
      },
    },
    '& .MuiFormHelperText-root': {
      color: theme.palette.text.secondary,
      fontSize: '0.75rem',
      marginLeft: 0,
    },
    '& .MuiSelect-icon': {
      color: theme.palette.primary.main,
    },
  },

  tabStyles: {
    fontWeight: 700,
    outline: 'none !important',
    textTransform: 'none',
    px: isMobile ? 2 : 4,
    py: isMobile ? 1 : 2,
    fontSize: isMobile ? '0.9rem' : '1.1rem',
    transition: 'all 0.3s ease',
    '&.Mui-selected': {
      color: theme.palette.primary.main,
      background: theme.palette.background.paper,
      boxShadow: theme.shadows[4],
      transform: 'translateY(-2px)',
    },
    '&:hover': {
      background: theme.palette.action.hover,
      color: theme.palette.primary.main,
      transform: 'translateY(-1px)',
      boxShadow: theme.shadows[2],
    },
  },

  containerStyles: {
    mt: isMobile ? 1 : 2,
    mb: isMobile ? 1 : 2,
    px: isMobile ? 1 : 3,
    py: isMobile ? 2 : 4,
    background: theme.palette.background.paper,
    boxShadow: theme.shadows[4],
  },

  cardStyles: {
    background: theme.palette.background.paper,
    boxShadow: theme.shadows[2],
    transition: 'all 0.3s ease',
    '&:hover': {
      boxShadow: theme.shadows[6],
      transform: 'translateY(-2px)',
    },
  },

  tableContainerStyles: {
    background: theme.palette.background.paper,
    boxShadow: theme.shadows[2],
    overflow: 'hidden',
  },

  tableHeaderStyles: {
    background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
    '& .MuiTableCell-root': {
      color: theme.palette.primary.contrastText,
      fontWeight: 700,
      fontSize: '0.9rem',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
    },
  },

  tableHeaderCellStyles: {
    color: theme.palette.primary.contrastText,
    fontWeight: 700,
    fontSize: '0.9rem',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },

  tableRowStyles: {
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
    '&:nth-of-type(even)': {
      backgroundColor: theme.palette.action.hover + '20',
    },
  },

  dialogStyles: {
    background: theme.palette.background.paper,
    boxShadow: theme.shadows[12],
    maxWidth: isMobile ? '100%' : '600px',
    width: isMobile ? '100%' : '90%',
  },

  dialogTitleStyles: {
    background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
    color: theme.palette.primary.contrastText,
    fontWeight: 700,
    position: 'relative',
  },

  dialogContentStyles: {
    background: theme.palette.background.paper,
    p: isMobile ? 2 : 3,
    minHeight: isMobile ? 'auto' : '400px',
  },

  dialogActionsStyles: {
    background: theme.palette.background.paper,
    p: 2,
    justifyContent: isMobile ? 'stretch' : 'flex-end',
    gap: 1,
  },
});
