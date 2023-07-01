import { ctx, objects } from './shared.js';


export function CreateCircle(x, y, angle, color) {
    const circle = {
        id: Date.now() + Math.floor(Math.random() * 100),
        x,
        y,
        dx: Math.cos(angle),
        dy: Math.sin(angle),
        frame: 0,
        scene: 0,
        offX: 0,
        offY: 0,
        radius: 10,
        speed: 2,
        originalSpeed : 2,
        color,
        angle,
        target: null,
        selected: false,
        lineLength: 30,
        shape: "circle",
        path: [],
        currentPathIndex: 0,
        needsToMove: false

    }
    objects.push(circle);
    return circle
}


export function DrawCircle(circle, ctx) {
    ctx.save();
    ctx.translate(circle.x + circle.offX, circle.y + circle.offY + 4);
    ctx.beginPath();

    ctx.rotate(circle.angle);
    ctx.lineWidth = 0.7;
    ctx.strokeStyle = circle.selected ? "green" : circle.color;
    ctx.arc(0, 0, circle.radius + 5, 0, Math.PI * 2);
    ctx.fillStyle = circle.selected ? "green" : circle.color;
    ctx.stroke();
    // just to display direction
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(circle.lineLength, 0);
    ctx.strokeStyle = "white";
    ctx.stroke();
    ctx.restore();
}


export function DrawRectangle(rectangle, ctx) {
    ctx.beginPath();
    ctx.save()
    ctx.translate(rectangle.x + rectangle.offX, rectangle.y + rectangle.offY)
    ctx.rotate(rectangle.angle);
    ctx.fillStyle = rectangle.selected ? "green" : rectangle.color;
    ctx.fillRect(-rectangle.width / 2, -rectangle.height / 2, rectangle.width, rectangle.height);
    // just to display direction
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(rectangle.lineLength, 0);
    ctx.strokeStyle = "white";
    ctx.stroke();
    ctx.restore();
}


export function animateMale(obj, ctx, image) {
    let direction = {
        x: Math.cos(obj.angle),
        y: Math.sin(obj.angle)
    };

    if (direction.x > 0 && direction.y < 0) {
        obj.scene = 7;
        // console.log("up-right")
    } else if (direction.x > 0 && direction.y == 0) {
        obj.scene = 6;
        // console.log("right")
    } else if (direction.x > 0 && direction.y > 0) {
        obj.scene = 5;
        // console.log("down-right")
    } else if (direction.x == 0 && direction.y > 0) {
        obj.scene = 4;
        // console.log("down")
    } else if (direction.x < 0 && direction.y > 0) {
        obj.scene = 3;
        // console.log("down-left")
    } else if (direction.x < 0 && direction.y == 0) {
        obj.scene = 2;
        // console.log("left")
    } else if (direction.x < 0 && direction.y < 0) {
        obj.scene = 1;
        // console.log("up-left")
    } else if (direction.x == 0 && direction.y < 0) {
        obj.scene = 0;
        // console.log("up")
    }
    if (obj.path.length === 0) {
        obj.frame = 8
    }
    // ctx.drawImage(image, sourceX, sourceY, sourceWidth, sourceHeight, destinationX, destinationY, destinationWidth, destinationHeight);
    obj.frame = (obj.frame + 1) % 9; // Cycle through frames from 0 to 8
    let sourceX = obj.frame * 32; // The x coordinate is the frame index times the frame width
    let sourceY = obj.scene * 32; // The y coordinate is the scene index times the scene height
    ctx.drawImage(image, sourceX, sourceY, 32, 32, obj.x + obj.offX - 16, obj.y + obj.offY - 16, 32, 32);
}


export function CreateRectangle(x, y, width, height, angle, color) {
    const rectangle = {
        id: Date.now() + Math.floor(Math.random() * 100),
        x,
        y,
        dx: Math.cos(angle),
        dy: Math.sin(angle),
        offX: 0,
        offY: 0,
        width: width,
        height: height,
        speed: 10,
        originalSpeed: 10,
        color,
        angle,
        target: null,
        lineLength: 40,
        selected: false,
        shape: "rectangle",
        path: [],
        currentPathIndex: 0,
    };
    objects.push(rectangle);
    return rectangle
}

