import React from 'react';
import NumberFormat from 'react-number-format';
import Tooltip from '@material-ui/core/Tooltip';
import HelpOutlineOutlinedIcon from '@material-ui/icons/HelpOutlineOutlined';
import toolTips from './toolTips';

const DetailSection = (props) => (
    <div className="resultAreaDetails">
        <div className="cifContainer calculationDetailsRow">

            <Tooltip title={toolTips.cif}>
                <span className="tooltipContainer">
                    <p>CIF  </p>
                    <HelpOutlineOutlinedIcon />
                </span>
            </Tooltip>
            <NumberFormat value={props.calculationDetails.cif} displayType="text" thousandSeparator={true} prefix={'$'} decimalScale={2} />

        </div>

        <div className="importDutyContainer calculationDetailsRow">
            <Tooltip title={toolTips.importDuty}>
                <span className="tooltipContainer">
                    <p>Import Duty</p>
                    <HelpOutlineOutlinedIcon />
                </span>
            </Tooltip>
            <NumberFormat value={props.calculationDetails.importDuty} displayType="text" thousandSeparator={true} prefix={'$'} decimalScale={2} />
        </div>

        <div className="gctContainer calculationDetailsRow">
            <Tooltip title={toolTips.gct}>
                <span className="tooltipContainer">
                    <p>GCT</p>
                    <HelpOutlineOutlinedIcon />
                </span>
            </Tooltip>
            <NumberFormat value={props.calculationDetails.gct} displayType="text" thousandSeparator={true} prefix={'$'} decimalScale={2} />
        </div>

        <div className="stampDutyContainer calculationDetailsRow">
            <Tooltip title={toolTips.stampDuty}>
                <span className="tooltipContainer">
                    <p>Stamp Duty</p>
                    <HelpOutlineOutlinedIcon />
                </span>
            </Tooltip>
            <NumberFormat value={props.calculationDetails.stampDuty} displayType="text" thousandSeparator={true} prefix={'$'} decimalScale={2} />
        </div>

        <div className="stampDutyContainer calculationDetailsRow">
            <Tooltip title={toolTips.scf}>
                <span className="tooltipContainer">
                    <p>SCF</p>
                    <HelpOutlineOutlinedIcon />
                </span>
            </Tooltip>
            <NumberFormat value={props.calculationDetails.scf} displayType="text" thousandSeparator={true} prefix={'$'} decimalScale={2} />
        </div>

        <div className="stampDutyContainer calculationDetailsRow">
            <Tooltip title={toolTips.caf}>
                <span className="tooltipContainer">
                    <p>CAF</p>
                    <HelpOutlineOutlinedIcon />
                </span>
            </Tooltip>
            <NumberFormat value={props.calculationDetails.caf} displayType="text" thousandSeparator={true} prefix={'$'} decimalScale={2} />
        </div>

        <div className="environmentalLevyContainer calculationDetailsRow">
            <Tooltip title={toolTips.environmentalLevy}>
                <span className="tooltipContainer">
                    <p>Environmental Levy:</p>
                    <HelpOutlineOutlinedIcon />
                </span>
            </Tooltip>
            <NumberFormat value={props.calculationDetails.environmentalLevy} displayType="text" thousandSeparator={true} prefix={'$'} decimalScale={2} />
        </div>
    </div>
);

export default DetailSection;