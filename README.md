# PruebaFront
Cambios en el back-end: (Faltan guardar en el GitHub real)
- queries.js  : Nuevo query 'Perfil'
- algoritms.js: Nueva función 'perfil'
- index.js    : Agregado 'router.get('/perfil', algrmts.perfil)'

2.0
- queries.js  : Nuevo query 'Bened'
- algoritms.js: Nueva función 'benef'
- index.js    : Agregado 'router.get('/benef', algrmts.benef)'

Cambios en el front-end: (Faltan guardar en el GitHub real)
- API.js          : Se conecta con el back-end local, no con el que esta desplegado en heroku (Cambiar cuando termine las pruebas)
- global/Login.js : Aqui se recuperará el perfil y se enviara al localStorage
- Content.js	  : Se recupera el perfil del localStorage para desactivar los botones y al cerrar sesión se borra el perfil del localStorage	

2.0
- API.js          : Que apunte al deploy de Heroku
- Modal2          : Cambios para mostrar las tablas

Cambios en la BBDD:
- Creada la function 'obtener_perfil' para recuperar el perfil de un usuario (Ya esta en la BD)

Deploys:

- FrontEnd: https://prueba1front.herokuapp.com
- BackEnd: https://prueba1back.herokuapp.com
