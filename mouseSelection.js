// import { CalculateOffset } from './functions.js';
import { Worldoffset, canvas, ctx, isScrolling, objects } from './shared.js';

let startX, startY, width, height; // letiables to store the starting position and size of the selection rectangle
let isSelecting = false // Flag to indicate whether the user is currently selecting
let selected = []
let selectionRect = null
let isDragging = false; // Flag to indicate whether you are dragging an object
let wasDragging = false
let dragOffset = {}

let currentTime = () => performance.now()
let lastTime = null
let dbInterval = 200
let doubleClicked = false

// Event listeners to track mouse and touch movements and clicks

canvas.addEventListener('touchstart', handleStart, { passive: false });
canvas.addEventListener('touchmove', handleMove, { passive: false });
canvas.addEventListener('touchend', handleEnd, { passive: false });
canvas.addEventListener('mousedown', handleStart, { passive: false });
canvas.addEventListener('mousemove', handleMove, { passive: false });
canvas.addEventListener('mouseup', handleEnd, { passive: false });
canvas.addEventListener('mouseleave', handleEnd, { passive: false });
canvas.addEventListener('contextmenu', function (event) {
    event.preventDefault(); // Prevent the default right-click context menu
}, { passive: false });



// Helper function to get the coordinates from either mouse or touch event
function getCoordinates(event) {
    // If it is a touch event, use the first touch
    if (event.touches) {
        let touch = event.touches[0];
        return { x: touch.clientX, y: touch.clientY };
    }
    // Otherwise, use the mouse event
    return { x: event.clientX, y: event.clientY };
}


function CalculateOffset(obj) {
    let offX = obj.x - Worldoffset.offsetX
    let offY = obj.y - Worldoffset.offsetY
    obj.x = offX
    obj.y = offY
    return obj
}



// Handle the start of a mouse or touch action
function handleStart(event) {
    event.preventDefault();
    if (event.buttons === 1 || event.touches) {
        // CheckDoubleClicks()

        // Get the coordinates from the event
        let { x, y } = getCoordinates(event);
        const canvasRect = canvas.getBoundingClientRect();
        startX = x - canvasRect.left;
        startY = y - canvasRect.top;
        width = 0;
        height = 0;
        // Use a variable to store the object that is under the mouse position
        let objectUnderMouse = null;
        let objectIndexUnderMouse = -1;
        // Loop through the objects array and find the object that is under the mouse position
        for (let i = objects.length - 1; i >= 0; i--) {
            if (isInsideObject(startX, startY, objects[i])) {
                objectUnderMouse = objects[i];
                objectIndexUnderMouse = i;
                break; // Stop the loop when you find one
            }
        }

        // If there is an object under the mouse position
        if (objectUnderMouse) {
            if (selected.length === 0) {
                // If no object is currently selected, select the clicked object
                objectUnderMouse.selected = true;
                selected.push(objectUnderMouse);
            } else if (selected.length === 1 && selected[0] !== objectUnderMouse) {
                // If one object is currently selected and it's not the clicked object, switch the selection
                selected[0].selected = false;
                selected = [objectUnderMouse];
                objectUnderMouse.selected = true;
            } else if (selected.length === 1 && selected[0] === objectUnderMouse) {
                // If the clicked object is already selected, deselect it
                objectUnderMouse.selected = false;
                selected = [];
            }
            // Set the flag to indicate that you are dragging
            isDragging = true;
            // Loop through the selected array and calculate the offset between the mouse position and the object position
            for (let obj of selected) {
                dragOffset[obj.id] = { x: startX - obj.x, y: startY - obj.y };
            }
            return; // Return from the function
        }
        if (objectUnderMouse == null && selected.length > 0) {
            if (isScrolling.status == true && event.touches[1]) {
                let x = event.touches[1].clientX
                let y = event.touches[1].clientY
                SetDestination(x, y)
                return
            } else if (!isScrolling.status) {
                SetDestination(startX, startY)
                return
            } else {
                console.log("mouse click in mouseSelection error")
            }
        }

        // If there is no object under the mouse position, set the flag to indicate that you are selecting
        clearSelection(); // Clear the selection when starting a new selection
        isDragging = false; // Reset the flag when starting a new action
        isSelecting = true;

    } else {
        clearSelection()
    }
}

