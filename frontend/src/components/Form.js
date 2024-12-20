import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Box, Typography } from '@mui/material';

const Form = () => {
  const [formData, setFormData] = useState({
    name: '',
    dailySales: '',
    goodsType: '',
  });

  const [errors, setErrors] = useState({
    name: '',
    dailySales: '',
    goodsType: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.dailySales) newErrors.dailySales = 'Daily Sales is required';
    if (!formData.goodsType) newErrors.goodsType = 'Goods Type is required';

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await axios.post('http://localhost:5000/api/vendors', formData);
      alert('Data submitted successfully!');
      setFormData({ name: '', dailySales: '', goodsType: '' }); // Clear form
    } catch (error) {
      console.error('Error submitting data:', error);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        marginTop: 3,
        color: 'white',
      }}
    >
      <Typography variant="h6" sx={{ color: 'white', textAlign: 'center' }}>
        Vendor Information
      </Typography>

      {/* Name Field */}
      <TextField
        label="Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        required
        fullWidth
        error={!!errors.name}
        helperText={errors.name}
        InputLabelProps={{
          style: { color: 'white' }, // Label color
        }}
        InputProps={{
          style: { color: 'white' }, // Input text color
          sx: {
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'white', // Outline color
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: '#cfcfcf', // Outline color on hover
            },
          },
        }}
        FormHelperTextProps={{
          sx: { color: 'white' }, // Helper text color
        }}
      />

      {/* Daily Sales Field */}
      <TextField
        label="Daily Sales"
        name="dailySales"
        type="number"
        value={formData.dailySales}
        onChange={handleChange}
        required
        fullWidth
        error={!!errors.dailySales}
        helperText={errors.dailySales}
        InputLabelProps={{
          style: { color: 'white' }, // Label color
        }}
        InputProps={{
          style: { color: 'white' }, // Input text color
          sx: {
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'white', // Outline color
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: '#cfcfcf', // Outline color on hover
            },
          },
        }}
        FormHelperTextProps={{
          sx: { color: 'white' }, // Helper text color
        }}
      />

      {/* Goods Type Field */}
      <TextField
        label="Type of Goods"
        name="goodsType"
        value={formData.goodsType}
        onChange={handleChange}
        required
        fullWidth
        error={!!errors.goodsType}
        helperText={errors.goodsType}
        InputLabelProps={{
          style: { color: 'white' }, // Label color
        }}
        InputProps={{
          style: { color: 'white' }, // Input text color
          sx: {
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'white', // Outline color
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: '#cfcfcf', // Outline color on hover
            },
          },
        }}
        FormHelperTextProps={{
          sx: { color: 'white' }, // Helper text color
        }}
      />

      <Button
        variant="contained"
        sx={{
          backgroundColor: 'white',
          color: 'black',
          '&:hover': {
            backgroundColor: '#cfcfcf',
          },
        }}
        onClick={handleSubmit}
      >
        Submit
      </Button>
    </Box>
  );
};

export default Form;
