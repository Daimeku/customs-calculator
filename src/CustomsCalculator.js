import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { TextField, FormControl, InputAdornment, Button, Switch, ListSubheader } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import Autocomplete from '@material-ui/lab/Autocomplete';
import NumberFormat from 'react-number-format';
import { VariableSizeList } from 'react-window';
import DetailSection from './DetailSection';
import CUSTOMS_CATEGORIES from './customsCategories';
// import ListboxComponent from './ListboxComponent';
import './index.css';

const styles = makeStyles( theme =>({
    ListSubHeaderStyles: {
        backgroundColor: "aqua",
        overflow: "hidden",
        maxHeight: "30px"
    }
}));
const OuterElementContext = React.createContext({});
const OuterElementType = React.forwardRef((props, ref) => {
    const outerProps = React.useContext(OuterElementContext);
    return <div ref={ref} {...props} {...outerProps} />;
});

function renderRow(props) {
    const { data, index, style } = props;
    return React.cloneElement(data[index], {
        style: {
            ...style,
            top: style.top + 8,
        },
        className: data[index].props.className + " listItemContainer"
    });
}

const getChildSize = (child) => {
    if (React.isValidElement(child) && child.type === CustomSubHeader) {
        console.log("custom header");
        return 30;
    }

    return 90;
};

const CustomSubHeader = (props) => {
    const currentStyles = styles();
    return (
        <Tooltip title={props.group}>
            <ListSubheader key={props.key} component="div" className="listSubHeader" classes={{root: currentStyles.ListSubHeaderStyles}}>
                {props.group.substring(0,50)}
            </ListSubheader>
        </Tooltip>
    );
}

const renderGroup = (params) => [
    <CustomSubHeader key={params.key} group={params.group} component="div">
        {/* {params.group} */}
    </CustomSubHeader>,
    params.children,
];



