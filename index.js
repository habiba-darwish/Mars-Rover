const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static('public')); // Serve static files from the public directory

class Point {
    constructor(x, y, direction) {
        this.x = x;
        this.y = y;
        this.direction = direction; // Cardinal directions: 'North', 'East', 'South', 'West'
    }
}

// Offsets for moving in each direction
const moveOffsets = {
    'North': { dx: 0, dy: 1 },
    'East': { dx: 1, dy: 0 },
    'South': { dx: 0, dy: -1 },
    'West': { dx: -1, dy: 0 }
};

// Turning directions
const turnLeft = {
    'North': 'West',
    'East': 'North',
    'South': 'East',
    'West': 'South'
};

const turnRight = {
    'North': 'East',
    'East': 'South',
    'South': 'West',
    'West': 'North'
};

// Example obstacle set (predefined)
const obstacleSet = new Set(['3,5', '7,4','2,3','1,4']);

function createPoint(x = 0, y = 0, direction = 'North') {
    return new Point(x, y, direction);
}

// Function to move the rover
function moveRover(point, offsetX, offsetY) {
    point.x += offsetX;
    point.y += offsetY;
}

// Function to handle movement and obstacle checking
function checkAndMove(point, offsetX, offsetY) {
    // Check if the new position has an obstacle
    if (obstacleSet.has(`${point.x + offsetX},${point.y + offsetY}`)) {
        return true; // Indicate that the rover should stop
    }

    // Move the rover if no obstacle
    moveRover(point, offsetX, offsetY);
    return false; // No need to stop
}

// Command handlers with `checkAndMove`
const commands = {
    'F': (point) => checkAndMove(point, moveOffsets[point.direction].dx, moveOffsets[point.direction].dy),
    'B': (point) => checkAndMove(point, -moveOffsets[point.direction].dx, -moveOffsets[point.direction].dy),
    'L': (point) => {
        point.direction = turnLeft[point.direction]; // Turn left
    },
    'R': (point) => {
        point.direction = turnRight[point.direction]; // Turn right
    }
};

// Higher-order function to process commands
function processCommands(commandsArray) {
    const rover = createPoint(); // Create a new rover instance
    let status = 'OK'; // Default status

    for (const command of commandsArray) {
        if (commands[command]) {
            const result = commands[command](rover);
            if (result) {
                status = 'STOPPED due to collision'; // If collision happens, update status and stop processing
                break;
            }
        } else {
            return { error: `Invalid command: ${command}` }; // Handle invalid commands
        }
    }

    // Return the final state of the rover
    return {
        x: rover.x,
        y: rover.y,
        direction: rover.direction,
        status: status
    };
}


function calculateCommands(startX, startY, startDirection, targetX, targetY) {
    const directionMovements = {
        'North': { dx: 0, dy: 1 },
        'South': { dx: 0, dy: -1 },
        'East': { dx: 1, dy: 0 },
        'West': { dx: -1, dy: 0 }
    };

    const turnLeft = { 'North': 'West', 'West': 'South', 'South': 'East', 'East': 'North' };
    const turnRight = { 'North': 'East', 'East': 'South', 'South': 'West', 'West': 'North' };

    function move(point, direction) {
        const newPoint = { ...point };
        newPoint.x += directionMovements[direction].dx;
        newPoint.y += directionMovements[direction].dy;
        return newPoint;
    }

    function isObstacle(point) {
        return obstacleSet.has(`${point.x},${point.y}`);
    }

    const initialPoint = createPoint(startX, startY, startDirection);
    const queue = [{ point: initialPoint, commands: '' }];
    const visited = new Set([`${startX},${startY},${startDirection}`]);

    while (queue.length > 0) {
        const { point, commands } = queue.shift();

        if (point.x === targetX && point.y === targetY) {
            return commands; // Target reached
        }

        // Forward
        const newPointF = move(point, point.direction);
        if (!isObstacle(newPointF) && !visited.has(`${newPointF.x},${newPointF.y},${point.direction}`)) {
            queue.push({ point: newPointF, commands: commands + 'F' });
            visited.add(`${newPointF.x},${newPointF.y},${point.direction}`);
        }

        // Left turn
        const newDirectionL = turnLeft[point.direction];
        if (!visited.has(`${point.x},${point.y},${newDirectionL}`)) {
            queue.push({ point: { ...point, direction: newDirectionL }, commands: commands + 'L' });
            visited.add(`${point.x},${point.y},${newDirectionL}`);
        }

        // Right turn
        const newDirectionR = turnRight[point.direction];
        if (!visited.has(`${point.x},${point.y},${newDirectionR}`)) {
            queue.push({ point: { ...point, direction: newDirectionR }, commands: commands + 'R' });
            visited.add(`${point.x},${point.y},${newDirectionR}`);
        }
    }

    return ''; // No path found
}






app.post('/api/commands', (req, res) => {
    const commands = req.body.commands;
    const result = processCommands(commands);
    res.json(result);
});

// API endpoint for target coordinate
app.post('/api/moveToTarget', (req, res) => {
    const { startX, startY, startDirection, targetX, targetY } = req.body;
    const commandString = calculateCommands(startX, startY, startDirection, targetX, targetY);
    res.json({ commands: commandString });
});

// Start the server
if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}

module.exports = {
    processCommands,
    calculateCommands // Export the function for testing
};
