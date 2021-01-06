let express = require('express');

let bodyParser = require('body-parser');
let router = express.Router();
let algrmts= require('../src/algoritms');

router.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
router.use(bodyParser.json());

/*  GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'WebAPI Recaudaciones' });
});
/*  GET Recaudaciones Totales */
router.get('/recaudaciones', algrmts.getAll);

/*  POST Recaudacion detallada*/
router.post('/recaudaciones/detallada', algrmts.getComplet);

/*  POST Editar Recaudacion*/
router.post('/recaudaciones/id', algrmts.validate);

/*  POST Añadir Recaudacion*/
router.post('/recaudaciones/new', algrmts.insertNewCollection);
//CAMBIO
/* PUT Actualizar Observacion*/
router.put('/recaudaciones/observaciones',algrmts.updateObservation);

// GET Recaudacion
router.get('/recaudaciones/observaciones/:id',algrmts.getObservation);

/* GET Listar Conceptos */
router.get('/conceptos', algrmts.getAllConcepts);

/* GET Listar Tipos */
router.get('/tipos', algrmts.getAllTypes);

/* GET Listar Moneda */
router.get('/moneda', algrmts.getAllCoins);

/* GET Listar Ubicaciones */
router.get('/ubicaciones', algrmts.getAllUbications);

/* GET Obtener recibo */
router.get('/recibo/:id', algrmts.getReceipt);

//Inicio Nuevas rutas
router.get('/alumnos/:id', algrmts.getDataAlumno);
router.get('/programas', algrmts.getDataProgramas);

router.post('/desasignarRecibo', algrmts.fnDesasignarReciboAlumno);
router.post('/asignacionesDisponibles', algrmts.fnGetSiglaCodigoDisponibles);
router.post('/asignarCodigoPrograma', algrmts.fnAsignarCodigoAlumnoIdPrograma);
//Fin nuevas rutas

//Inicio Rutas prueba
router.post('/alumno/new', algrmts.insertNewAlumno);
router.get('/alumno/programa/:id',algrmts.getAlumnoPrograma);
router.post('/alumno/detallado/',algrmts.getAlumno);
router.post('/alumno/detallado/codigo/',algrmts.getAlumnoCodigo);

router.get('/alumno/recaudaciones/:id', algrmts.getAlumnoRecaudacion);
router.get('/alumno/sigla/:id', algrmts.getAlumnoSigla);

router.get('/sigla', algrmts.getAllSiglas);
router.get('/sigla/:nombre', algrmts.getSigla);
router.post('/programa/alumno/new', algrmts.insertNewPrograma);

router.post('/recaudaciones/fuera/new', algrmts.insertNewRecaudacion);


//Fin rutas Prueba

/* POST login */ 
router.post('/login', algrmts.login);

// cambio
/* GET perfil */
router.get('/perfil', algrmts.perfil);
router.get('/benef', algrmts.benef);
router.get('/config', algrmts.config);

module.exports = router;
