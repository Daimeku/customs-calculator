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
      totalCharges: '324234234'
    }
  }
 
  handleFieldChange = (event) => {
    event.preventDefault();
    let fieldName = event.target.name;
    let fieldObject = this.state[fieldName];
    fieldObject.value = event.target.value;
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
    
  }

  //use this to do the actual maths
  calculateTotalShippingCost = (itemCost, shippingCost, itemCategory) => {
    //get the percentage from the item category
    //multiply the percentage by item cost+shipping cost and add it to the original item cost
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
              value={this.state.itemCost.value}
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
              value={this.state.shippingCost.value}
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
              label="TextFieldOption" 
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
