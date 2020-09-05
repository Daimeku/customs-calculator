import React from 'react';
import { List, ListItem, Collapse } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import './CategoriesList.css';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        maxWidth: 360,
        backgroundColor: theme.palette.background.paper,
    },
    nested: {
        paddingLeft: theme.spacing(4),
    },
}));

class CategoriesList extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            showList: [],
            showSubList: false,
            listLength: 0,
            dataArray: {}
        }

    }

    componentDidMount() {
        let { data } = this.props;
        console.log(data);
        //if the current data isnt an array, then it must be 
        //an object with either the chapter, subChapter, subHeading
        if (!Array.isArray(data)) {
            let listLength = Object.keys(data).length;
            const showList = Array(listLength).fill(false);
            this.setState({ showSubList: true, showList });
        }
    }

    setShowList = (index) => {
        let showList = this.state.showList;
        showList[index] = !showList[index];
        this.setState({ showList });
    }

    convertDataToArray = (data) => {
        if (Array.isArray(data)) {
            return data;
        } else {
            return Object.keys(data);
        }
    }

    getItemOnClickHandler = (index, key) => {
        if(this.state.showSubList)
            return () =>this.setShowList(index);
        else
            return () => this.props.handleCategorySelected(key);
    }

    render() {
        return (
            <div className="itemCategoryListContainer">
                <List
                    component="nav"
                    aria-labelledby="nested-list-subheader"
                >
                    {
                        this.convertDataToArray(this.props.data).map( (key, index) => {
                            return (
                                <div>
                                    <ListItem button onClick={this.getItemOnClickHandler(index, key)} key={key} selected={this.props.isCurrentItemSelected(key)}>
                                        {this.state.showSubList ? key : key.description}
                                    </ListItem>

                                    <Collapse in={this.state.showList[index]} unmountOnExit className="categorySubList">
                                        {
                                            this.state.showSubList?
                                                <CategoriesList data={this.props.data[key]} handleCategorySelected={this.props.handleCategorySelected} isCurrentItemSelected={this.props.isCurrentItemSelected}/>:
                                                null
                                        }
                                    </Collapse>
                                </div>
                            );
                        })
                    }
                </List>
            </div>
        );
    }
}
export default CategoriesList;