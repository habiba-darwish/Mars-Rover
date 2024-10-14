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

// Command functions
const commands = {
    'F': (point) => {
        const offset = moveOffsets[point.direction];
        point.x += offset.dx; // Move forward in x
        point.y += offset.dy; // Move forward in y
    },
    'B': (point) => {
        const offset = moveOffsets[point.direction];
        point.x -= offset.dx; // Move backward in x
        point.y -= offset.dy; // Move backward in y
    },
    'L': (point) => {
        point.direction = turnLeft[point.direction]; // Turn left
    },
    'R': (point) => {
        point.direction = turnRight[point.direction]; // Turn right
    },
};

// Higher-order function to process commands
function processCommands(commandsArray) {
    const rover = createPoint(); // Create a new rover instance

    for (const command of commandsArray) {
        if (commands[command]) {
            commands[command](rover); // Call the command function
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
if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}
module.exports = {
    processCommands // Export the function for testing
};