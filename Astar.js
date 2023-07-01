import { grid } from "./shared.js";

function getDistance(currentNode, neighbor) {
    const dx = Math.abs(neighbor.x - currentNode.x);
    const dy = Math.abs(neighbor.y - currentNode.y);

    const diagonalCost = 1.4;
    const straightCost = 1;

    // check if it's a diagonal move
    if (dx !== 0 && dy !== 0) {
        // check if the diagonal move is valid
        // get the adjacent nodes of the current node
        const adjNodes = currentNode.adj.map(id => grid[id]);
        // get the nodes that are in the same row and column as the neighbor node
        const rowNode = adjNodes.find(node => node.x === neighbor.x);
        const colNode = adjNodes.find(node => node.y === neighbor.y);
        // if either of them is blocked, the diagonal move is invalid
        if (rowNode.blocked || colNode.blocked) {
            // return a very large distance to discourage this move
            return Infinity;
        }
        // calculate the diagonal distance
        const diagonalDistance = Math.min(dx, dy);
        const straightDistance = Math.abs(dx - dy);

        // calculate the total distance with diagonal cost
        const totalDistance = (diagonalCost * diagonalDistance) + (straightCost * straightDistance);

        return totalDistance;
    } else {
        // calculate the total distance with straight cost
        const totalDistance = straightCost * (dx + dy);

        return totalDistance;
    }
}

function constructPath(node) {
    let path = [`${node.x},${node.y}`];
    let current = node;
    while (current.cameFrom) { // use cameFrom instead of parent
        let cellName = `${current.cameFrom.x},${current.cameFrom.y}`
        path.unshift(cellName);
        let previous = current.cameFrom
        current.cameFrom = null
        current = previous
    }
    return path;
}

function calculateHeuristic(node, goalNode) {
    const dx = Math.abs(node.x - goalNode.x);
    const dy = Math.abs(node.y - goalNode.y);

    const straightCost = 1;

    // calculate the estimated cost as the sum of horizontal and vertical distances
    const heuristic = straightCost * (dx + dy);

    return heuristic;
}

export function aStarAlgorithm(startNodeName, targetCellName) {
    const openSet = new Set();
    const closedSet = new Set();
    let path = []
    // assign initial values to the start node
    let startNode = grid[startNodeName]
    let goalNode = grid[targetCellName]
    startNode.g = 0;
    startNode.h = calculateHeuristic(startNode, goalNode);
    startNode.f = startNode.g + startNode.h;

    openSet.add(startNode);

    // keep track of the node with the lowest heuristic value
    let closestNode = startNode;

    while (openSet.size > 0) {
        // find the node with the lowest f score in the open set
        let currentNode = null;
        for (const node of openSet) {
            if (!currentNode || node.f < currentNode.f) {
                currentNode = node;
            }
        }

        if (currentNode === goalNode) {
            // Path found
            // console.log("path found!")
            return constructPath(currentNode);
        }

        openSet.delete(currentNode);
        closedSet.add(currentNode);

        for (const neighborId of currentNode.adj) {
            const neighbor = grid[neighborId];
            if (closedSet.has(neighbor) || neighbor.blocked) { // check if the neighbor is blocked
                // ignore the neighbor which is already evaluated or blocked
                continue;
            }

            const tentativeGScore = currentNode.g + getDistance(currentNode, neighbor);

            if (!openSet.has(neighbor)) {
                // discover a new node
                openSet.add(neighbor);
            } else if (tentativeGScore >= neighbor.g) {
                // this is not a better path
                continue;
            }

            // this path is the best until now
            neighbor.cameFrom = currentNode;
            neighbor.g = tentativeGScore;
            neighbor.h = calculateHeuristic(neighbor, goalNode);
            neighbor.f = neighbor.g + neighbor.h;

            // update the closest node if necessary
            if (neighbor.h < closestNode.h) {
                closestNode = neighbor;
            }
        }
    }

    // console.log("no path found, returning closest node")
    return constructPath(closestNode);
}