const ListboxComponent = React.forwardRef(function ListboxComponent(props, ref) {
    const { children, ...other } = props;
    const itemData = React.Children.toArray(children);
    // const theme = useTheme();
    // const smUp = useMediaQuery(theme.breakpoints.up('sm'), { noSsr: true });
    const itemCount = itemData.length;
    // const itemSize = smUp ? 36 : 48;
    const getHeight = () => {
        if (itemCount > 8) {
            return 8 * 50;
        }
        return itemData.map(() => 90).reduce((a, b) => a + b, 0);
    };
    return (
        <div ref={ref}>
            <OuterElementContext.Provider value={other}>
                <VariableSizeList
                    itemData={itemData}
                    width="100%"
                    height={400}
                    itemCount={itemCount}
                    itemSize={(index) => getChildSize(itemData[index])}
                    outerElementType={OuterElementType}
                >
                    {renderRow}
                </VariableSizeList>
            </OuterElementContext.Provider>
        </div>
    );
});
ListboxComponent.propTypes = {
    children: PropTypes.node
}

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
        console.log("newValue: ", JSON.stringify(newValue));
        for (let field in newValue) {
            console.log(newValue[field]);
        }
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
        let importDuty = cif * (itemCategory.importDuty / 100);
        let environmentalLevy = cif * (itemCategory.environmentalLevy / 100);
        let scf = 0;
        if (itemCategory.scf !== "-") {
            scf = cif * (itemCategory.scf / 100);
        }

        let stampDuty = cif > 5500 ? 100 : 5;
        let caf = cif > 5500 ? 2500 : 0;
        let gct = (cif + caf + environmentalLevy + importDuty + scf) * (itemCategory.gct / 100);
        let totalCharges = importDuty + environmentalLevy + scf + stampDuty + caf + gct;
        console.log(JSON.stringify(itemCategory));
        console.log("item cat value", itemCategory.value);
        console.log("itemcost: ", itemCost);
        console.log("cif: ", cif);
        console.log("totalCharges: ", totalCharges);
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
        number = String(number);
        // number = number.replace(/\D/g, '');
        number = number.replace(/[^0-9.]/g, '');
        number = Number(number);
        if (number === 0)
            return '';
        let numberFormat = new Intl.NumberFormat("en-US", {

        });
        return numberFormat.format(number);
    }

    formatCalculationDetails = (calculationDetails) => {
        let cif = this.formatCurrency(calculationDetails.cif);
        let importDuty = this.formatCurrency(calculationDetails.importDuty);
        let environmentalLevy = this.formatCurrency(calculationDetails.environmentalLevy);
        let scf = this.formatCurrency(calculationDetails.scf);
        let stampDuty = this.formatCurrency(calculationDetails.stampDuty);
        let caf = this.formatCurrency(calculationDetails.caf);
        let gct = this.formatCurrency(calculationDetails.gct);
        let totalCharges = this.formatCurrency(calculationDetails.totalCharges);

        calculationDetails = {
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

    getInputProps = (testId = "") => {
        return {
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
            "data-testid": testId
        }
    }

    render() {
        return (
            <div className="calculatorPageContainer">

                <div className="calculatorTitle"> Customs Calculator</div>

                <div className="itemCostControlContainer">
                    <FormControl className="itemCostControl calculatorField" >
                        <TextField
                            id="itemCostField"
                            name="itemCost"
                            label="Item Cost"
                            value={this.formatCurrency(this.state.itemCost.value)}
                            onChange={this.handleFieldChange}
                            InputProps={this.state.itemCost.value === '' ? null : this.getInputProps("itemCostField")}
                            error={this.state.itemCost.error}
                            helperText={this.state.itemCost.errorMessage}
                        // data-testid="itemCostField"
                        />
                    </FormControl>
                </div>


                <div className="shippingCostControlContainer">
                    <FormControl className={"shippingCostControl calculatorField"}>
                        <TextField
                            id="shippingCostField"
                            name="shippingCost"
                            label="Shipping Cost"
                            value={this.formatCurrency(this.state.shippingCost.value)}
                            onChange={this.handleFieldChange}
                            InputProps={this.state.shippingCost.value === '' ? null : this.getInputProps("shippingCostField")}
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
                        getOptionLabel={(category) => category.subChapter.concat(" - ").concat(category.description)}
                        groupBy={(category) => category.subChapter}
                        renderGroup={renderGroup}
                        renderOption={(category) => (
                            <Fragment>
                                <span className="optionTextContainer">
                                    <span className="optionText">{category.subHeading.concat(" - ").concat(category.description)}</span>
                                </span>
                            </Fragment>
                        )}
                        renderInput={(params) => <TextField {...params}
                            error={this.state.itemCategory.error}
                            helperText={this.state.itemCategory.errorMessage}
                            label="Item Category"
                            variant="outlined"
                        />
                        }
                        onChange={this.handleAutocompleteChange}
                        ListboxComponent={ListboxComponent}
                    />
                </div>

                <div className="calculateButtonContainer">
                    <Button
                        className="calculateButton"
                        variant="contained"
                        color="primary"
                        onClick={this.handleCalculateClicked}
                        data-testid="calculateButton"
                    >
                        Calculate
            </Button>
                </div>


                <div className="resultArea">
                    <div className="resultsAreaTitle">Total Import Charges</div>
                    <div className="resultAreaValue">
                        <NumberFormat value={this.state.calculationDetails.totalCharges} displayType="text" thousandSeparator={true} prefix={'$'} decimalScale={2} data-testid="totalChargesValue" />
                    </div>

                    <div className="resultAreaDetailsSwitchContainer">
                        <p>show details</p>
                        <Switch
                            checked={this.state.showDetails.value}
                            onChange={this.handleFieldChange}
                            color="primary"
                            name="showDetails"
                            className="resultAreaDetailsSwitch"
                        />
                    </div>
                    {
                        this.state.showDetails.value ?
                            <DetailSection calculationDetails={this.state.calculationDetails} /> :
                            null
                    }

                </div>

            </div>

        );
    }
}

export default CustomsCalculator;