import '@testing-library/jest-dom'
import React from 'react'
import CustomsCalculator from './CustomsCalculator';
import { render, screen, fireEvent } from '@testing-library/react';

// beforeEach(() => {
//     render(<CustomsCalculator/>);
// });

test('renders all the fields correctly', () => {
    render(<CustomsCalculator/>);

    expect(screen.getByLabelText('Item Cost')).toBeInTheDocument();
    expect(screen.getByLabelText('Shipping Cost')).toBeInTheDocument();
    expect(screen.getByTestId('itemCategoryField')).toBeInTheDocument();
    expect(screen.getByTestId("totalChargesValue")).toBeInTheDocument();
});

test('get a value on calculate', () => {
    let container = render(<CustomsCalculator />);
    let itemCategoryField = screen.getByLabelText('Item Category');
    let itemCategoryComponent = screen.getByTestId("itemCategoryField");

    // let itemCategoryField = screen.getByRole("textbox");
    itemCategoryField.focus();
    itemCategoryComponent.focus();
    // fireEvent.change(itemCategoryField, {target: {value: "r"}});
    fireEvent.click(itemCategoryComponent);
    fireEvent.keyDown(itemCategoryComponent, {key: 'Arrow Down'});
    fireEvent.keyDown(itemCategoryComponent, {key: 'Arrow Down'});

    fireEvent.keyDown(itemCategoryComponent, {key: 'Arrow Down'});
    fireEvent.keyDown(itemCategoryComponent, {key: 'Enter'});
    expect(itemCategoryField.value).toBe("Race Heese");
    fireEvent.change(screen.getByLabelText('Item Cost'), {target: {value: "1000"}});
    fireEvent.change(screen.getByLabelText('Shipping Cost'), {target: { value: "100"}});
    // fireEvent.change(screen.getByTestId('itemCategoryField'), {},"Race Heece");
    fireEvent.click(screen.getByText("Calculate"));
    expect(screen.getByTestId("totalChargesValue")).toContain("$732.04");
});

// test('it displays details section on toggle', () => {
//     expect(screen.getByTestId('showDetailsSwitch')).toBeInTheDocument();    
//     fireEvent.click(screen.getByTestId('showDetailsSwitch'));
//     fireEvent.change(screen.getByTestId('showDetailsSwitch'), {target: {checked: true}});
//     expect(screen.getByTestId('detailSection').value).toBeInTheDocument();

// });