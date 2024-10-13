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

// Function to create a new Point
function createPoint(x = 0, y = 0, direction = 'North') {
    return new Point(x, y, direction);
}

// Function to move the rover
function moveRover(point, command) {
    const offset = moveOffsets[point.direction];
    // if (command === 'F') {
    //     point.x += offset.dx; // Move forward in x
    //     point.y += offset.dy; // Move forward in y
    // } else if (command === 'B') {
    //     point.x -= offset.dx; // Move backward in x
    //     point.y -= offset.dy; // Move backward in y
    // }
    point.x += (command === 'F' ? offset.dx : -offset.dx); // Forward or Backward in x
    point.y += (command === 'F' ? offset.dy : -offset.dy); // Forward or Backward in y
}

// Function to turn the rover
function turnRover(point, command) {
    // if (command === 'L') {
    //     point.direction = turnLeft[point.direction]; // Turn left
    // } else if (command === 'R') {
    //     point.direction = turnRight[point.direction]; // Turn right
    // }

    point.direction = (command ==='L'? turnLeft[point.direction] : turnRight[point.direction] );
}

// Function to process commands
function processCommands(commands) {
    const rover = createPoint(); // Create a new rover instance

    for (const command of commands) {
        if (['F', 'B'].includes(command)) {
            moveRover(rover, command); // Move the rover
        } else if (command === 'L' || command === 'R') {
            turnRover(rover, command); // Turn the rover
        } else {
            return { error: "Invalid command!" }; // Handle invalid commands
        }
    }

    return { x: rover.x, y: rover.y, direction: rover.direction }; // Return the final state of the rover
}

// API endpoint to process commands
app.post('/api/commands', (req, res) => {
    const commands = req.body.commands;
    const result = processCommands(commands);
    res.json(result);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
