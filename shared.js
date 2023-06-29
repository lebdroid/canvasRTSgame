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




export { canvas, ctx, objects, mouselocation, isMobileDevice, isScrolling, controlCanvas, Worldoffset }