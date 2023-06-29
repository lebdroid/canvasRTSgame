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
        color,
        angle,
        target: null,
        needsToMove: false,
        selected: false,
        lineLength: 30,
        shape: "circle",
        direction : {x: 0, y: 0}
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
    var direction = {
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
    if (obj.needsToMove === false) {
        obj.frame = 8
    }
    obj.frame = (obj.frame + 1) % 9; // Cycle through frames from 0 to 8
    var sx = obj.frame * 32; // The x coordinate is the frame index times the frame width
    var sy = obj.scene * 32; // The y coordinate is the scene index times the scene height
    ctx.drawImage(image, sx, sy, 32, 32, obj.x + obj.offX - 16, obj.y + obj.offY - 16, 32, 32);
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
        color,
        angle,
        target: null,
        needsToMove: false,
        lineLength: 40,
        selected: false,
        shape: "rectangle"
    };
    objects.push(rectangle);
    return rectangle
}

