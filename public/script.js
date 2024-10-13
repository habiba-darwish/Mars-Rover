// script.js
document.getElementById('submit').addEventListener('click', async () => {
    const commands = document.getElementById('commands').value;

    const response = await fetch('/api/commands', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ commands })
    });

    const result = await response.json();
    const resultDiv = document.getElementById('result');
    
    if (result.error) {
        resultDiv.innerHTML = `<span style="color: red;">${result.error}</span>`;
    } else {
        resultDiv.innerHTML = `(${result.x}, ${result.y}) ${result.direction}`;
    }
});


