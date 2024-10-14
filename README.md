# Mars Rover API

## Overview

This Mars Rover API translates commands from Earth into instructions understood by the rover on Mars. The rover is initialized with its coordinates and direction, and it can move forward, backward, and turn left or right based on the commands it receives. The API processes command sequences and returns the final coordinates and direction of the rover after executing all commands.

The valid commands are:
- `F` -> Move forward on the current heading.
- `B` -> Move backward on the current heading.
- `L` -> Rotate left by 90 degrees.
- `R` -> Rotate right by 90 degrees.

Example command sequence: `FLFFFRFLB`

## Features

- Processes multiple commands in a single sequence.
- Supports moving forward/backward and rotating left/right.
- Handles invalid commands with proper error messages.
- Allows negative coordinates, assuming Mars has no "edge of the world."
- Includes unit tests for the command processing logic.

## Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/yourusername/mars-rover-api.git
   ```

2. **Navigate to the project directory**:

   ```bash
   cd mars-rover-api
   ```

3. **Install the dependencies**:

   ```bash
   npm install
   ```

## Usage

### Running the API

1. **Start the server**:

   ```bash
   npm start
   ```

   This will start the server at `http://localhost:3000`.

2. **Send API requests**:

   - **Endpoint**: `/api/commands`
   - **Method**: `POST`
   - **Request Body**:

     ```json
     {
       "commands": "FLFFFRFLB"
     }
     ```

   - **Response**:

     ```json
     {
       "x": 6,
       "y": 4,
       "direction": "North"
     }
     ```

### Example

To test the API, you can use a tool like Postman or cURL to send a POST request:

```bash
curl -X POST http://localhost:3000/api/commands -H "Content-Type: application/json" -d '{"commands":"FFRFF"}'
```

The response will return the final coordinates and direction of the rover:

```json
{
  "x": 2,
  "y": 2,
  "direction": "East"
}
```

### Running Unit Tests

To ensure the application works as expected, unit tests have been written for the command processing logic. You can run the tests using:

```bash
npm test
```

This will run the test cases and provide output for the following scenarios:
- Moving forward and turning right.
- Turning left and moving forward.
- Handling invalid commands.
- Allowing negative coordinates.

## Project Structure

```
mars-rover-api/
├── public/            # Static files (if needed)
├── __tests__/         # Unit test files
│   └── rover.test.js  # Unit tests for the rover logic
├── index.js           # Main server and rover logic
├── package.json       # Project configuration and dependencies
└── README.md          # Project documentation
```

## API Logic Breakdown

1. **Rover Initialization**:
   - The rover is initialized with coordinates `(x, y)` and a direction (`North`, `East`, `South`, `West`).
  
2. **Processing Commands**:
   - The rover processes commands sequentially:
     - `F` (Forward): Moves the rover one unit in its current direction.
     - `B` (Backward): Moves the rover one unit in the opposite direction.
     - `L` (Left): Rotates the rover 90 degrees counterclockwise.
     - `R` (Right): Rotates the rover 90 degrees clockwise.

3. **Command Validation**:
   - Invalid commands are caught and an error message is returned.

## Optional Enhancements

- **REST API**: The application provides an API endpoint to process commands sent to the rover.
- **Customization**: You can modify the initial coordinates and direction by editing the `createPoint` function in the code.
  
