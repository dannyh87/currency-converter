import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

export default function CurrencySelector({ countries = [], value, setValue }) {
  return (
    <Autocomplete
      id="currency-select-demo"
      sx={{ width: 300 }}
      options={countries}
      autoHighlight
      getOptionLabel={(option) => option.code}
      value={value}
      onChange={(event, newValue) => {
        setValue(newValue);
      }}
      renderOption={(props, option) => (
        <Box component="li" {...props}>
          {option.code} {option.name}
        </Box>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Choose a currency"
          inputProps={{
            ...params.inputProps,
            autoComplete: 'new-password', // disable autocomplete and autofill
          }}
        />
      )}
    />
  );
}

//fetch API flag
// set flags ro