function getDistance(nodeA, nodeB) {
    const dx = Math.abs(nodeB.x - nodeA.x);
    const dy = Math.abs(nodeB.y - nodeA.y);

    const diagonalCost = 1.4;
    const straightCost = 1;

    // check if it's a diagonal move
    if (dx !== 0 && dy !== 0) {
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
    const path = [node];
    let current = node;
    while (current.cameFrom) { // use cameFrom instead of parent
        path.unshift(current.cameFrom);
        current = current.cameFrom;
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

export function aStarAlgorithm(startNode, goalNode, grid) {
    const openSet = new Set();
    const closedSet = new Set();

    // assign initial values to the start node
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
            console.log("path found!")
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

    // no path found, return the closest node instead
    console.log("no path found, returning closest node")
    return constructPath(closestNode);
}