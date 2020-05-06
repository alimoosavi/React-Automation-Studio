import React from 'react';
import { withTheme } from '@material-ui/core/styles';



const Floor = (props) => {

    const darkTheme = props.theme.palette.type === 'dark'

    return (
        <g >


            <defs id='defs2'>
                <marker
                    id='Arrow2Sstart'
                    orient='auto'
                    overflow='visible'
                    refX='0'
                    refY='0'
                >
                    <path
                        id='Arrow2SstartPath'
                        fill='#000'
                        fillOpacity='1'
                        stroke='#000'
                        strokeOpacity='1'
                        d='M8.72 4.03L-2.21.02 8.72-4c-1.75 2.37-1.74 5.62 0 8.03z'
                        transform='matrix(.3 0 0 .3 -.69 0)'
                    ></path>
                </marker>
                <marker
                    id='Arrow2Send'
                    orient='auto'
                    overflow='visible'
                    refX='0'
                    refY='0'
                >
                    <path
                        id='Arrow2SendPath'
                        fill='#000'
                        fillOpacity='1'
                        stroke='#000'
                        strokeOpacity='1'
                        d='M8.72 4.03L-2.21.02 8.72-4c-1.75 2.37-1.74 5.62 0 8.03z'
                        transform='matrix(-.3 0 0 -.3 .69 0)'
                    ></path>
                </marker>
            </defs>
            <path
                id='rect1667'
                fill='none'
                fillOpacity='1'
                stroke='#bc8655'
                strokeDasharray='none'
                strokeMiterlimit='4'
                strokeOpacity='1'
                strokeWidth='3.9'
                d='M33.461 361.974h341.096V1.95H1.95v229.57h260.825v61.583H33.461'
                opacity='1'
            ></path>
            <path
                id='rect1706'
                fill='none'
                fillOpacity='1'
                stroke='#bc8655'
                strokeDasharray='none'
                strokeMiterlimit='4'
                strokeOpacity='1'
                strokeWidth='3.919'
                d='M72.72 231.52H262.776V293.103H72.72z'
                opacity='1'
            ></path>
        </g>

    );
};

export default withTheme(Floor);