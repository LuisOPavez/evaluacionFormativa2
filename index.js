document.addEventListener('DOMContentLoaded', function() {
    obtenerClima();

    const contactForm = document.getElementById('contactForm');
    contactForm.addEventListener('submit', function(event) {
        event.preventDefault();
        enviarConsulta();
    });
});

async function obtenerClima() {
    const apiKey = 'efce0e64f5ad4396814235825240605';
    const ciudad = 'Punta Arenas';
    const url = `http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${ciudad}&days=10&aqi=no&alerts=no`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        const dataTraducida = await traducirCondiciones(data);
        mostrarClima(dataTraducida);
    } catch (error) {
        console.error('Error al obtener el clima:', error);
    }
}

function mostrarClima(data) {
    const climaContainer = document.getElementById('clima-container');
    climaContainer.innerHTML = ''; // Limpiamos el contenido anterior

    const table = document.createElement('table');
    table.className = 'table table-bordered table-striped'; // Agregar clases de Bootstrap para tablas responsivas
    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');

    const encabezado = `
        <tr>
            <th>Fecha</th>
            <th>Máxima (°C)</th>
            <th>Mínima (°C)</th>
            <th>Viento (km/h)</th>
            <th>Condición</th>
            <th>Icono</th>
        </tr>
    `;
    thead.innerHTML = encabezado;

    const filas = data.forecast.forecastday.map(dia => `
        <tr>
            <td>${dia.date}</td>
            <td>${dia.day.maxtemp_c}</td>
            <td>${dia.day.mintemp_c}</td>
            <td>${dia.day.maxwind_kph}</td>
            <td>${dia.day.condition.text}</td>
            <td><img src="${dia.day.condition.icon}" alt="${dia.day.condition.text}" class="img-fluid"></td> <!-- Agregar clase img-fluid para hacer la imagen responsiva -->
        </tr>
    `).join('');

    tbody.innerHTML = filas;

    table.appendChild(thead);
    table.appendChild(tbody);
    climaContainer.appendChild(table);
}

async function traducirCondiciones(data) {
    const conditionListUrl = 'https://www.weatherapi.com/docs/conditions.json';
    try {
        const response = await fetch(conditionListUrl);
        const conditionList = await response.json();
        const translatedData = data.forecast.forecastday.map(dia => {
            const translatedCondition = obtenerTraduccion(dia.day.condition.text, conditionList);
            return {
                ...dia,
                day: {
                    ...dia.day,
                    condition: {
                        ...dia.day.condition,
                        text: translatedCondition
                    }
                }
            };
        });
        return { ...data, forecast: { ...data.forecast, forecastday: translatedData } };
    } catch (error) {
        console.error('Error al obtener la lista de condiciones:', error);
        return data; // Retorna los datos originales si hay un error
    }
}

function obtenerTraduccion(texto, conditionList) {
    const condition = conditionList.find(condicion => condicion.day === texto);
    return condition ? condition.languages.find(lang => lang.lang_iso === 'es').day_text : texto;
}

function enviarConsulta() {
    // Obtener los valores del formulario
    const nombre = document.getElementById('nombre').value;
    const celular = document.getElementById('celular').value;
    const email = document.getElementById('email').value;
    const pais = document.getElementById('pais').value;
    const ciudad = document.getElementById('ciudad').value;
    const consulta = document.getElementById('consulta').value;

    // Aquí puedes enviar los datos por correo electrónico o realizar alguna otra acción
    // Por ejemplo, puedes usar una API de envío de correos electrónicos como SendGrid o usar una función de servidor para enviar el correo.

    // Mostrar mensaje de éxito
    alert('¡Consulta enviada con éxito! Nos pondremos en contacto contigo pronto.');

    // Limpiar el formulario después de enviar la consulta
    document.getElementById('contactForm').reset();
}


function enviarConsulta() {
    // Obtener los valores del formulario
    const nombre = document.getElementById('nombre').value;
    const celular = document.getElementById('celular').value;
    const email = document.getElementById('email').value;
    const pais = document.getElementById('pais').value;
    const ciudad = document.getElementById('ciudad').value;
    const consulta = document.getElementById('consulta').value;

    // Aquí puedes enviar los datos por correo electrónico o realizar alguna otra acción
    // Por ejemplo, puedes usar una API de envío de correos electrónicos como SendGrid o usar una función de servidor para enviar el correo.

    // Mostrar mensaje de éxito
    alert('¡Consulta enviada con éxito! Nos pondremos en contacto contigo pronto.');

    // Limpiar el formulario después de enviar la consulta
    document.getElementById('contactForm').reset();
}
