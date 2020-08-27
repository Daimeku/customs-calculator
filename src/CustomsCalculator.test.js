import React from 'react';
import { shallow, mount } from 'enzyme';
import { Switch } from '@material-ui/core';

import CustomsCalculator from './CustomsCalculator';
import DetailSection from './DetailSection';


let state = {
    itemCost: {
        value: '1000',
        error: false,
        errorMessage: ''
    },
    shippingCost: {
        value: '100',
        error: false,
        errorMessage: ''
    },
    itemCategory: {
        value: {
            parentCategoryId: "0101",
            subCategoryId: "90.10.10",
            description: "Race horses, not for breeding",
            ratePercentage: 40,
            label: "Race Heese"
        },
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
let container;

describe("main calculator tests", () => {
    beforeAll = () => {
        container = shallow(<CustomsCalculator/>);
    }
    
    it("renders the page correctly", () => {
        let container = shallow(<CustomsCalculator/>);
        expect(container.find(".calculateButton").length).toEqual(1);
        expect(container.find(".shippingCostControlContainer").length).toEqual(1);
    });
    
    it("calculates a value when calculate button is clicked", () => {
        let container = mount(<CustomsCalculator/>);
        container.setState({...state});
        container.find(".calculateButton").first().simulate("click");
        console.log(container.state("itemCost"));
        expect(container.state("calculationDetails").totalCharges).toBe(732.0384000000001);
        expect(container.find(".resultAreaValue").text()).toBe("$732.04");
    });

    it("gets an error message when no values are entered", () => {
        let container = shallow(<CustomsCalculator/>);
        container.find(".calculateButton").simulate("click");
        expect(container.state("itemCost").error).toEqual(true);
        expect(container.state("itemCategory").error).toEqual(true);
    });


    it("displays the details when switch is clicked", async () => {
        let container = mount(<CustomsCalculator/>);
        container.find(".resultAreaDetailsSwitch").first().props().onChange({target: {checked: true, name: "showDetails"}});
        expect(container.state("showDetails").value).toEqual(true);
        // expect(container.find(".calculationDetailsRow").exists()).toBe(true);;
    });


})
