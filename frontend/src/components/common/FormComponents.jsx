import React from 'react';
import {
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Box,
  Typography,
  InputAdornment,
  IconButton,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { COMPONENT_STYLES, COLORS } from '../../styles/theme';

// Reusable TextField component
export const FormTextField = ({
  label,
  name,
  value,
  onChange,
  error,
  helperText,
  type = 'text',
  required = false,
  fullWidth = true,
  size = 'medium',
  placeholder,
  disabled = false,
  multiline = false,
  rows = 1,
  maxLength,
  sx = {},
  ...props
}) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const isPassword = type === 'password';

  const handleChange = (e) => {
    if (maxLength && e.target.value.length > maxLength) return;
    onChange(e);
  };

  return (
    <TextField
      label={label}
      name={name}
      value={value}
      onChange={handleChange}
      error={!!error}
      helperText={error || helperText}
      type={isPassword && showPassword ? 'text' : type}
      required={required}
      fullWidth={fullWidth}
      size={size}
      placeholder={placeholder}
      disabled={disabled}
      multiline={multiline}
      rows={rows}
      sx={{
        ...COMPONENT_STYLES.input,
        ...sx,
      }}
      InputProps={{
        endAdornment: isPassword ? (
          <InputAdornment position="end">
            <IconButton
              onClick={() => setShowPassword(!showPassword)}
              edge="end"
              size="small"
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        ) : null,
      }}
      {...props}
    />
  );
};

// Reusable Select component
export const FormSelect = ({
  label,
  name,
  value,
  onChange,
  options = [],
  error,
  helperText,
  required = false,
  fullWidth = true,
  size = 'medium',
  disabled = false,
  sx = {},
  ...props
}) => {
  return (
    <FormControl
      fullWidth={fullWidth}
      size={size}
      error={!!error}
      required={required}
      disabled={disabled}
      sx={{
        ...COMPONENT_STYLES.input,
        ...sx,
      }}
    >
      <InputLabel>{label}</InputLabel>
      <Select
        name={name}
        value={value}
        onChange={onChange}
        label={label}
        {...props}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
      {error && (
        <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
          {error}
        </Typography>
      )}
      {helperText && !error && (
        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
          {helperText}
        </Typography>
      )}
    </FormControl>
  );
};

// Reusable Checkbox component
export const FormCheckbox = ({
  label,
  name,
  checked,
  onChange,
  disabled = false,
  sx = {},
  ...props
}) => {
  return (
    <FormControlLabel
      control={
        <Checkbox
          name={name}
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          sx={{
            color: COLORS.primary.main,
            '&.Mui-checked': {
              color: COLORS.primary.main,
            },
            ...sx,
          }}
          {...props}
        />
      }
      label={label}
    />
  );
};

// Reusable Button component
export const FormButton = ({
  children,
  type = 'button',
  variant = 'contained',
  color = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  fullWidth = false,
  onClick,
  sx = {},
  ...props
}) => {
  return (
    <Button
      type={type}
      variant={variant}
      color={color}
      size={size}
      disabled={disabled || loading}
      fullWidth={fullWidth}
      onClick={onClick}
      sx={{
        ...COMPONENT_STYLES.button,
        ...sx,
      }}
      {...props}
    >
      {loading ? (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CircularProgress size={15} color="inherit" />
          Loading...
        </Box>
      ) : (
        children
      )}
    </Button>
  );
};

// Form error display component
export const FormError = ({ error, sx = {} }) => {
  if (!error) return null;

  return (
    <Alert severity="error" sx={{ mb: 2, ...sx }}>
      {error}
    </Alert>
  );
};

// Form success display component
export const FormSuccess = ({ message, sx = {} }) => {
  if (!message) return null;

  return (
    <Alert severity="success" sx={{ mb: 2, ...sx }}>
      {message}
    </Alert>
  );
};

// Form field wrapper with label and error handling
export const FormField = ({
  label,
  required = false,
  error,
  children,
  sx = {},
}) => {
  return (
    <Box sx={{ mb: 2, ...sx }}>
      {label && (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 1, fontWeight: 500 }}
        >
          {label}
          {required && <span style={{ color: COLORS.error.main }}> *</span>}
        </Typography>
      )}
      {children}
      {error && (
        <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
          {error}
        </Typography>
      )}
    </Box>
  );
};

// Form actions container
export const FormActions = ({ children, sx = {} }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        gap: 2,
        justifyContent: 'flex-end',
        mt: 3,
        ...sx,
      }}
    >
      {children}
    </Box>
  );
};
