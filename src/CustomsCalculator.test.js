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
        expect(container.state("calculationDetails").totalCharges).toBe(194.78657500000003);
        expect(container.find(".resultAreaValue").text()).toBe("$194.79");
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
