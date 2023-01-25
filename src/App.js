import React, { useEffect, useState } from "react";
import "./App.css";
import CurrencySelector from "./CurrencySelector";

import { TextField, Button, IconButton, Swap } from "@mui/material";
import SwapVertIcon from '@mui/icons-material/SwapVert';

const COUNTRIES_URL = "https://openexchangerates.org/api/currencies.json";

const getCurrencyUrl = (code) => `https://v6.exchangerate-api.com/v6/174fa1e2926a91c6cdd70cdd/latest/${code}`

const fetchCountriesData = async () => {
  // Fetch data for countries and valid currency codes
  const countriesData = await fetch(COUNTRIES_URL, { mode: "cors" }).then(
    (res) => res.json()
  );
  const countryUsd = await fetch(getCurrencyUrl('USD'), { mode: "cors" }).then(
    (res) => res.json()
  );

  const validCurrencyCodes = Object.keys(countryUsd.conversion_rates);

  const countries = validCurrencyCodes.map((code) => {
    const name = countriesData[code]
    return { code, name }
  })

  return countries
}

// Tests if a string is a valid number pattern
const isValidNumber = (a) => Boolean(a.match(/^[0-9]+(\.[0-9]+?)?$/));

const wrapStyle = {
  display: "flex",
  gap: 20,
  flexDirection: "column",
  alignItems: "center",
};

const errorStyle = {
  color: "red",
  fontWeight: "bold",
  borderBottom: "2px solid red",
};

const Error = ({ error = null }) => {
  if (!error) return null;
  return <p style={errorStyle}>{error}</p>;
};

function App() {
  const [textValue, setTextValue] = React.useState("");
  const [error, setError] = React.useState("");
  const [result, setResult] = React.useState("");

  const onChange = (e) => {
    let newValue = e.target.value;
    setTextValue(e.target.value);
    if (newValue && !isValidNumber(newValue)) {
      setError(`${newValue} is not a valid number`);
    } else {
      setError("");
    }
  };

  const [countries, setCountries] = useState([]);
  const [fromCurrency, setFromCurrency] = React.useState(null)
  const [toCurrency, setToCurrency] = React.useState(null)


  useEffect(() => {
    (async () => {
      const countries = await fetchCountriesData()

      setCountries(countries)
    })();
  }, []);


  const onClickConvert = async () => {
    const data = await fetch(getCurrencyUrl(fromCurrency.code), { mode: "cors" }).then(
      (res) => res.json()
    );
    let value = data.conversion_rates[toCurrency.code]*textValue
    setResult(value);
  }


  const onClickSwitch = () => {
    const tmp = fromCurrency
    setFromCurrency(toCurrency)
    setToCurrency(tmp)
    setResult('')
  }

  return (
    <>
      <div id="perimeter">
        <h1>Currency Converter</h1>
        <div style={wrapStyle}>
          <TextField
            label="Amount"
            variant="standard"
            value={textValue}
            onChange={onChange}
          />
          <Error error={error} />
          <CurrencySelector countries={countries} value={fromCurrency} setValue={(v) => {setFromCurrency(v); setResult('')}} />
          <IconButton onClick={onClickSwitch}><SwapVertIcon /></IconButton>
          <CurrencySelector countries={countries} value={toCurrency} setValue={(v) => {setToCurrency(v); setResult('')}} />

          {result ? <p>{textValue} of {fromCurrency.code} into {toCurrency.code} = {result}</p> : null}
    
          <Button variant="contained" style={{ width: 200 }} onClick={onClickConvert}>
            Convert
          </Button>
        </div>
      </div>
    </>
  );
}

export default App;
