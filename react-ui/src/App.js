import React from 'react';
import './App.css';

// Global Variables
const rowLen = 5;
const numOfRows = 5;

class square {
    constructor(elementKey) {
        this.elementKey = elementKey;
        this.val = "x"
        this.color = ""
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

    generateSquare(square) {
        return (
            <div key={square.elementKey}>
                {/*<button>{square.val}</button>*/}
                <button>{square.elementKey}</button>
            </div>
        )
    }

    render() {
        let allRows = this.state.allRows.map((r) => {
            return (
               <div key={r.elementKey} className="row">
                    {this.generateRow(r)}
               </div>
           );
        });

        return (
            <div className="main">
                {allRows}
            </div>
        );
    }
}

export default App;
