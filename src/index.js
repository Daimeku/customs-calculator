import React from 'react';
import ReactDOM from 'react-dom';
import { TextField, FormControl, InputAdornment, Button, Switch } from '@material-ui/core';
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

const DetailSection = (props) => (
  <div className="resultAreaDetails">
    <div className="cifContainer calculationDetailsRow">
      <p>CIF: </p>
      <p>{props.calculationDetails.cif}</p>
    </div>

    <div className="importDutyContainer calculationDetailsRow">
      <p>Import Duty: </p>
      <p>{props.calculationDetails.importDuty}</p>
    </div>

    <div className="gctContainer calculationDetailsRow">
      <p>GCT:</p>
      <p>{props.calculationDetails.gct}</p>
    </div>

    <div className="stampDutyContainer calculationDetailsRow">
      <p>Stamp Duty:</p>
      <p>{props.calculationDetails.stampDuty}</p>
    </div>

    <div className="stampDutyContainer calculationDetailsRow">
      <p>SCF:</p>
      <p>{props.calculationDetails.scf}</p>
    </div>

    <div className="stampDutyContainer calculationDetailsRow">
      <p>CAF:</p>
      <p>{props.calculationDetails.caf}</p>
    </div>

  </div>
);

class CustomsCalculator extends React.Component {

  constructor(props) {
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
      calculationDetails: {
        importDuty: '',
        environmentalLevy: '',
        scf: '',
        stampDuty: '',
        caf: '',
        gct: '',
        totalCharges: '',
        cif: ''
      },
      showDetails: {
        value: false
      }
    }
  }

  handleFieldChange = (event) => {
    // event.preventDefault();
    let fieldName = event.target.name;
    let fieldObject = this.state[fieldName];
    let newValue;
    if (fieldName !== "showDetails") {
      newValue = event.target.value.replace(/\D/g, '');
    } else {
      newValue = event.target.checked;
    }
    fieldObject.value = newValue;
    //@Todo - validation
    this.setState({ [fieldName]: fieldObject });
  }

  handleAutocompleteChange = (event, newValue) => {
    // event.preventDefault();
    let itemCategory = this.state.itemCategory;
    if (newValue === null)
      newValue = '';
    itemCategory.value = newValue;
    this.setState({ itemCategory });
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
    this.setState({ itemCategory, itemCost, shippingCost });
  }

  //use this for the button click
  handleCalculateClicked = () => {
    this.resetValidationErrors();
    let itemCost = this.state.itemCost;
    let itemCategory = this.state.itemCategory;
    let shippingCost = this.state.shippingCost;
    let valid = true;

    //check to make sure values are in the fields
    if (this.state.itemCost.value === '') {
      valid = false;
      itemCost.error = true;
      itemCost.errorMessage = "Please enter the cost of your item.";
    }

    if (this.state.shippingCost.value === '') {
      valid = false;
      shippingCost.error = true;
      shippingCost.errorMessage = "Please enter the cost of shipping your item.";
    }

    if (this.state.itemCategory.value === '') {
      valid = false;
      itemCategory.error = true;
      itemCategory.errorMessage = "Please select a category for your item.";
    }
    if (!valid) {
      this.setState({ itemCategory, itemCost, shippingCost });
      return;
    }
    //call the calculate function
    let calculationDetails = this.calculateTotalShippingCost(itemCost.value, shippingCost.value, itemCategory.value);

    this.setState({ calculationDetails });
  }

  //use this to do the actual maths
  calculateTotalShippingCost = (itemCost, shippingCost, itemCategory, freightType = "air") => {
    itemCost = Number(itemCost);
    shippingCost = Number(shippingCost);

    //convert to jmd then do this

    let insuranceRate = freightType === "air" ? 0.01 : 0.015;
    let insuranceCost = insuranceRate * (itemCost + shippingCost);
    let cif = itemCost + shippingCost + insuranceCost;
    let importDuty = cif * (itemCategory.ratePercentage / 100);
    let environmentalLevy = cif * 0.005;
    let scf = cif * 0.003;
    let stampDuty = cif > 5500 ? 100 : 5;
    let caf = cif > 5500 ? 2500 : 0;
    let gct = (cif + caf + environmentalLevy + importDuty + scf) * 0.175;
    let totalCharges = importDuty + environmentalLevy + scf + stampDuty + caf + gct;

    let calculationDetails = {
      importDuty,
      environmentalLevy,
      scf,
      stampDuty,
      caf,
      cif,
      gct,
      totalCharges
    };
    return calculationDetails;
  }


  formatCurrency = (number) => {
    number = number.replace(/\D/g, '');
    number = Number(number);
    if (number === 0)
      return '';
    let numberFormat = new Intl.NumberFormat("EN-US");
    return numberFormat.format(number);
  }

  getAdornment = () => {
    return {
      startAdornment: <InputAdornment position="start">$</InputAdornment>
    }
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
              InputProps={this.state.itemCost.value === '' ? null : this.getAdornment()}
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
              InputProps={this.state.shippingCost.value === '' ? null : this.getAdornment()}
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
          <div className="resultsAreaTitle">Total Import Charges</div>
          <div className="resultAreaValue">{this.state.calculationDetails.totalCharges}</div>

          <div className="resultAreaDetailsSwitch">
          <p>show details</p>
            <Switch
              checked={this.state.showDetails.value}
              onChange={this.handleFieldChange}
              color="primary"
              name="showDetails"
            />
          </div>
          {
            this.state.showDetails.value ?
            <DetailSection calculationDetails={this.state.calculationDetails}/> :
            null
          }

        </div>

      </div>

    );
  }
}

ReactDOM.render(
  <CustomsCalculator />,
  document.getElementById('root')
);
