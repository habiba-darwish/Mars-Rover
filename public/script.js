document.getElementById('submitCommandButton').addEventListener('click', async () => {
    const commandInput = document.getElementById('commandInput').value;
    const resultOutput = document.getElementById('resultOutput');

    // Clear the result output
    resultOutput.textContent = 'Processing...';

    try {
        // Send the command to the server
        const response = await fetch('/api/commands', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ commands: commandInput.split('') }), // Split input into individual commands
        });

        // Handle the response
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const result = await response.json();

        // Check if the server returned an error related to invalid commands
        if (result.error) {
            resultOutput.textContent = `Error: ${result.error}`;
        } else {
            // Display the result in the specified format
            resultOutput.textContent = `(${result.x}, ${result.y}) ${result.direction}\n${result.status}`;
        }
    } catch (error) {
        resultOutput.textContent = `Error: ${error.message}`;
    }
});

// Handle target submission
document.getElementById('submitTargetButton').addEventListener('click', async () => {
    const startX = parseInt(document.getElementById('startX').value);
    const startY = parseInt(document.getElementById('startY').value);
    const startDirection = document.getElementById('startDirection').value;
    const targetX = parseInt(document.getElementById('targetX').value);
    const targetY = parseInt(document.getElementById('targetY').value);
    const resultOutput = document.getElementById('resultOutput');
    resultOutput.textContent = 'Calculating commands...';
    try {
        const response = await fetch('/api/moveToTarget', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                startX: startX,
                startY: startY,
                startDirection: startDirection,
                targetX: targetX,
                targetY: targetY
            }),
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const result = await response.json();
        resultOutput.textContent = `Commands to reach target: ${result.commands}`;
    } catch (error) {
        resultOutput.textContent = `Error: ${error.message}`;
    }
});
