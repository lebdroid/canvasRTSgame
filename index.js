
import { canvas, ctx, objects, Worldoffset } from './shared.js';
import { animateMale, CreateCircle, CreateRectangle, DrawCircle, DrawRectangle } from './shapes.js';
import { handleMouseMovement } from './scrolling.js';
import { MAP } from './map.js';
import { findCell, GetLength, Locate, Subtract } from './functions.js';
import { drawSelectionRectangle, isSelecting } from './mouseSelection.js';

let groundImg = new Image()
groundImg.src = "./Assets/ground.png"
let bushImg = new Image()
bushImg.src = "./Assets/bush.png"

let male = new Image()
male.src = "./Assets/maleWalk.png"


let tilesImages = { 22: bushImg, 41: groundImg }
let tileWidth = MAP.tilewidth
let tileHeight = MAP.tileheight
let mapPiXelwidth = MAP.width * tileWidth
let mapPiXelheight = MAP.height * tileHeight
let WeirdNumber = tileWidth / 1000

window.onresize = () => {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
}

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
                    tile: []
                }
                cell.tile.push(layer[j])
                grid[cellname] = cell
            }

        }
    }
}

CreateGrid(MAP, MAP.width, MAP.height)

const secondaryCanvas = document.createElement('canvas');
const secondaryContext = secondaryCanvas.getContext('2d');
secondaryCanvas.width = mapPiXelwidth
secondaryCanvas.height = mapPiXelheight


function DrawObservableWorld(startX, startY, endX, endY) {
    for (let x = startX; x < endX; x++) {
        for (let y = startY; y < endY; y++) {
            let key = `${x},${y}`
            let tile = grid[key]
            if (!tile) console.log("DrawObservableWorld error tile", key)
            for (let index = 0; index < tile.tile.length; index++) {
                let image = tilesImages[tile.tile[index]]
                secondaryContext.drawImage(image, (tile.x * tileWidth), (tile.y * tileHeight))
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
    let worldStartX = Math.round((Worldoffset.offsetX * WeirdNumber) + margin) * -1
    let worldStartY = Math.round((Worldoffset.offsetY * WeirdNumber) + margin) * -1

    let worldEndX = Math.round(((Worldoffset.offsetX * -1) + innerWidth) * WeirdNumber) + margin
    let worldEndY = Math.round(((Worldoffset.offsetY * -1) + innerHeight) * WeirdNumber) + margin

    if (worldStartX <= 0) worldStartX = 0
    if (worldStartX > 100) worldStartX = 100
    if (worldStartY <= 0) worldStartY = 0
    if (worldStartY > 100) worldStartY = 100
    if (worldEndX <= 0) worldEndX = 0
    if (worldEndX > 100) worldEndX = 100
    if (worldEndY <= 0) worldEndY = 0
    if (worldEndY > 100) worldEndY = 100

    ctx.drawImage(secondaryCanvas, Worldoffset.offsetX, Worldoffset.offsetY,);


    DrawObservableWorld(worldStartX, worldStartY, worldEndX, worldEndY)

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

        // const cellId = findCell(obj, tileWidth);
        // ctx.beginPath();
        // ctx.font = `${20}px Arial`;
        // ctx.fillStyle = "red";
        // ctx.textAlign = "center";
        // ctx.fillText(`${cellId}`, obj.x + obj.offX, obj.y + obj.offY - 20);

    })

    if (isSelecting) {
        drawSelectionRectangle();
    }


    ctx.beginPath();
    ctx.font = `${20}px Arial`;
    ctx.fillStyle = "#31f711";
    ctx.textAlign = "center";
    ctx.fillText(`fps : ${fps}`, 100, 35);

    requestAnimationFrame(animationLoop);
}

animationLoop();




