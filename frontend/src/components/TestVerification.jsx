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
      console.log('TestVerification: Testing API call');
      const response = await ApiService.verifyEmail('test-token');
      console.log('TestVerification: API response:', response);
      setResult(`Success: ${JSON.stringify(response)}`);
    } catch (error) {
      console.error('TestVerification: API error:', error);
      setResult(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper sx={{ p: 3, m: 2 }}>
      <Typography variant="h6" gutterBottom>
        Test Email Verification API
      </Typography>
      <Button 
        variant="contained" 
        onClick={testVerification}
        disabled={loading}
        sx={{ mb: 2 }}
      >
        {loading ? 'Testing...' : 'Test Verification API'}
      </Button>
      {result && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" component="pre" sx={{ 
            backgroundColor: '#f5f5f5', 
            p: 2, 
            borderRadius: 1,
            overflow: 'auto',
            maxHeight: 200
          }}>
            {result}
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

export default TestVerification;
