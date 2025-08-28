import React, { useState } from 'react';
import { Button, Box, Typography, Paper } from '@mui/material';
import ApiService from '../services/api';

const TestVerification = () => {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const testVerification = async () => {
    setLoading(true);
    setResult('');

    try {
      const response = await ApiService.verifyEmail('test-token');
      setResult(`Success: ${JSON.stringify(response)}`);
    } catch (error) {
      setResult(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper sx={{ p: 3, m: 2 }}>
      <Typography variant='h6' gutterBottom>
        Test Email Verification API
      </Typography>
      <Button
        variant='contained'
        onClick={testVerification}
        disabled={loading}
        sx={{ mb: 2 }}
      >
        {loading ? 'Testing...' : 'Test Verification API'}
      </Button>
      {result && (
        <Box sx={{ mt: 2 }}>
          <Typography
            variant='body2'
            component='pre'
            sx={{
              backgroundColor: '#f5f5f5',
              p: 2,
              borderRadius: 1,
              overflow: 'auto',
              maxHeight: 200,
            }}
          >
            {result}
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

export default TestVerification;
