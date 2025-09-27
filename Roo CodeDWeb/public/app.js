document.getElementById('appointmentForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = {
        client_name: document.getElementById('client_name').value,
        date: document.getElementById('date').value,
        time: document.getElementById('time').value,
        service_type: document.getElementById('service_type').value
    };

    try {
        const response = await fetch('/appointments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });

        const data = await response.json();
        const messageDiv = document.getElementById('message');

        if (response.ok) {
            messageDiv.className = 'message success';
            messageDiv.textContent = data.message;
            e.target.reset(); // Limpiar el formulario
        } else {
            messageDiv.className = 'message error';
            messageDiv.textContent = data.error || 'Error al crear la cita';
        }
    } catch (error) {
        document.getElementById('message').className = 'message error';
        document.getElementById('message').textContent = 'Error de conexión';
    }
});
