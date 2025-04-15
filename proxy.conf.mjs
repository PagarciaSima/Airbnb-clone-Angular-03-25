// Exportamos un array con un objeto de configuración para el proxy
export default [
    {
        // 'context' define las rutas que deben ser redirigidas al backend
        context: ['/api', 'oauth2', '/login', '/assets'],
        // 'target' es la URL a la que se redirigirán las peticiones
        target: 'http://localhost:8080', // El backend Spring Boot, que corre en el puerto 8080
        // 'secure' se refiere a si la conexión con el target es segura (HTTPS)
        secure: true // En este caso, se espera que el backend sea accesible a través de HTTPS
    }
]
