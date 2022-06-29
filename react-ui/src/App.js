import React from 'react';
import './App.css';

// Global Variables
const rowLen = 5;
const numOfRows = 5;

class square {
    constructor(elementKey) {
        this.elementKey = elementKey;
        this.val = ""
        this.color = ""
    }

    setSquareVal(c) {
        this.val = c
    }
}

class row {
    constructor(elementKey) {
        this.elementKey = elementKey;
        this.squares = [];
    }
}

class App extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            allRows: this.createRows()
        }
        this.updateSquare = this.updateSquare.bind(this);
    }

    createRows() {
        let allRows = [];
        for(let i = 0; i < numOfRows; i++) {
            allRows.push(this.createSquares(i.toString()))
        }
        return allRows;
    }

    createSquares(rowNum) {
        let r = new row(rowNum);
        for(let i = 0; i < rowLen; i++) {
            let elementKey = rowNum + ":" + i.toString()
            r.squares.push(new square(elementKey));
        }
        return r;
    }

    generateRow(r) {
        return r.squares.map((s) => {
            return this.generateSquare(s)
        });
    }

    updateSquare(square, event) {
        square.setSquareVal(event.nativeEvent.data)
        this.setState({allRows: this.state.allRows})
    }

    generateSquare(square) {
        return (
            <div key={square.elementKey}>
                <input
                    type={"text"}
                    id={square.elementKey}
                    name={square.elementKey}
                    value={square.val}
                    onChange={(e) => this.updateSquare(square, e)}
                >
                </input>
            </div>
        )
    }

    render() {
        let generateAllRows = this.state.allRows.map((r) => {
            return (
               <div key={r.elementKey} className="row">
                    {this.generateRow(r)}
               </div>
           );
        });

        return (
            <div>
            <div className="main">
                {generateAllRows}
            </div>
                <div className={"submitButton"}>
                    <button type={"button"}>Submit</button>
                </div>
            </div>

        );
    }
}

export default App;
