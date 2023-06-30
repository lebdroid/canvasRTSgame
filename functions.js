import { Worldoffset } from "./shared.js";

// Calculate the length of a vector
export function GetLength(obj) {
    return Math.sqrt(obj.x * obj.x + obj.y * obj.y);
}

// Subtract two vectors
export function Subtract(A, B) {
    return { x: A.x - B.x, y: A.y - B.y };
}

// Get the unit vector of a vector
export function GetUnitVect(A) {
    const length = GetLength(A);
    if (length === 0) return { x: A.x, y: A.y };
    return { x: A.x / length, y: A.y / length };
}

// Add two vectors
export function AddVect(A, B) {
    return { x: A.x + B.x, y: A.y + B.y };
}

// Calculate the dot product of two vectors
export function Dot(A, B) {
    return A.x * B.x + A.y * B.y;
}

// Scale a vector by a scalar value
export function Scale(A, scalar) {
    return { x: A.x * scalar, y: A.y * scalar };
}

// Set an object's properties to look at a target object
export function LookAt(obj, target) {
    const direction = Subtract(target, obj);
    obj.dx = direction.x;
    obj.dy = direction.y;
    obj.angle = Math.atan2(obj.dy, obj.dx);
}

// Check if an object is looking towards a target object
export function IsLooking(obj, target) {
    const normalizedDisplacement = GetUnitVect(Subtract(target, obj));
    const normalizedObjOrientation = GetUnitVect({ x: obj.dx, y: obj.dy });
    return Math.round(Dot(normalizedDisplacement, normalizedObjOrientation) * 1000);
}

// Calculate the distance between two points
export function CalculateDistance(pointA, pointB) {
    const dx = pointB.x - pointA.x;
    const dy = pointB.y - pointA.y;
    return Math.sqrt(dx * dx + dy * dy);
}

// Check collision between two circles
export function CheckCollision(circleA, circleB) {
    const distance = CalculateDistance(circleA, circleB);
    return distance <= circleA.radius + circleB.radius;
}

export function CheckCollisionRectangleCircle(rectangle, circle) {
    // Calculate the closest point on the rectangle to the circle's center
    let closestX = Math.max(rectangle.x, Math.min(circle.x, rectangle.x + rectangle.width));
    let closestY = Math.max(rectangle.y, Math.min(circle.y, rectangle.y + rectangle.height));

    // Calculate the distance between the closest point and the circle's center
    let distanceX = circle.x - closestX;
    let distanceY = circle.y - closestY;
    let distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

    // Check if the distance is less than or equal to the circle's radius
    return distance <= circle.radius;
}

export function CheckCollisionRectangles(rectangleA, rectangleB) {
    // Check if the rectangles overlap on the x-axis
    if (rectangleA.x + rectangleA.width < rectangleB.x || rectangleB.x + rectangleB.width < rectangleA.x) {
        return false;
    }

    // Check if the rectangles overlap on the y-axis
    if (rectangleA.y + rectangleA.height < rectangleB.y || rectangleB.y + rectangleB.height < rectangleA.y) {
        return false;
    }

    // Rectangles are colliding
    return true;
}



// Get a random number within a range
export function GetRandomNumber(min, max) {
    return Math.random() * (max - min) + min;
}

// Get the mouse position relative to the canvas
export function GetMousePosition(event, canvas) {
    const rect = canvas.getBoundingClientRect();
    return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
    };
}

export function Locate(targetX, targetY, rocketX, rocketY, Speed) {
    const angle = Math.atan2(targetY - rocketY, targetX - rocketX);
    const direction = {
        x: Math.cos(angle) * Speed,
        y: Math.sin(angle) * Speed
    };
    return { direction, angle };
}


export function findCellKey(obj, reciprocal) {
    let { x, y } = obj
    const cellRow = Math.floor(x * reciprocal);
    const cellCol = Math.floor(y * reciprocal);
    const cellId = `${cellRow},${cellCol}`;
    return cellId;
}

