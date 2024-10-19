document.getElementById('submitButton').addEventListener('click', async () => {
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

        // Display the result in the specified format
        resultOutput.textContent = `(${result.x}, ${result.y}) ${result.direction}\n${result.status}`;
    } catch (error) {
        resultOutput.textContent = `Error: ${error.message}`;
    }
});
