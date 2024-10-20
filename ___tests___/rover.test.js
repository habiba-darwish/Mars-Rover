// __tests__/rover.test.js
const { processCommands, calculateCommands } = require('../index');

describe('Mars Rover Command Processing', () => {
    test('should move forward and return correct coordinates', () => {
        const commands = ['F', 'F', 'R', 'F', 'F']; // Move forward, forward, turn right, forward, forward
        const result = processCommands(commands);
        expect(result).toEqual({ x: 2, y: 2, direction: 'East', status: 'OK' }); // Updated expected result
    });

    test('should turn left and move forward', () => {
        const commands = ['F', 'L', 'F', 'F']; // Move forward, turn left, forward, forward
        const result = processCommands(commands);
        expect(result).toEqual({ x: -2, y: 1, direction: 'West', status: 'OK' }); // Updated expected result
    });

    test('should handle invalid commands', () => {
        const commands = ['F', 'L', 'F', 'Z']; // Move forward, turn left, forward, invalid command
        const result = processCommands(commands);
        expect(result).toEqual({ error: 'Invalid command: Z' }); // Handle invalid command and return specific error
    });    

    test('should allow negative coordinates', () => {
        const commands = ['B', 'B', 'B', 'B']; // Move backwards (y - 1)
        const result = processCommands(commands);
        expect(result).toEqual({ x: 0, y: -4, direction: 'North', status: 'OK' }); // Updated expected result
    });

    // New test case for handling collision
    test('should stop before a collision with an obstacle', () => {
        const commands = ['F', 'F', 'F', 'F', 'R','F']; // Move forward 5 times
        const result = processCommands(commands);
        expect(result).toEqual({ x: 0, y: 4, direction: 'East', status: 'STOPPED due to collision' }); // Updated expected result
    });

    // New test case for immediate collision
    test('should stop before a collision with an obstacle', () => {
        const commands = ['R', 'F', 'F', 'L', 'F', 'F','F']; // Move forward to collision
        const result = processCommands(commands);
        expect(result).toEqual({ x: 2, y: 2, direction: 'North', status: 'STOPPED due to collision' }); // Stops at (0,4)
    });
});

describe('Mars Rover Command Calculation', () => {
    test('should calculate commands to move to (2,2) from (0,0) facing East', () => {
        const result = calculateCommands(0, 0, 'East', 2, 2);
        expect(result).toEqual('LFFRFF'); // Example expected command string to reach (2, 2)
    });
    test('should calculate commands to move to (2,1) from (-1,1) facing North', () => {
        const result = calculateCommands(-1, -1, 'North', 2, 1);
        expect(result).toEqual('FFRFFF'); // Example expected command string to reach (2, 2)
    });
});