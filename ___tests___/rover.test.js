// __tests__/rover.test.js
const { processCommands } = require('../index'); // Adjust the path if necessary

describe('Mars Rover Command Processing', () => {
    test('should move forward and return correct coordinates', () => {
        const commands = 'FFRFF'; 
        const result = processCommands(commands); 
        expect(result).toEqual({ x: 2, y: 2, direction: 'East' }); // Updated expected result
    });

    test('should turn left and move forward', () => {
        const commands = 'FLFF'; 
        const result = processCommands(commands);
        expect(result).toEqual({ x: -2, y: 1, direction: 'West' }); // Updated expected result
    });

    test('should handle invalid commands', () => {
        const commands = 'FLFZ'; 
        const result = processCommands(commands);
        expect(result).toEqual({ error: 'Invalid command!' });
    });

    test('should allow negative coordinates', () => {
        const commands = 'BBBB'; // Move backwards (y - 1)
        const result = processCommands(commands);
        expect(result).toEqual({ x: 0, y: -4, direction: 'North' }); // Updated expected result
    });
});
