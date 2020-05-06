import React, { Component } from 'react';

import Door from './SVG Components/Door'
import Floor from './SVG Components/Floor'

class Vault extends Component {
    state = {
        doors: {
            "Door1": true,
            "Door2": true,
        }
    }

    handleDoorClick = (id, open) => {
        console.log('door clicked')
        let doors = { ...this.state.doors }
        doors[id] = !open
        this.setState({ doors: doors })
    }

    render() {
        return (
            <svg
                width='100%'
                height='100%'
                viewBox='0 0 1800 900'
            >
                <Door
                    id="Door1"
                    open={this.state.doors["Door1"]}
                    dx={100}
                    dy={100}
                    clicked={this.handleDoorClick}
                />
                <Door
                    id="Door2"
                    open={this.state.doors["Door2"]}
                    dx={200}
                    dy={200}
                    clicked={this.handleDoorClick}
                />
                <Floor />
            </svg>

        );
    }
}

export default Vault;