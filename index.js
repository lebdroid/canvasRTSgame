
import { canvas, ctx, grid, mapPiXelheight, mapPiXelwidth, objects, reciprocal, tileHeight, tileWidth, Worldoffset } from './shared.js';
import { animateMale, CreateCircle, CreateRectangle, DrawCircle, DrawRectangle } from './shapes.js';
import { handleMouseMovement } from './scrolling.js';
import { CheckCollisionRectangleCircle, findCellKey, findCellRealXY, GetLength, Locate, paintGridOnCanvas, Subtract, updateCharacterPosition } from './functions.js';
import { drawSelectionRectangle, isSelecting } from './mouseSelection.js';
import { aStarAlgorithm } from './Astar.js';

let groundImg = new Image()
groundImg.src = "./Assets/ground.png"
let bushImg = new Image()
bushImg.src = "./Assets/bush.png"
let maleWalk = new Image()
maleWalk.src = "./Assets/maleWalk.png"
let maleRun = new Image()
maleRun.src = "./Assets/maleRun.png"
let tiles = new Image()
tiles.src = "./Assets/tiles.png"


window.onresize = () => {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
}

let treehead = { x: 0, y: 0, block: false, top: true }
let treeBase = { x: 0, y: 32, block: true }
let bush = { x: 32, y: 32, block: true }
let rock = { x: 64, y: 32, block: true }
let grass = { x: 0, y: 64, block: false }
let water = { x: 32, y: 64, block: true }
let dirt = { x: 64, y: 64, block: false }

let tilesInfo = { 22: bush, 41: grass, 1: treehead, 21: treeBase, 23: rock }


// loading map on secondary canvas and then copying it to the maincanvas inorder to optimize
const secondaryCanvas = document.createElement('canvas');
const secondaryContext = secondaryCanvas.getContext('2d');
secondaryCanvas.width = mapPiXelwidth
secondaryCanvas.height = mapPiXelheight


// topCanvas to draw tiles that should overlay the characters 
const topCanvas = document.createElement('canvas');
const topContext = topCanvas.getContext('2d');
topCanvas.width = mapPiXelwidth
topCanvas.height = mapPiXelheight


const gridcanvas = document.createElement('canvas');
const girdcontext = gridcanvas.getContext('2d');
gridcanvas.width = mapPiXelwidth
gridcanvas.height = mapPiXelheight

document.addEventListener('keydown', function (event) {
    if (event.key === 'p') {
        // Perform your desired actions here
        console.log(grid["5,5"].blocked);
    }
});


// maybe for later use!

// let margin = 5
// let worldStartX = Math.round((Worldoffset.offsetX * reciprocal) + margin) * -1
// let worldStartY = Math.round((Worldoffset.offsetY * reciprocal) + margin) * -1
// let worldEndX = Math.round(((Worldoffset.offsetX * -1) + innerWidth) * reciprocal) + margin
// let worldEndY = Math.round(((Worldoffset.offsetY * -1) + innerHeight) * reciprocal) + margin
// if (worldStartX <= 0) worldStartX = 0
// if (worldStartX > 100) worldStartX = 100
// if (worldStartY <= 0) worldStartY = 0
// if (worldStartY > 100) worldStartY = 100
// if (worldEndX <= 0) worldEndX = 0
// if (worldEndX > 100) worldEndX = 100
// if (worldEndY <= 0) worldEndY = 0
// if (worldEndY > 100) worldEndY = 100
// function DrawObservableWorld(startX, startY, endX, endY) {
//     for (let x = startX; x < endX; x++) {
//         for (let y = startY; y < endY; y++) {

//         }
//     }
// }



