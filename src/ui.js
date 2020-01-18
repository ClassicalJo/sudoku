/* bling.js */

window.$ = document.querySelector.bind(document);
window.$$ = document.querySelectorAll.bind(document);

Node.prototype.on = window.on = function (name, fn) {
    this.addEventListener(name, fn);
}

NodeList.prototype.__proto__ = Array.prototype;

NodeList.prototype.on = NodeList.prototype.addEventListener = function (name, fn) {
    this.forEach(function (elem, i) {
        elem.on(name, fn);
    });
}
/////////////////////////////////
let board = new Array(81).fill(0)
let sampleBoard = [
    0, 0, 0, 2, 6, 0, 7, 0, 1,
    6, 8, 0, 0, 7, 0, 0, 9, 0,
    1, 9, 0, 0, 0, 4, 5, 0, 0,
    8, 2, 0, 1, 0, 0, 0, 4, 0,
    0, 0, 4, 6, 0, 2, 9, 0, 0,
    0, 5, 0, 0, 0, 3, 0, 2, 8,
    0, 0, 9, 3, 0, 0, 0, 7, 4,
    0, 4, 0, 0, 5, 0, 0, 3, 6,
    7, 0, 3, 0, 1, 8, 0, 0, 0,

]
let useSampleBoard = () => {
    board = [...sampleBoard]
    $$(".square").forEach((key) => {
        key.value = board[key.id]
    })
}

let createBoard = () => {
    $container = $(".container");
    let counter = 0;
    for (let row = 1; row < 10; row++) {
        for (let column = 1; column < 10; column++) {
            let $input = document.createElement("input")
            $input.classList.add("square", "row" + row, "column" + column)
            $input.type = "number"
            $input.id = counter
            $container.appendChild($input)
            counter++
        }
    }
}

let lockBoard = () => {
    let $$squares = $$(".square")
    let newBoard = []
    $$squares.forEach((key) => {
        key.value.length === 0 ? key.value = 0 : ''
        key.value > 9 ? key.value = 9 : ''
        key.value < 0 ? key.value = 0 : ''
        key.disabled = true
        key.value > 0 ? key.classList.add('solved') : ''    
        newBoard.push(Number(key.value))
    })
    board = [...newBoard]
    $("#solve").disabled = false
    $("#lock").disabled = true
    $("#use-sample").disabled = true
}

let toggleVisualRepresentation = () => {
    visualRepresentation = !visualRepresentation
}

let clearPuzzle = () => {
    $$(".square").forEach((key) => {
        key.value = ""
        key.disabled = false
        key.classList.remove('solved')
    })
    board = new Array(81).fill(0)
    history = {}
    $("#clear").disabled = false
    $("#solve").disabled = true
    $("#lock").disabled = false
    $("#use-sample").disabled = false
}

let solve = () => {
    $("#solve").disabled = true
    $("#clear").disabled = true
    setNewBoard(board)
}

let visualRepresentation = true

createBoard()
