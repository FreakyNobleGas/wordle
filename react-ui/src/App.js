import React from 'react';
import './App.css';

// Global Variables
const rowLen = 5;
const numOfRows = 6;

// Stretch Goals
// Add way for users to track letters they've already used (e.g. Wordle uses keyboard on screen)

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

    getElementKey() {
        return this.elementKey
    }

    getSquareVal() {
        return this.val
    }

    setAutoFocus(toggle) {
        this.autoFocus = toggle
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
                let removed = false
                let currSquareIndex = 0
                for (currSquareIndex of squaresNotCorrect) {
                    removed = this.squares.at(currSquareIndex).setSquareColorToHint(currChar)
                    if (removed) {
                        break
                    }
                }
                if (removed) {
                    delete squaresNotCorrect[currSquareIndex]
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
        this.captureExtraKeys = this.captureExtraKeys.bind(this)
    }

    getCurrRow() {
        return this.state.allRows[this.state.currRowNum]
    }

    getSquareByID(id) {
        let r = parseInt(id[0])
        let s = parseInt(id[2])
        return this.state.allRows[r].squares[s]
    }

    getNextSquareByID(id) {
        let r = parseInt(id[0])
        let s = parseInt(id[2])
        let nextS = s + 1
        let currRow = this.state.allRows[r]
        if (nextS < currRow.length) {
            return currRow.squares[nextS]
        }
        return -1
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

    componentDidMount() {
        this[`sq-0:0`].focus()
    }

    focusNextSquare(nextSquareNum, id) {
        if (nextSquareNum > -1 && nextSquareNum < rowLen) {
            let nextSquare = id[0] + ":" + nextSquareNum.toString()
            this[`sq-${nextSquare}`].focus()
        }
    }

    updateSquare(square, event) {
        let pressedKey = event.nativeEvent.data
        if (pressedKey === null) {
            return
        }
        let charCode = pressedKey.toString().charCodeAt(0)
        let id = event.target.id
        let nextSquareNum = parseInt(id[2])
        if (charCode > 64 && charCode < 123) {
            square.setSquareVal(pressedKey)
            nextSquareNum += 1
        }
        this.focusNextSquare(nextSquareNum, id)
        this.setState({allRows: this.state.allRows})
    }

    captureExtraKeys(square, e) {
        console.log(e.key)
        let key = e.key
        // TODO Finish this function for backspace and enter
        // Keys are "Backspace" & "Enter"
        if (key.toUpperCase() === "BACKSPACE") {
            if (square.getSquareVal() !== "") {
                square.setSquareVal("")
                this.setState({allRows: this.state.allRows})
            } else {
                let id = e.target.id
                let nextSquareNum = parseInt(id[2]) - 1
                this.focusNextSquare(nextSquareNum, id)
            }
        }
        if (key.toUpperCase() === "ENTER") {
            this.checkRow()
        }
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
                    ref={ input => this[`sq-${square.elementKey}`] = input}
                    onChange={(e) => this.updateSquare(square, e)}
                    onKeyDownCapture={(e) => this.captureExtraKeys(square, e)}
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
                let nextRowNum = this.state.currRowNum + 1
                this.setState((state, _) => ({
                    currRowNum:(nextRowNum)
                }))
                // TODO Make sure that if row is not valid, then focus still works
                this[`sq-${nextRowNum}:0`].focus()
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
