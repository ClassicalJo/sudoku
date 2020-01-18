let defineColumns = () => {
    for (let i = 0; i < 9; i++) {
        addKeysOfColumn(i)
    }
}
let addKeysOfColumn = (columnNumber) => {
    for (let i = 0; i < 9; i++) {
        columns[i * 9 + columnNumber] = columnNumber + 1
    }
}
let addKeysOfRow = (row) => {
    for (let i = row * 9 - 9; i < row * 9; i++) {
        rows[i] = row
    }
}
let defineRows = () => {
    for (let i = 1; i < 10; i++) {
        addKeysOfRow(i)
    }
}

let defineQuadrants = () => {
    let quadrant = 1
    for (let i = 0; i < 27; i++) {
        quadrants[i] = quadrant
        if (Object.keys(quadrants).length % 3 === 0) { quadrant++ }
        if (Object.keys(quadrants).length % 9 === 0) { quadrant = 1 }
    }
    quadrant = 4
    for (let i = 27; i < 54; i++) {
        quadrants[i] = quadrant
        if (Object.keys(quadrants).length % 3 === 0) { quadrant++ }
        if (Object.keys(quadrants).length % 9 === 0) { quadrant = 4 }
    }
    quadrant = 7
    for (let i = 54; i < 81; i++) {
        quadrants[i] = quadrant
        if (Object.keys(quadrants).length % 3 === 0) { quadrant++ }
        if (Object.keys(quadrants).length % 9 === 0) { quadrant = 7 }
    }
}


let getEmptySpace = (board) => {
    let emptySpace = {
        index: board.indexOf(0),
    }
    emptySpace.row = rows[emptySpace.index]
    emptySpace.column = columns[emptySpace.index]
    emptySpace.quadrant = quadrants[emptySpace.index]
    return emptySpace

}
let getIndexiiOfColumn = (number) => {
    return Object.keys(columns).filter((key) => columns[key] === number)
}

let getIndexiiOfRow = (number) => {
    return Object.keys(rows).filter((key) => rows[key] === number)
}

let getIndexiiOfQuadrant = (number) => {
    return Object.keys(quadrants).filter((key) => quadrants[key] === number)
}

let setNewBoard = (board) => {
    let newBoard = {
        board: [...board],
        availableNumbers: [...controlContent],
    }
    newBoard.nextEmptySpace = getEmptySpace(newBoard.board)
    let columnIndexii = getIndexiiOfColumn(newBoard.nextEmptySpace.column)
    let rowIndexii = getIndexiiOfRow(newBoard.nextEmptySpace.row)
    let quadrantIndexii = getIndexiiOfQuadrant(newBoard.nextEmptySpace.quadrant)
    let indexiiToCheck = [columnIndexii, rowIndexii, quadrantIndexii].flat()

    if (!hasDuplicates(columnIndexii, newBoard.board) &&
        !hasDuplicates(rowIndexii, newBoard.board) &&
        !hasDuplicates(quadrantIndexii, newBoard.board)) {

        indexiiToCheck.map((index) => {
            for (let i = newBoard.availableNumbers.length - 1; i >= 0; i--) {
                let usedValue = newBoard.board[index]
                if (newBoard.availableNumbers[i] === usedValue) {
                    newBoard.availableNumbers.splice(i, 1)
                }
            }
        })

        let newIndex = Object.keys(history).length
        history[newIndex] = {}
        history[newIndex].board = newBoard.board
        history[newIndex].availableNumbers = newBoard.availableNumbers
        history[newIndex].nextEmptySpace = newBoard.nextEmptySpace
        if (newBoard.nextEmptySpace.index !== -1 && newBoard.availableNumbers.length === 0) {
            history[newIndex].failedBranch = true
        } else {
            history[newIndex].failedBranch = false
        }
        visualRepresentation === true ? setTimeout(() => checkBoard(), 1) : checkBoard()
    }
    else {
        alert("Impossible sudoku detected: repeated numbers at board lock")
    }
}

let hasDuplicates = (indexii, board) => {
    let array = []
    for (let i = 0; i < indexii.length; i++) {
        if (board[indexii[i]] !== 0) array.push(board[indexii[i]])
    }
    let set = [...new Set(array)]
    return (array.length !== set.length)
}
let getLastSuccesfulBranch = () => {
    let allSuccessfulIndex = []
    let historyKeys = Object.keys(history)
    for (let i = 0; i < historyKeys.length; i++) {
        if (history[historyKeys[i]].failedBranch === false) allSuccessfulIndex.push(history[historyKeys[i]])
    }
    let lastIndex = allSuccessfulIndex.length - 1
    return allSuccessfulIndex.length > 0 ? allSuccessfulIndex[lastIndex] : -1
}

let checkBoard = () => {
    let lastIndex = Object.keys(history).length - 1
    let lastMovement = getLastSuccesfulBranch()
    if (lastMovement === -1) {
        alert("impossible sudoku detected, no more possible movements.")
        return
    }
    else {
        let stepBoard = [...lastMovement.board]
        let stepAvailableNumbers = [...lastMovement.availableNumbers]
        let stepNextEmptySpace = { ...lastMovement.nextEmptySpace }

        if (stepAvailableNumbers.length === 0) {
            lastMovement.failedBranch = true
            visualRepresentation === true ? setTimeout(() => checkBoard(), 1) : checkBoard()
        }
        else {
            stepBoard[stepNextEmptySpace.index] = stepAvailableNumbers[0]
            stepAvailableNumbers.splice(0, 1)
            lastMovement.availableNumbers = [...stepAvailableNumbers]
            visualRepresentation === true ? setTimeout(() => transposeIntoDOM(), 1) : null

            if (history[lastIndex].nextEmptySpace.index !== -1) {
                visualRepresentation === true ? setTimeout(() => setNewBoard(stepBoard), 1) : setNewBoard(stepBoard)
            }
            else {
                transposeIntoDOM()
                $("#clear").disabled = false
            }
        }
    }
}


let transposeIntoDOM = () => {
    let $$squares = $$(".square")
    $$squares.forEach((key) => {
        key.value = history[Object.keys(history).length - 1].board[key.id]
        key.value > 0 ? key.classList.add("solved") : key.classList.remove('solved')
    })
}
let controlContent = [1, 2, 3, 4, 5, 6, 7, 8, 9]
let history = {}


let columns = {}
let rows = {}
let quadrants = {}

defineColumns()
defineRows()
defineQuadrants()

