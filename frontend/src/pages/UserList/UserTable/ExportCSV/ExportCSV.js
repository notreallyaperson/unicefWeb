import React, { useState } from 'react'
import ReactHTMLTableToExcel from 'react-html-table-to-excel';  
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileExcel } from '@fortawesome/free-solid-svg-icons';

const ExportCSV = props => {
    // const [tooltipVisibility, setTooltipVisibility] = useState(false)
    const buttonText = <FontAwesomeIcon icon={faFileExcel}/>
    return (
        <div 
            // onMouseOver={() => setTooltipVisibility(true)}
            // onMouseOut={() => setTooltipVisibility(false)}
            style={{position: 'relative'}}
        >
            <ReactHTMLTableToExcel
                className="exportButton"  
                table={props.table}  
                filename={props.filename}
                sheet="Sheet"
                buttonText={buttonText}
            />
            {/* <span
                style={{
                    visibility: tooltipVisibility
                    ? 'visible'
                    : 'hidden',
                    padding: '8px',
                    fontSize: '12px',
                    zIndex: '1',
                    borderRadius: '2px',
                    position: 'absolute',
                    color: '#fff',
                    lineHeight: '130%',
                    width: '90px',
                    overflow: 'hidden',
                    left: '105%',
                    top: '0',
                    backgroundColor: '#323232',
                    borderRadius: '10px',
                    whiteSpace: 'pre-wrap',
                }}>
                    <center>
                        <b style={{ lineHeight: '130%' }}>
                            Export Table
                        </b>
                    </center>
            </span> */}
        </div>
    )
}

export default ExportCSV