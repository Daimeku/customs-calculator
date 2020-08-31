import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { VariableSizeList } from 'react-window';

const ListboxComponent = React.forwardRef((props, ref) => {
    const { children, ...other } = props;
    const itemData = React.Children.toArray(children);
    // const theme = useTheme();
    // const smUp = useMediaQuery(theme.breakpoints.up('sm'), { noSsr: true });
    const itemCount = itemData.length;
    // const itemSize = smUp ? 36 : 48;

    return(
        <div ref={ref}>
            <VariableSizeList
                itemData={itemData}
                width="100%"
                height={100}
                itemCount={itemCount}
                itemSize={(option) => 50}
            >
                <div>
                    {props.index}
                </div>
            </VariableSizeList>
        </div>
    );
});

ListboxComponent.propTypes = {
    children: PropTypes.node
}

export default ListboxComponent;