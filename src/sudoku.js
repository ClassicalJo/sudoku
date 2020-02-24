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

let getIndexii = {
    column: number => { return Object.keys(columns).filter((key) => columns[key] === number) },
    row: number => { return Object.keys(rows).filter((key) => rows[key] === number) },
    quadrant: number => { return Object.keys(quadrants).filter((key) => quadrants[key] === number) }
}

let setNewBoard = (board) => {
    let newBoard = {
        board: [...board],
        availableNumbers: [...controlContent],
    }
    newBoard.nextEmptySpace = getEmptySpace(newBoard.board)
    let columnIndexii = getIndexii.column(newBoard.nextEmptySpace.column)
    let rowIndexii = getIndexii.row(newBoard.nextEmptySpace.row)
    let quadrantIndexii = getIndexii.quadrant(newBoard.nextEmptySpace.quadrant)
    let indexiiToCheck = [columnIndexii, rowIndexii, quadrantIndexii].flat()


    indexiiToCheck.map((index) => {
        for (let i = newBoard.availableNumbers.length - 1; i >= 0; i--) {
            if (newBoard.availableNumbers[i] === newBoard.board[index]) {
                newBoard.availableNumbers.splice(i, 1)
            }
        }
    })

    let newIndex = Object.keys(history).length
    let newEntry = {
        board: newBoard.board,
        availableNumbers: newBoard.availableNumbers,
        nextEmptySpace: newBoard.nextEmptySpace,
        failedBranch: (newBoard.nextEmptySpace.index !== -1 && newBoard.availableNumbers.length === 0) ? true : false
    }
    history[newIndex] = newEntry

    setTimeout(() => checkBoard(), 1)
}

let hasDuplicates = (indexii, board) => {
    let array = indexii.filter(key => board[key] !== 0).map(key => board[key])
    let set = [...new Set(array)]
    return (array.length !== set.length)
}

let elementHasDuplicates = (element, board) => {
    let allIndexii = new Array(9).fill(1).map((x, index) => x + index).map(key => hasDuplicates(getIndexii[element](key), board))
    return (allIndexii.indexOf(true) > -1)
}

let boardHasDuplicates = board => {
    return elementHasDuplicates("column", board) || elementHasDuplicates("row", board) || elementHasDuplicates("quadrant", board)
}
 
let getLastSuccesfulBranch = () => {
    let allSuccessfulIndex = Object.keys(history).filter(key => history[key].failedBranch === false)
    return allSuccessfulIndex.length > 0 ? history[allSuccessfulIndex[allSuccessfulIndex.length - 1]] : -1
}

let checkBoard = () => {
    let lastIndex = Object.keys(history).length - 1
    let lastMovement = getLastSuccesfulBranch()
    if (lastMovement === -1) {
        alert("impossible sudoku detected, no more possible movements.")
        clearPuzzle()
        return
    }
    else {
        let stepBoard = [...lastMovement.board]
        let stepAvailableNumbers = [...lastMovement.availableNumbers]
        let stepNextEmptySpace = { ...lastMovement.nextEmptySpace }

        if (stepAvailableNumbers.length === 0) {
            lastMovement.failedBranch = true
            setTimeout(() => checkBoard(), 1)
        }
        else {
            stepBoard[stepNextEmptySpace.index] = stepAvailableNumbers[0]
            stepAvailableNumbers.splice(0, 1)
            lastMovement.availableNumbers = [...stepAvailableNumbers]
            setTimeout(() => transposeIntoDOM(), 1)

            if (history[lastIndex].nextEmptySpace.index !== -1) {
                setTimeout(() => setNewBoard(stepBoard), 1)
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

