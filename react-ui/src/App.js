import React from 'react';
import './App.css';

// Global Variables
const rowLen = 5;
const numOfRows = 5;

class square {
    constructor(elementKey) {
        this.elementKey = elementKey;
        this.val = ""
        this.correctColor = "green"
        this.incorrectColor = "grey"
        this.neutralColor = "#ADEFD1FF"
        // Hint color is when the letter in the square is correct, but in the wrong position.
        // For example, if the correct word is 'hello' and the guessed word was 'porch', then the
        // second square's color would be the hint color since 'hello' does have an 'o'.
        this.hintColor = "yellow"
        this.color = { backgroundColor: this.neutralColor }

    }

    getSquareColor() {
        return this.color.backgroundColor
    }

    setSquareVal(c) {
        this.val = c.toUpperCase()
    }

    setSquareColorToCorrect(c) {
        if (this.val === c) {
            this.color = { backgroundColor: this.correctColor }
            return true
        }
        return false
    }

    setSquareColorToHint(c) {
        if (this.val === c) {
            this.color = { backgroundColor: this.hintColor }
            return true
        }
        return false
    }

    setSquareColorToIncorrect() {
        if (this.getSquareColor() === this.neutralColor) {
            this.color = { backgroundColor: this.incorrectColor }
        }
    }
}

class row {
    constructor(elementKey) {
        this.elementKey = elementKey;
        this.squares = [];
        this.submittedWord = ""
    }

    checkIfComplete() {
        return this.squares.every((c) => c.val !== "")
    }

    checkIfCorrect(mysteryWord) {
        let submittedWord = ""
        for (let sq of this.squares) {
            submittedWord += sq.val
        }
        this.submittedWord = submittedWord
        return submittedWord.toUpperCase() === mysteryWord.toUpperCase() ? true : false
    }

    updateRowColors(mysteryWord) {
        let lettersRemaining = mysteryWord
        let squaresNotCorrect = []
        for (let i = 0; i < mysteryWord.length; i++) {
            let currChar = mysteryWord.at(i)
            let removed = this.squares.at(i).setSquareColorToCorrect(currChar)
            if (removed) {
                lettersRemaining = lettersRemaining.replace(currChar, "")
            } else {
                squaresNotCorrect.push(i)
            }
        }
        if (squaresNotCorrect.length !== 0) {
            for (let currChar of lettersRemaining) {
                for (let currSquareIndex of squaresNotCorrect) {
                    let removed = this.squares.at(currSquareIndex).setSquareColorToHint(currChar)
                    if (removed) {
                        squaresNotCorrect = squaresNotCorrect.slice(currSquareIndex + 1, squaresNotCorrect.length)
                        break
                    }
                }
            }

            for (let sq of this.squares) {
                sq.setSquareColorToIncorrect()
            }
        }
    }
}

class App extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            allRows: this.createRows(),
            currRowNum: 0,
            // TODO Get Random MysteryWord
            mysteryWord: "HELLO"
        }

        this.updateSquare = this.updateSquare.bind(this);
        this.checkRow = this.checkRow.bind(this);
    }

    getCurrRow() {
        return this.state.allRows[this.state.currRowNum]
    }

    createRows() {
        let allRows = [];
        for (let i = 0; i < numOfRows; i++) {
            allRows.push(this.createSquares(i.toString()))
        }
        return allRows;
    }

    createSquares(rowNum) {
        let r = new row(rowNum);
        for (let i = 0; i < rowLen; i++) {
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
                    style={square.color}
                    id={square.elementKey}
                    name={square.elementKey}
                    value={square.val}
                    onChange={(e) => this.updateSquare(square, e)}
                >
                </input>
            </div>
        )
    }

    getMysteryWord() {
        return this.state.mysteryWord
    }

    checkRow() {
        console.log("Checking Row")
        let currRow = this.getCurrRow()
        // TODO Let user know row was not valid
        let isRowValid = currRow.checkIfComplete()
        if (isRowValid) {
            currRow.updateRowColors(this.getMysteryWord())
            let isRowCorrect = currRow.checkIfCorrect(this.getMysteryWord())
            if (isRowCorrect) {
                // TODO Make Winning Function
                console.log("You win!")
            } else {
                this.setState((state, _) => ({
                    currRowNum:(state.currRowNum + 1)
                }))
            }
            this.setState({allRows: this.state.allRows})
        }
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
                <div className={"submitButton"} onClick={this.checkRow}>
                    <button type={"button"}>Submit</button>
                </div>
            </div>
        );
    }
}

export default App;
