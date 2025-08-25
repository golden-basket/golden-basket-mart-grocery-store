import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Box, Typography, Paper } from '@mui/material';
import { ROUTES } from '../utils/routeConstants';

const TestResetPassword = () => {
  const navigate = useNavigate();
  const [testResults, setTestResults] = useState([]);

  const addResult = (test, result, details = '') => {
    setTestResults(prev => [...prev, { test, result, details, timestamp: new Date().toLocaleTimeString() }]);
  };

  const testResetPasswordRoute = () => {
    try {
      // Test navigation to reset password route
      const testUrl = `${ROUTES.RESET_PASSWORD}?token=test-token-123`;
      addResult('Reset Password Route', 'Testing...', `Navigating to: ${testUrl}`);
      
      // Navigate to the route
      navigate(testUrl);
      addResult('Reset Password Route', '✅ Success', 'Navigation completed');
    } catch (error) {
      addResult('Reset Password Route', '❌ Error', error.message);
    }
  };

  const testForgotPasswordRoute = () => {
    try {
      addResult('Forgot Password Route', 'Testing...', 'Navigating to forgot password');
      navigate(ROUTES.FORGOT_PASSWORD);
      addResult('Forgot Password Route', '✅ Success', 'Navigation completed');
    } catch (error) {
      addResult('Forgot Password Route', '❌ Error', error.message);
    }
  };

  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <Paper sx={{ p: 3, m: 2 }}>
      <Typography variant="h6" gutterBottom>
        Test Reset Password Functionality
      </Typography>
      
      <Box sx={{ mb: 3 }}>
        <Button 
          variant="contained" 
          onClick={testResetPasswordRoute}
          sx={{ mr: 2, mb: 1 }}
        >
          Test Reset Password Route
        </Button>
        <Button 
          variant="contained" 
          onClick={testForgotPasswordRoute}
          sx={{ mr: 2, mb: 1 }}
        >
          Test Forgot Password Route
        </Button>
        <Button 
          variant="outlined" 
          onClick={clearResults}
          sx={{ mb: 1 }}
        >
          Clear Results
        </Button>
      </Box>

      <Box>
        <Typography variant="h6" gutterBottom>
          Test Results:
        </Typography>
        {testResults.length === 0 ? (
          <Typography color="text.secondary">
            No tests run yet. Click a test button above.
          </Typography>
        ) : (
          <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
            {testResults.map((result, index) => (
              <Box key={index} sx={{ mb: 1, p: 1, border: '1px solid #ddd', borderRadius: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                  {result.test} - {result.result}
                </Typography>
                {result.details && (
                  <Typography variant="caption" color="text.secondary">
                    {result.details}
                  </Typography>
                )}
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                  {result.timestamp}
                </Typography>
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </Paper>
  );
};

export default TestResetPassword;
