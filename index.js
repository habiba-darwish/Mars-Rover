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
        this.direction = direction; // For example: 'N', 'E', 'S', 'W' for cardinal directions.
    }
}

const moveOffsets = {
    'N': { dx: 0, dy: 1 },
    'E': { dx: 1, dy: 0 },
    'S': { dx: 0, dy: -1 },
    'W': { dx: -1, dy: 0 }
};

const turnLeft = {
    'N': 'W',
    'E': 'N',
    'S': 'E',
    'W': 'S'
};

const turnRight = {
    'N': 'E',
    'E': 'S',
    'S': 'W',
    'W': 'N'
};

// Function to process the commands
function processCommands(commands) {
    let p = new Point(4, 2, 'E');

    for (let c of commands) {
        if (c === 'F' || c === 'B') {
            // Calculate movement based on direction
            const offset = moveOffsets[p.direction];
            p.x += (c === 'F' ? offset.dx : -offset.dx); // Forward or Backward in x
            p.y += (c === 'F' ? offset.dy : -offset.dy); // Forward or Backward in y
        } else if (c === 'L') {
            // Rotate left
            p.direction = turnLeft[p.direction];
        } else if (c === 'R') {
            // Rotate right
            p.direction = turnRight[p.direction];
        } else {
            return { error: "Invalid command!" };
        }
    }

    return { x: p.x, y: p.y, direction: p.direction };
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
