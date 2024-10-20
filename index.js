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
const obstacleSet = new Set(['1,4', '3,5', '7,4','2,3']);

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
    const rover = createPoint(startX, startY, startDirection);
    let commands = '';

    // Movement action mapping
    const actions = {
        'F': (dx, dy) => {
            commands += 'F';
            return checkAndMove(rover, dx, dy);
        },
        'B': (dx, dy) => {
            commands += 'B';
            return checkAndMove(rover, -dx, -dy);
        },
        'L': () => {
            commands += 'L';
            rover.direction = turnLeft[rover.direction]; // Update direction
        },
        'R': () => {
            commands += 'R';
            rover.direction = turnRight[rover.direction]; // Update direction
        }
    };

    const directionActions = {
        'North': { move: () => actions['F'](moveOffsets['North'].dx, moveOffsets['North'].dy) },
        'South': { move: () => actions['B'](moveOffsets['South'].dx, moveOffsets['South'].dy) },
        'East': { move: () => actions['F'](moveOffsets['East'].dx, moveOffsets['East'].dy) },
        'West': { move: () => actions['B'](moveOffsets['West'].dx, moveOffsets['West'].dy) }
    };

    const turnMap = {
        'North': { 'East': ['R'], 'West': ['L', 'L'], 'South': ['L'] },
        'South': { 'East': ['L'], 'West': ['R'], 'North': ['L', 'L'] },
        'East': { 'North': ['L'], 'South': ['R'], 'West': ['L', 'L'] },
        'West': { 'North': ['R'], 'South': ['L'], 'East': ['L', 'L'] }
    };

    while (rover.x !== targetX || rover.y !== targetY) {
        const targetDirection = getTargetDirection(rover, targetX, targetY); // Pass rover as argument

        if (targetDirection) {
            // Get required turns and execute them
            const turns = turnMap[rover.direction][targetDirection] || [];
            turns.forEach(turn => actions[turn]()); // Execute turns

            // Move in the target direction
            directionActions[targetDirection].move();
        }
    }

    return commands; // Return the command string to reach the target
}

// Function to determine target direction
const getTargetDirection = (rover, targetX, targetY) => {
    if (rover.y < targetY) return 'North';
    if (rover.y > targetY) return 'South';
    if (rover.x < targetX) return 'East';
    if (rover.x > targetX) return 'West';
    return null; // Reached target
};



// API endpoint to process commands
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
