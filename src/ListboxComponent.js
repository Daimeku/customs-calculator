import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import Tooltip from '@material-ui/core/Tooltip';
import { makeStyles } from '@material-ui/core/styles';
import {ListSubheader } from '@material-ui/core';


import { VariableSizeList } from 'react-window';

const getChildSize = (child) => {
    if (React.isValidElement(child) && child.type === CustomSubHeader) {
        console.log("custom header");
        return 30;
    }

    return 90;
};

function useResetCache(data) {
    const ref = React.useRef(null);
    React.useEffect(() => {
        if (ref.current != null) {
            ref.current.resetAfterIndex(0, true);
        }
    }, [data]);
    return ref;
}

const OuterElementContext = React.createContext({});
const OuterElementType = React.forwardRef((props, ref) => {
    const outerProps = React.useContext(OuterElementContext);
    return <div ref={ref} {...props} {...outerProps} />;
});

const styles = makeStyles(theme => ({
    ListSubHeaderStyles: {
        backgroundColor: "aqua",
        overflow: "hidden",
        maxHeight: "30px"
    }
}));

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

export const CustomSubHeader = (props) => {
    const currentStyles = styles();
    return (
        <Tooltip title={props.group}>
            <ListSubheader key={props.key} component="div" className="listSubHeader" classes={{ root: currentStyles.ListSubHeaderStyles }}>
                {props.group.substring(0, 50)}
            </ListSubheader>
        </Tooltip>
    );
}

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
        return itemData.map(getChildSize).reduce((a, b) => a + b, 0);
    };

    console.log(itemData.map(getChildSize).reduce((a, b) => a + b, 0));

    const gridRef = useResetCache(itemCount);

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
                    ref={gridRef}
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

export default ListboxComponent;