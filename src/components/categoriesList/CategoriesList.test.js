import React from 'react';
import {shallow, mount} from 'enzyme';

import CategoriesList from './CategoriesList';

let singleItem =  [{
    "chapter": "Works of art, collectors’ pieces and antiques",
    "chapterCode": "97",
    "subChapter": "Collections and collectors' pieces of zoological, botanical, mineralogical, anatomical, historical, archaeological, palaeontological, ethnographic or numismatic interest.",
    "subChapterCode": "9705",
    "subHeading": "Collections and collectors' pieces of zoological, botanical, mineralogical, anatomical, historical, archaeological, palaeontological, ethnographic or numismatic interest.",
    "subHeadingCode": "970500",
    "code": "9705000000",
    "description": "Collections and collectors' pieces of zoological, botanical, mineralogical, anatomical, historical, archaeological, palaeontological, ethnographic or numismatic interest.",
    "gct": "16.50",
    "importDuty": "20.00",
    "scf": "-",
    "environmentalLevy": "0.50"
}];

const isCurrentItemSelected = () => false;

describe("CategoriesList tests", () => {
    
    test("successfully renders with single item", () => {
        let container = mount(<CategoriesList data={singleItem} isCurrentItemSelected={isCurrentItemSelected}/>);
        expect(container.find('[role="button"]').text()).toContain("zoological");
    });
});