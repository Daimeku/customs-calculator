import React from 'react';
import ReactDOM from 'react-dom';
import { TextField, FormControl, InputLabel, Input, InputAdornment, Button } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';

import './index.css';

const CUSTOMS_CATEGORIES = [
  {
    "parentCategoryId": "0101",
    "subCategoryId": "90.10.10",
    "description": "Race horses, not for breeding",
    "ratePercentage": 40,
    "label": "Race heese"
  },
  {
    "parentCategoryId": "0501",
    "subCategoryId": "00.00.00",
    "description": "human hair, unworked, whether or not washed or scoured; waste of human hair",
    "ratePercentage": 5,
    "label": "human hair"
  }
]

class CustomsCalculator extends React.Component {

  render() {
    return (
      <div className="calculatorPageContainer">

        <div className="calculatorTitle"> Customs Calculator</div>

        <div className="itemCostControlContainer">
          <FormControl className="itemCostControl calculatorField" >
            <InputLabel htmlFor="standard-adornment-amount">Item Cost</InputLabel>
            <Input
              id="standard-adornment-amount"
              name="itemCost"
              value={''}
              onChange={() => { }}
              startAdornment={<InputAdornment position="start">$</InputAdornment>}
            />
          </FormControl>
        </div>


        <div className="shippingCostControlContainer">
          <FormControl className={"shippingCostControl calculatorField"}>
            <InputLabel htmlFor="standard-adornment-amount">Shipping Cost</InputLabel>
            <Input
              name="shippingCostInput"
              value={2000}
              onChange={() => { }}
              startAdornment={<InputAdornment position="start">$</InputAdornment>}
            />
          </FormControl>
        </div>

        <div className="itemCategoryInputContainer">
          <Autocomplete
            name="itemCategoryInput"
            className="itemCategoryInput calculatorField"
            options={CUSTOMS_CATEGORIES}
            getOptionLabel={(category) => category.label}
            renderInput={(params) => <TextField {...params} label="TextFieldOption" variant="outlined" />}
          />
        </div>
        <div className="calculateButtonContainer">
          <Button
            className="calculateButton"
            variant="contained"
            color="primary"
            onClick={() => { }}>
            Calculate
          </Button>
        </div>


        <div className="resultArea">
          <div className="resultsAreaTitle">Results</div>
          <div className="resultAreaValue">$588282899</div>

          <div className="resultAreaDetails">
            details go here
          </div>
        </div>

      </div>

    );
  }
}

ReactDOM.render(
  <CustomsCalculator />,
  document.getElementById('root')
);
