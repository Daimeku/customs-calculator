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
        value:     {
            chapter: "Vehicles other than railway or tramway rolling",
            chapterCode: "87",
            subChapter: "Bodies (including cabs), for the motor vehicles of headings  87.01 to 87.05.",
            subChapterCode: "8707",
            subHeading: "Other:",
            subHeadingCode: "870790",
            code: "8707909023",
            description: "Other bodies (including cabs) for the motor vehicles of 87.05 imported for use in agriculture",
            gct: "16.50",
            importDuty: "0.00",
            scf: "-",
            environmentalLevy : "0.50"
        },
        error: false,
        errorMessage: '',
        label: ""
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

    beforeEach(()=> {
        container = mount(<CustomsCalculator/>);
    });

    afterEach(() => {
        container.unmount();
    });
    
    it("renders the page correctly", () => {
        expect(container.find(".calculateButton").length).toBeGreaterThan(0);
        expect(container.find(".shippingCostControlContainer").length).toBeGreaterThan(0);
    });
    
    it("calculates a value when calculate button is clicked", () => {
        container.setState({...state});
        container.find(".calculateButton").first().simulate("click");
        expect(container.state("calculationDetails").totalCharges).toBe(178.03825);
        expect(container.find(".resultAreaValue").text()).toBe("$178.04");
    });

    it("gets an error message when no values are entered", () => {
        container.find(".calculateButton").first().simulate("click");
        container.update();
        expect(container.state("itemCost").error).toEqual(true);
        expect(container.state("itemCategory").error).toEqual(true);
        expect(container.find("#itemCostField-helper-text").first().text()).toBe("Please enter the cost of your item.");
        expect(container.find("#shippingCostField-helper-text").first().text()).toBe("Please enter the cost of shipping your item.");
        expect(container.find("#itemCategoryField-helper-text").first().text()).toBe("Please select a category for your item.");
    });


    it("displays the details when switch is clicked", async () => {
        container.find(".resultAreaDetailsSwitch").first().props().onChange({target: {checked: true, name: "showDetails"}});
        container.update();
        expect(container.state("showDetails").value).toEqual(true);
        expect(container.find(".resultAreaDetails").exists()).toBe(true);
        expect(container.find(".gctContainer").exists()).toBe(true);
    }); 


})
