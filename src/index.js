import React from 'react';
import ReactDOM from 'react-dom';
import { TextField, FormControl, InputAdornment, Button } from '@material-ui/core';
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

  constructor (props) {
    super(props);
    this.state = {
      itemCost: {
        value: '',
        error: false,
        errorMessage: ''
      },
      shippingCost: {
        value: '',
        error: false,
        errorMessage: ''
      },
      itemCategory: {
        value: '',
        error: false,
        errorMessage: ''
      },
      totalCharges: ''
    }
  }
 
  handleFieldChange = (event) => {
    event.preventDefault();
    let fieldName = event.target.name;
    let fieldObject = this.state[fieldName];
    let newValue = event.target.value.replace(/\D/g,'');
    fieldObject.value = newValue;
    //@Todo - validation
    
    this.setState({[fieldName] : fieldObject});
  }

  handleAutocompleteChange = (event, newValue) => {
    event.preventDefault();
    let itemCategory = this.state.itemCategory;
    if(newValue === null)
      newValue = '';
    itemCategory.value = newValue;
    this.setState({itemCategory});
  }

  resetValidationErrors = () => {
    let itemCost = this.state.itemCost;
    let itemCategory = this.state.itemCategory;
    let shippingCost = this.state.shippingCost;
    itemCategory.error = false;
    itemCategory.errorMessage = '';
    itemCost.error = false;
    itemCost.errorMessage = '';
    shippingCost.error = false;
    shippingCost.errorMessage = '';
    this.setState({itemCategory, itemCost, shippingCost});
  }

  //use this for the button click
  handleCalculateClicked = () => {
    this.resetValidationErrors();
    let itemCost = this.state.itemCost;
    let itemCategory = this.state.itemCategory;
    let shippingCost = this.state.shippingCost;
    let valid = true;
    
    //check to make sure values are in the fields
    if(this.state.itemCost.value === ''){
      valid = false;
      itemCost.error = true;
      itemCost.errorMessage = "Please enter the cost of your item.";
    }

    if(this.state.shippingCost.value === '') {
      valid = false;
      shippingCost.error = true;
      shippingCost.errorMessage = "Please enter the cost of shipping your item.";
    }

    if(this.state.itemCategory.value === '') {
      valid = false;
      itemCategory.error = true;
      itemCategory.errorMessage = "Please select a category for your item.";
    }
    if(!valid) {
      this.setState({itemCategory, itemCost, shippingCost});
      return;
    }
    //call the calculate function
    let totalCharges = this.calculateTotalShippingCost(itemCost.value, shippingCost.value, itemCategory.value);

    this.setState({totalCharges});
  }

  //use this to do the actual maths
  calculateTotalShippingCost = (itemCost, shippingCost, itemCategory, freightType = "air") => {
    itemCost = Number(itemCost);
    shippingCost = Number(shippingCost);

    //convert to jmd then do this
    let calculationDetails = {};
    let insuranceRate = freightType === "air"? 0.01 : 0.015;
    let insuranceCost = insuranceRate * (itemCost + shippingCost);
    let cif = itemCost + shippingCost + insuranceCost;
    let importDuty = cif * (itemCategory.ratePercentage/100);
    let environmentalLevy = cif * 0.005;
    let scf = cif * 0.003;
    let stampDuty = cif > 5500 ? 100 : 5;
    let caf = cif > 5500 ? 2500 : 0;
    let gct = (cif + caf + environmentalLevy + importDuty + scf) * 0.175;    

    console.log("cif: ", cif);
    console.log("caf: ", caf);
    console.log("environmentalLevy: ", environmentalLevy);
    console.log("gct: ", gct);
    console.log("import duty: ",importDuty); 
    console.log("scf: ", scf);
    let totalCharges = importDuty + environmentalLevy + scf + stampDuty + caf + gct;

    return totalCharges;
  }


  formatCurrency = (number) => {
    number = number.replace(/\D/g,'');
    number = Number(number);
    if(number === 0)
      return '';
    let numberFormat = new Intl.NumberFormat("EN-US");
    return numberFormat.format(number);
  }

  render() {
    return (
      <div className="calculatorPageContainer">

        <div className="calculatorTitle"> Customs Calculator</div>

        <div className="itemCostControlContainer">
          <FormControl className="itemCostControl calculatorField" >
            <TextField
              id="standard-adornment-amount"
              name="itemCost"
              label="Item Cost"
              value={this.formatCurrency(this.state.itemCost.value)}
              onChange={this.handleFieldChange}
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>
              }}
              error={this.state.itemCost.error}
              helperText={this.state.itemCost.errorMessage}
            />
          </FormControl>
        </div>


        <div className="shippingCostControlContainer">
          <FormControl className={"shippingCostControl calculatorField"}>
            <TextField
              name="shippingCost"
              label="Shipping Cost"
              value={this.formatCurrency(this.state.shippingCost.value)}
              onChange={this.handleFieldChange}
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>
              }}
              error={this.state.shippingCost.error}
              helperText={this.state.shippingCost.errorMessage}
            />
          </FormControl>
        </div>

        <div className="itemCategoryInputContainer">
          <Autocomplete
            name="itemCategoryInput"
            className="itemCategoryInput calculatorField"
            options={CUSTOMS_CATEGORIES}
            getOptionLabel={(category) => category.label}
            renderInput={(params) => <TextField {...params}
              error={this.state.itemCategory.error}
              helperText={this.state.itemCategory.errorMessage}
              label="Item Category" 
              variant="outlined"
            />
            }
            onChange={this.handleAutocompleteChange}
          />
        </div>

        <div className="calculateButtonContainer">
          <Button
            className="calculateButton"
            variant="contained"
            color="primary"
            onClick={this.handleCalculateClicked}>
            Calculate
          </Button>
        </div>


        <div className="resultArea">
          <div className="resultsAreaTitle">Results</div>
          <div className="resultAreaValue">{this.state.totalCharges}</div>

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
