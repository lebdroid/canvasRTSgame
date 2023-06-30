
import { canvas, ctx, objects, Worldoffset } from './shared.js';
import { animateMale, CreateCircle, CreateRectangle, DrawCircle, DrawRectangle } from './shapes.js';
import { handleMouseMovement } from './scrolling.js';
import { MAP } from './map.js';
import { CheckCollisionRectangleCircle, findCellKey, GetLength, Locate, Subtract } from './functions.js';
import { drawSelectionRectangle, isSelecting } from './mouseSelection.js';
import { aStarAlgorithm } from './Astar.js';

let groundImg = new Image()
groundImg.src = "./Assets/ground.png"
let bushImg = new Image()
bushImg.src = "./Assets/bush.png"
let male = new Image()
male.src = "./Assets/maleWalk.png"
let tiles = new Image()
tiles.src = "./Assets/tiles.png"

let tileWidth = MAP.tilewidth
let tileHeight = MAP.tileheight
let mapPiXelwidth = MAP.width * tileWidth
let mapPiXelheight = MAP.height * tileHeight
let reciprocal = 1 / tileWidth // using this to replace division with multiplication 

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




let grid = {}

function CreateGrid(map, rows, cols) {
    let MapLayers = map.layers
    for (let i = 0; i < MapLayers.length; i++) {
        let layer = MapLayers[i].data
        for (let j = 0; j < layer.length; j++) {
            let x = j % rows
            let y = Math.floor(j / cols)
            let cellname = `${x},${y}`
            if (layer[j] == 0)
                continue
            if (grid[cellname]) {
                grid[cellname].tile.push(layer[j])
            } else {
                let cell = {
                    x,
                    y,
                    g: Infinity,
                    tile: [],
                    adj: []
                }
                // 1, 0  right
                if (x + 1 >= 0 && x + 1 < rows && y >= 0 && y < cols) {
                    cell.adj.push(`${x + 1},${y}`);
                }
                // -1, 0 left
                if (x - 1 >= 0 && x - 1 < rows && y >= 0 && y < cols) {
                    cell.adj.push(`${x - 1},${y}`);
                }
                // 0, -1  up
                if (x >= 0 && x < rows && y - 1 >= 0 && y - 1 < cols) {
                    cell.adj.push(`${x},${y - 1}`);
                }
                // 0, 1 down
                if (x >= 0 && x < rows && y + 1 >= 0 && y + 1 < cols) {
                    cell.adj.push(`${x},${y + 1}`);
                }
                // 1, -1  top right
                if (x + 1 >= 0 && x + 1 < rows && y - 1 >= 0 && y - 1 < cols) {
                    cell.adj.push(`${x + 1},${y - 1}`);
                }
                // -1, -1 top left
                if (x - 1 >= 0 && x - 1 < rows && y - 1 >= 0 && y - 1 < cols) {
                    cell.adj.push(`${x - 1},${y - 1}`);
                }
                // 1, 1 bottom right
                if (x + 1 >= 0 && x + 1 < rows && y + 1 >= 0 && y + 1 < cols) {
                    cell.adj.push(`${x + 1},${y + 1}`);
                }
                // -1, 1 bottom left
                if (x - 1 >= 0 && x - 1 < rows && y + 1 >= 0 && y + 1 < cols) {
                    cell.adj.push(`${x - 1},${y + 1}`);
                }
                cell.tile.push(layer[j])
                grid[cellname] = cell
            }

        }
    }
}

CreateGrid(MAP, MAP.width, MAP.height)


grid["0,0"].blocked = true

// work in progress !!
// function FindPath(grid, obj, cellsize) {
//     let targetCellKey = findCellKey(obj.target, reciprocal)
//     let StartCellKey = findCellKey(obj, reciprocal)
//     let path = aStarAlgorithm(grid[StartCellKey], grid[targetCellKey], grid)

//     console.log(path)

// }
// FindPath(grid, { x: 3 * 32, y: 3 * 32, target: { x: 0, y: 0 } }, tileWidth)


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


function DrawObservableWorld(startX, startY, endX, endY) {
    for (let x = startX; x < endX; x++) {
        for (let y = startY; y < endY; y++) {
            let key = `${x},${y}`
            let tile = grid[key]
            if (!tile) console.log("DrawObservableWorld error tile", key)
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
                    console.log("error in drawObservableWorld")
                    console.log(tile.tile[index])
                    console.log("********************")
                }

            }
        }
    }


}

let yellow = CreateCircle(500, 100, 0 * Math.PI / 180, "yellow");
let red = CreateCircle(100, 120, 0, "red");
let blue = CreateCircle(350, 355, 0, "blue");
let purple = CreateCircle(400, 430, 0, "purple");

let purplerect = CreateRectangle(500, 800, 30, 10, 0, "purple")



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

    let margin = 5
    let worldStartX = Math.round((Worldoffset.offsetX * reciprocal) + margin) * -1
    let worldStartY = Math.round((Worldoffset.offsetY * reciprocal) + margin) * -1

    let worldEndX = Math.round(((Worldoffset.offsetX * -1) + innerWidth) * reciprocal) + margin
    let worldEndY = Math.round(((Worldoffset.offsetY * -1) + innerHeight) * reciprocal) + margin


    if (worldStartX <= 0) worldStartX = 0
    if (worldStartX > 100) worldStartX = 100
    if (worldStartY <= 0) worldStartY = 0
    if (worldStartY > 100) worldStartY = 100
    if (worldEndX <= 0) worldEndX = 0
    if (worldEndX > 100) worldEndX = 100
    if (worldEndY <= 0) worldEndY = 0
    if (worldEndY > 100) worldEndY = 100

    DrawObservableWorld(worldStartX, worldStartY, worldEndX, worldEndY)

    //copying map from secondarycanvas to maincanvas so it would be visible
    ctx.drawImage(secondaryCanvas, Worldoffset.offsetX, Worldoffset.offsetY,);



    objects.forEach((obj) => {
        if (obj.needsToMove) {
            let { direction, angle } = Locate(obj.target.x, obj.target.y, obj.x, obj.y, obj.speed)
            obj.direction = direction
            obj.x += direction.x
            obj.y += direction.y
            obj.angle = angle
            let distance = GetLength(Subtract(obj.target, { x: obj.x, y: obj.y }))

            if (distance < 5) {
                obj.needsToMove = false
            }
        }
        if (obj.shape === "circle") {
            let modifiedObject = CalculateOffset(obj)
            animateMale(modifiedObject, ctx, male)
            DrawCircle(modifiedObject, ctx)
        } else if (obj.shape === "rectangle") {
            let modifiedObject = CalculateOffset(obj)
            DrawRectangle(modifiedObject, ctx)
        } else {
            console.log("error drawing object")
        }

        const cellId = findCellKey(obj, reciprocal);
        ctx.beginPath();
        ctx.font = `${20}px Arial`;
        ctx.fillStyle = "red";
        ctx.textAlign = "center";
        ctx.fillText(`${cellId}`, obj.x + obj.offX, obj.y + obj.offY - 20);

    })

    if (isSelecting) {
        drawSelectionRectangle();
    }

    //copying map from topCanvas to maincanvas so it would be visible and after moving the characters inorder to overlay
    ctx.drawImage(topCanvas, Worldoffset.offsetX, Worldoffset.offsetY,);


    ctx.beginPath();
    ctx.font = `${20}px Arial`;
    ctx.fillStyle = "#31f711";
    ctx.textAlign = "center";
    ctx.fillText(`fps : ${fps}`, 100, 35);

    requestAnimationFrame(animationLoop);
}

animationLoop();




