import { MAP } from './map.js';


let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");
let controlCanvas = document.getElementById("controlcanvas")


let isMobileDevice = /Mobi/i.test(navigator.userAgent);



canvas.width = window.innerWidth
canvas.height = window.innerHeight


let objects = []
let mouselocation = { x: innerWidth / 2, y: innerWidth / 2 }
let isScrolling = { status: false }

let Worldoffset = { offsetX: 1, offsetY: 1 }

let tileWidth = MAP.tilewidth
let tileHeight = MAP.tileheight
let mapPiXelwidth = MAP.width * tileWidth
let mapPiXelheight = MAP.height * tileHeight
let reciprocal = 1 / tileWidth // using this to replace division with multiplication 
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



export { canvas, ctx, objects, grid, mouselocation, isMobileDevice, isScrolling, controlCanvas, Worldoffset, tileWidth, tileHeight, mapPiXelheight, mapPiXelwidth, reciprocal }