tiles.onload = () => {
    for (const key in grid) {
        if (Object.hasOwnProperty.call(grid, key)) {
            const tile = grid[key];
            if (!tile) console.log("error in the tiles of the universe!!!", key)
            for (let index = 0; index < tile.tile.length; index++) {
                let info = tilesInfo[tile.tile[index]]
                if (info) {
                    // ctx.drawImage(image, sourceX, sourceY, sourceWidth, sourceHeight, destinationX, destinationY, destinationWidth, destinationHeight);
                    tile.blocked = info.block
                    if (info.top) {
                        topContext.drawImage(tiles, info.x, info.y, 32, 32, (tile.x * tileWidth), (tile.y * tileHeight), 32, 32)
                        continue
                    }
                    secondaryContext.drawImage(tiles, info.x, info.y, 32, 32, (tile.x * tileWidth), (tile.y * tileHeight), 32, 32)
                    // secondaryContext.beginPath();
                    // secondaryContext.font = `${10}px Arial`;
                    // secondaryContext.fillStyle = "red";
                    // secondaryContext.textAlign = "center";
                    // secondaryContext.fillText(key, (tile.x * tileWidth) + 16, (tile.y * tileHeight) + 16);
                } else {
                    console.log("error in the fabric of the universe!!! ")
                    console.log(tile.tile[index])
                    console.log("********************")
                }

            }
        }
    }
}


let yellow = CreateCircle(13, 10, 0 * Math.PI / 180, "yellow");
let red = CreateCircle(15, 10, 0, "red");
let blue = CreateCircle(17, 10, 0, "blue");
let purple = CreateCircle(19, 10, 0, "purple");

let green = CreateCircle(12, 10, 0 * Math.PI / 180, "green");
let pink = CreateCircle(11, 10, 0, "pink");
let brown = CreateCircle(10, 10, 0, "brown");
let orange = CreateCircle(9, 10, 0, "orange");

let purplerect = CreateRectangle(21, 10, 30, 10, 0, "purple")



function CalculateOffset(obj) {
    obj.offX = Worldoffset.offsetX
    obj.offY = Worldoffset.offsetY
    return obj
}


let frameCount = 0;
let fps = 0;
let lastTime = performance.now();

function animationLoop() {

    let currentTime = performance.now();
    frameCount++;
    if (currentTime > lastTime + 1000) {
        fps = frameCount;
        frameCount = 0;
        lastTime = currentTime;
    }

    handleMouseMovement();


    ctx.clearRect(0, 0, canvas.width, canvas.height);


    //copying map from secondarycanvas to maincanvas so it would be visible
    ctx.drawImage(secondaryCanvas, Worldoffset.offsetX, Worldoffset.offsetY);

    ctx.drawImage(gridcanvas, Worldoffset.offsetX, Worldoffset.offsetY);



    objects.forEach((obj) => {

        // if (grid[obj.currentGridLocation].blocked !== true) {
        //     grid[obj.currentGridLocation].blocked = true
            grid[obj.currentGridLocation].occupied.add(obj.color)
        // }

        if (obj.needsToMove) {
            obj.previousGridLocation = obj.currentGridLocation
            if (grid[obj.previousGridLocation]) {
                // grid[obj.previousGridLocation].blocked = false
                grid[obj.currentGridLocation].occupied.delete(obj.color)

            }
            updateCharacterPosition(obj, tileWidth, tileHeight)
            obj.currentGridLocation = findCellKey(obj, reciprocal)
            // grid[obj.currentGridLocation].blocked = true
            grid[obj.currentGridLocation].occupied.add(obj.color)
        }
        if (obj.shape === "circle") {
            let modifiedObject = CalculateOffset(obj)
            animateMale(modifiedObject, ctx, maleWalk, maleRun)
            DrawCircle(modifiedObject, ctx)
        } else if (obj.shape === "rectangle") {
            let modifiedObject = CalculateOffset(obj)
            DrawRectangle(modifiedObject, ctx)
        } else {
            console.log("error drawing object")
        }

        obj.isMoving = false

        ctx.beginPath();
        ctx.font = `${20}px Arial`;
        ctx.fillStyle = obj.color;
        ctx.textAlign = "center";
        ctx.fillText(`${obj.currentGridLocation}`, obj.x + obj.offX, obj.y + obj.offY - 20);

    })

    if (isSelecting) {
        drawSelectionRectangle();
    }

    //copying map from topCanvas to maincanvas so it would be visible and after the drawing of the characters inorder to overlay
    ctx.drawImage(topCanvas, Worldoffset.offsetX, Worldoffset.offsetY);


    ctx.beginPath();
    ctx.font = `${20}px Arial`;
    ctx.fillStyle = "#31f711";
    ctx.textAlign = "center";
    ctx.fillText(`fps : ${fps}`, 100, 35);

    requestAnimationFrame(animationLoop);
}

paintGridOnCanvas(grid, girdcontext)

animationLoop();