// function CheckDoubleClicks() {
//     if (currentTime() - lastTime < dbInterval) {
//         doubleClicked = true
//         clearSelection()
//     }
//     lastTime = performance.now()
// }


function SetDestination(startX, startY) {
    setTimeout(() => {
        if (isSelecting) return
        // if(doubleClicked){
        //     doubleClicked = false 
        //     console.log("doubleClicked")
        //     return
        // }
        selected.forEach(obj => {
            obj.target = CalculateOffset({ x: startX, y: startY })
            obj.needsToMove = true
        })
        // clearSelection()
    }, dbInterval)

    isDragging = false; // Reset the flag when starting a new action
    isSelecting = true;

}

// Handle the move of a mouse or touch action
function handleMove(event) {
    // Get the coordinates from the event
    let { x, y } = getCoordinates(event);
    const canvasRect = canvas.getBoundingClientRect();

    // Do something with x and y
    if (isSelecting) {
        width = x - canvasRect.left - startX;
        height = y - canvasRect.top - startY;
        if (width !== 0 && height !== 0) { // Only update the selection when the mouse is moved
            updateSelection(objects);
        }
    } else if (isDragging) { // If you are dragging an object
        const mouseX = x - canvasRect.left;
        const mouseY = y - canvasRect.top;
        // Loop through the selected array and update the position of each object based on the mouse movement and the offset
        selected.forEach(obj => {
            obj.x = mouseX - dragOffset[obj.id].x
            obj.y = mouseY - dragOffset[obj.id].y
        });
        wasDragging = true
    }

}

// Handle the end of a mouse or touch action
function handleEnd(event) {
    if (wasDragging) {
        clearSelection()
        wasDragging = false
    }
    isSelecting = false;
    isDragging = false; // Reset the flag when releasing the mouse button
}

function clearSelection() {// Function to clear the selection
    // Loop through the selected array and set the selected property to false
    selected.forEach(obj => obj.selected = false);
    // Empty the selected array
    selected = []
}


function updateSelection(objects) {// Function to update the selection
    objects.forEach(object => { // Loop through the objects array
        // Check if the object is within the selection rectangle
        if (object.x + object.offX >= selectionRect.left && object.x + object.offX <= selectionRect.right &&
            object.y + object.offY >= selectionRect.top && object.y + object.offY <= selectionRect.bottom
        ) {
            if (!object.selected) { // If the object is not already selected, add it to the selected array and set its selected property to true
                object.selected = true;
                selected.push(object);
            }
        } else {
            if (object.selected) {// If the object is not within the selection rectangle, but it is selected, remove it from the selected array and set its selected property to false
                object.selected = false;
                const index = selected.indexOf(object);
                selected.splice(index, 1);
            }
        }
    });
}
function isInsideObject(mouseX, mouseY, object) {
    // Create a new path for the object
    ctx.beginPath();
    if (object.shape === "circle") {
        // For circles
        ctx.arc(object.x + object.offX, object.y + object.offY, object.radius + 10, 0, Math.PI * 2);
    } else if (object.shape === "rectangle") {
        ctx.save();
        // Translate to the center of the rectangle
        ctx.translate(object.x + object.offX, object.y + object.offY);
        // Rotate the context by the angle of the rectangle
        ctx.rotate(object.angle);
        // Draw a non-rotated rectangle path centered at (0, 0)
        ctx.rect(-object.width / 2, -object.height / 2, object.width, object.height);
        // Restore the context state
        ctx.restore();
    } else {
        // For unsupported shapes (or if shape property is missing), return false
        return false;
    }
    // Check if the mouse coordinates are inside the path
    return ctx.isPointInPath(mouseX, mouseY);
}

function drawSelectionRectangle() { // Function to draw the selection rectangle
    ctx.save();
    // ctx.strokeStyle = '#31f711';
    ctx.strokeStyle = 'red';

    ctx.lineWidth = 1
    ctx.setLineDash([5, 1]); // Dotted line
    ctx.beginPath();
    ctx.rect(startX, startY, width, height);
    ctx.stroke();
    ctx.restore();
    selectionRect = {
        left: Math.min(startX, startX + width),
        top: Math.min(startY, startY + height),
        right: Math.max(startX, startX + width),
        bottom: Math.max(startY, startY + height)
    };

}


export { drawSelectionRectangle, selected, isSelecting, isDragging, doubleClicked };