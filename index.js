const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static('public')); // Serve static files from the public directory

// Class representing the point (rover)
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
const obstacleSet = new Set(['1,4', '3,5', '7,4']);

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

// Function to execute commands (F, B, L, R)
function executeCommand(command, point) {
    const commandHandlers = {
        'F': () => checkAndMove(point, moveOffsets[point.direction].dx, moveOffsets[point.direction].dy),
        'B': () => checkAndMove(point, -moveOffsets[point.direction].dx, -moveOffsets[point.direction].dy),
        'L': () => {
            point.direction = turnLeft[point.direction];
            return false; // Turning doesn't stop the rover
        },
        'R': () => {
            point.direction = turnRight[point.direction];
            return false; // Turning doesn't stop the rover
        }
    };

    return commandHandlers[command] ? commandHandlers[command]() : { error: "Invalid command!" };
}

// Higher-order function to process commands with obstacle checking
function processCommands(commandsArray) {
    const rover = createPoint(); // Create a new rover instance
    let stopped = false;

    // Iterate over commands and process
    for (const command of commandsArray) {
        if (executeCommand(command, rover)) {
            stopped = true; // Stop as soon as an obstacle is hit
            break;
        }
    }

    // Return the final result based on whether the rover stopped or not
    return {
        x: rover.x,
        y: rover.y,
        direction: rover.direction,
        status: stopped ? "STOPPED due to collision" : "OK"
    };
}

// API endpoint to process commands
app.post('/api/commands', (req, res) => {
    const commands = req.body.commands;
    const result = processCommands(commands);
    res.json(result);
});

// Start the server
if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}

module.exports = {
    processCommands, // Export the function for testing
    executeCommand,  // Export individual functions if needed for testing
    checkAndMove     // Export the movement and obstacle checking function
};
