let cn = require('../src/dbconnection');
let db = cn.connection;
const numeral = require('numeral');

function SelectCollection(req, res, next, whereIN){
    let where = "WHERE "+whereIN;
    if (whereIN === "") where = "";

    let query = 
    "SELECT " +      
    "alumno_programa.dni_m AS dni, " +
    "concepto.concepto as concepto, " +
    "concepto.descripcion_min, " +   
    "recaudaciones.id_alum, " + 
    "recaudaciones.numero as recibo, " + 
    "recaudaciones.id_rec, " +
    "recaudaciones.id_registro, " +
    "recaudaciones.importe, " +
    "recaudaciones.fecha, " +
    "recaudaciones.id_ubicacion, " + 
    "recaudaciones.observacion_upg, " +
    "recaudaciones.observacion, " +
    "recaudaciones.validado, " +
    "moneda.moneda, " +
    "moneda.mascara, " +
    "programa.nom_programa as nombre_programa, " +
    "programa.sigla_programa, " +
    "programa.id_programa, " +
    "ubicacion.descripcion as ubicacion, "+
    "tipo.descripcion as tipo, "+
    "alumno_programa.cod_alumno as codigo, "+    
    "alumno.ape_nom as Nombre " +    
    "FROM recaudaciones " +    
    "INNER JOIN alumno ON recaudaciones.id_alum = alumno.id_alum " +    
    "JOIN concepto ON recaudaciones.id_concepto = concepto.id_concepto " +
    "JOIN clase_pagos ON concepto.id_clase_pagos = clase_pagos.id_clase_pagos " +    
    "LEFT JOIN alumno_programa ON (alumno_programa.cod_alumno = recaudaciones.cod_alumno) " +
    "LEFT JOIN programa ON alumno_programa.id_programa = programa.id_programa " +
    "LEFT JOIN ubicacion ON ubicacion.id_ubicacion = recaudaciones.id_ubicacion "+
    "LEFT JOIN moneda ON moneda.id_moneda = recaudaciones.moneda "+
    "LEFT JOIN tipo ON tipo.id_tipo = recaudaciones.id_tipo "+
        where +
    " ORDER BY alumno_programa.cod_alumno DESC,concepto.concepto,fecha;"

    //"INNER JOIN alumno_alumno_programa ON alumno_alumno_programa.id_alum = alumno.id_alum " +
    //"INNER JOIN alumno_programa ON alumno_programa.cod_alumno = alumno_alumno_programa.cod_alumno " +

    //console.log(query);
    db.any(query)
        .then(function(data){
            // data.forEach(element => {
            //     element.importe = 'S/.'+numeral(element.importe).format('0,0.00');
            // });
            res.status(200)
                .json({
                    status : 'success',
                    data:data,
                    message : 'Retrieved List'
                });
        })
        .catch(function(err){
            res.status(500)
                .json({
                    status : 'error',
                    message : err.stack
                });
        })
}
function SelectGeneral(req, res, next, table){
    let query = "Select * from "+table;
    if (table === "concepto")
        query = query +" JOIN clase_pagos ON concepto.id_clase_pagos = clase_pagos.id_clase_pagos "+
        "where clase_pagos.id_clase_pagos = 2";
    else if(table === "ubicacion")
        query = query + " order by 1;"

    db.any(query)
        .then(function(data){
            res.status(200)
                .json({
                    status : 'success',
                    data:data,
                    message : 'Retrieved List'
                });
        })
        .catch(function(err){
            return next(err);
        })
}
function UpdateObservation(req,res,next,id,message){
    let query = 'UPDATE public.recaudaciones SET'+
        ' observacion_upg='+message+
        ' WHERE id_rec='+id+';';
    console.log(query)
    db.any(query)
        .then(()=>{
            res.status(200)
                .json({
                    status : 'success',
                    message : 'Update success'
                })
        })
        .catch(err=>{
            return next(err);
        })
}
function UpdateQuery(req, res, next, when1, when2, when3, indices) {
    let ind = require('../src/algoritms');
    let query =`UPDATE recaudaciones SET ${ind.i_flag} = CASE ${ind.i_recaudacion} 
        ${when1}, ${ind.i_obs} = CASE ${ind.i_recaudacion} ${when2},
        ${ind.i_ubic} = CASE ${ind.i_recaudacion} ${when3}
         WHERE ${ind.i_recaudacion} IN (${indices})`;
    console.log(query);
    db.any(query)
        .then(function(data){
            res.status(200)
                .json({
                    status : 'success',
                    data:data,
                    message : 'Retrieved List'
                });
        })
        .catch(function (err) {
            console.log(err);
            return next(err);
        })
}
function GetReceipt(req,res,next,idRecibo){
    let query = `SELECT r.numero FROM recaudaciones as r WHERE r.numero='${idRecibo}'`;

    console.log(query);
    db.any(query)
        .then(function(data){
                
            if (data.length == 0) {
                recibo = 0;
            }else{
                recibo = 1;
            }
            res.status(200)
                .json({
                    response: recibo,
                });
        })
        .catch(function(err){
            return res.status(500)
                .json({
                    status : err.stack
                });
        });
}
function GetObservation(req,res,next,idObservacion){
    let query = `SELECT r.observacion_upg FROM recaudaciones as r WHERE r.id_rec=${idObservacion};`;
    let obs_upg;
    db.any(query)
        .then(function(data){
            
            if (data.length == 0) {
                obs_upg = [];
            }else{
                obs_upg = data[0]['observacion_upg'];
            }
            res.status(200)
                .json({
                    status : 'success',
                    data:obs_upg,
                    message : 'Get observarion succesfully'
                });
        })
        .catch(function(err){
            return res.status(500)
                .json({
                    status : 'error'
                });
        });
}
function InsertQuery(req, res, next, valores){
    let query=`insert into recaudaciones
    (id_alum, id_concepto, id_registro, id_ubicacion, cod_alumno, id_programa, numero, importe, observacion, fecha, validado, id_tipo, observacion_upg, moneda)
        values ${valores}`;
    console.log(query);
    db.any(query)
        .then(function(data){
            res.status(200)
                .json({
                    status : 'success',
                    data:data,
                    message : 'Retrieved List'
                });
        })
        .catch(function (err) {
            res.status(500)
            .json({
                status : 'error',
                message : err.stack
            });
        })
}

function InsertQuery2(req, res, next, valores){
    let query=`insert into recaudaciones
    (id_alum, id_concepto, id_registro, id_ubicacion, numero, importe, observacion, fecha, validado, id_tipo, observacion_upg, moneda)
        values ${valores}`;
    console.log(query);
    db.any(query)
        .then(function(data){
            res.status(200)
                .json({
                    status : 'success',
                    data:data,
                    message : 'Retrieved List'
                });
        })
        .catch(function (err) {
            res.status(500)
            .json({
                status : 'error',
                message : err.stack
            });
        })
}
function InsertQueryAlum(req, res, next, valores){
    let query=`insert into alumno
    (id_facultad, ape_nom, codigo, dni)
        values ${valores}`;
    console.log(query);
    db.any(query)
        .then(function(data){
            res.status(200)
                .json({
                    status : 'success',
                    data:data,
                    message : 'Retrieved List'
                });
        })
        .catch(function (err) {
            res.status(500)
            .json({
                status : 'error',
                message : err.stack
            });
        })
}

function InsertPrograma(req, res, next, valores){
    let query=`insert into alumno_programa
    (cod_alumno,ape_paterno,nom_alumno, id_programa)
        values ${valores}`;
    console.log(query);
    db.any(query)
        .then(function(data){
            res.status(200)
                .json({
                    status : 'success',
                    data:data,
                    message : 'Retrieved List'
                });
        })
        .catch(function (err) {
            res.status(500)
            .json({
                status : 'error',
                message : err.stack
            });
        })
}

//Nuevas queries
function selectDatosAlumno(req, res, next, numRecibo) {
 
    let query = `SELECT r.id_alum,r.numero as numero_recibo, r.cod_alumno, ap.ape_paterno, ap.ape_materno, ap.nom_alumno 
    FROM alumno_programa ap 
    INNER JOIN recaudaciones r
    ON ap.cod_alumno = r.cod_alumno WHERE r.numero ='${numRecibo}'`;
    console.log(query);
    db.any(query)
        .then(function(data) {
            res.status(200)
                .json({
                    status: 'success',
                    data: data,
                    message: 'Retrieved List'
                });
        })
        .catch(function(err) {
            return next(err);
        });
    }
//Prueba 
function BuscaAlumnoPrograma(req, res, next, codigo) {
 
    let query = `SELECT ap.ape_paterno, ap.ape_materno, ap.nom_alumno, ap.id_programa, ap.dni_m 
    FROM alumno_programa ap WHERE ap.cod_alumno ='${codigo}'`;
    let encontro=true;
    console.log(query);
    db.any(query)
        .then(function(data) {
            res.status(200)
                .json({
                    status: 'success',
                    data: data,
                    message: 'Retrieved List'
                });
        })
        .catch(function(err) {
            return next(err);
        });
    }
    function SelectSiglas(req, res, next){
        let query = "SELECT distinct id_programa,sigla_programa FROM programa";
    
        db.any(query)
            .then(function(data){
                res.status(200)
                    .json({
                        status : 'success',
                        data:data,
                        message : 'Retrieved List'
                    });
            })
            .catch(function(err){
                return next(err);
            })
    }
    
    function SelectSiglanombre(req, res, next,nombre){
        let query = `SELECT id_programa FROM programa where sigla_programa='${nombre}'`;    
        db.any(query)
            .then(function(data){
                res.status(200)
                    .json({
                        status : 'success',
                        data:data,
                        message : 'Retrieved List'
                    });
            })
            .catch(function(err){
                return next(err);
            })
    }
    function BuscaAlumnoRecaudacion(req, res, next, codigo) {
 
        let query = `SELECT * FROM recaudaciones where cod_alumno ='${codigo}'`;
        let encontro=true;
        console.log(query);
        db.any(query)
            .then(function(data) {
                res.status(200)
                    .json({
                        status: 'success',
                        data: data,
                        message: 'Retrieved List'
                    });
            })
            .catch(function(err) {
                return next(err);
            });
        }    
    function BuscaAlumno(req, res, next, nombre,codigo) {
 
        let query = `SELECT * FROM alumno where ape_nom ='${nombre}' AND dni = '${codigo}'`;
        console.log(query);
        db.any(query)
            .then(function(data) {
                res.status(200)
                    .json({
                        status: 'success',
                        data: data,
                        message: 'Retrieved List'
                    });
            })
            .catch(function(err) {
                return next(err);
            });
        }
        
        function BuscaAlumnoCodigo(req, res, next,codigo) {
 
            let query = `SELECT * FROM alumno where codigo = '${codigo}'`;
            console.log(query);
            db.any(query)
                .then(function(data) {
                    res.status(200)
                        .json({
                            status: 'success',
                            data: data,
                            message: 'Retrieved List'
                        });
                })
                .catch(function(err) {
                    return next(err);
                });
            }
        function getProgramaAlumno(req, res, next, codigo) {
            
            let query = `select p.sigla_programa as sigla from programa p inner join alumno_programa a ON p.id_programa=a.id_programa  where p.id_programa=${codigo}`;
            console.log(query);
            db.any(query)
                .then(function(data) {
                    res.status(200)
                        .json({
                            status: 'success',
                            data: data,
                            message: 'Retrieved List'
                        });
                })
                .catch(function(err) {
                    return next(err);
                });
            }
    function getProgramas(req, res, next) {
 
        let query = `SELECT id_programa, sigla_programa,nom_programa FROM programa`;
        console.log(query);
        db.any(query)
            .then(function(data) {
                res.status(200)
                    .json({
                        status: 'success',
                        data: data,
                        message: 'Retrieved List'
                    });
            })
            .catch(function(err) {
                return next(err);
            });
        }
 


//-> Desasignar 2 --> Solo desasigna con el numero de recibo
function desasignarReciboAlumno(req, res, next, values) {
    //console.log(valores);
    let query = `UPDATE recaudaciones 
    SET cod_alumno = null, 
    id_programa = null 
    WHERE numero ='${values}'`;

    console.log(query);
    db.any(query)
        .then(function(data) {
            res.status(200)
                .json({
                    status: 'success',
                    data: data,
                    message: 'Retrieved List'
                });
        })
        .catch(function(err) {
            res.status(500)
                .json({
                    status: 'error',
                    message: err.stack
                });
        })
}

//-> Asignar con Codigo, DNI, Nombre, Apellido paterno, apellido materno
function asignarAlumnoPrograma_Nombre_AppPaterno_AppMaterno(req, res, next, nombre, app_pat, app_mat){
    let query = `SELECT CONCAT(alumno_programa.cod_alumno,'/',alumno_programa.id_programa) as
    ids,alumno_programa.cod_alumno, 
    alumno_programa.id_programa, 
    CONCAT(alumno_programa.cod_alumno,' / ', 
           alumno_programa.nom_alumno, ' ', 
           alumno_programa.ape_paterno, ' ', 
           alumno_programa.ape_materno, ' / ', 
           programa.sigla_programa) as Campos_para_asignar 
    FROM 
    alumno_programa 
    INNER JOIN programa 
    ON alumno_programa.id_programa = programa.id_programa 
    WHERE 
    alumno_programa.nom_alumno = '${nombre}' AND 
    alumno_programa.ape_paterno = '${app_pat}' AND
    alumno_programa.ape_materno = '${app_mat}'`;
    
    console.log(query);
    db.any(query)
        .then(function(data) {
            res.status(200)
                .json({
                    status: 'success',
                    data: data,
                    message: 'Retrieved List'
                });
        })
        .catch(function(err) {
            res.status(500)
                .json({
                    status: 'error',
                    message: err.stack
                });
        })
}

function asignarAlumnoPrograma_Nombre_AppPaterno(req, res, next, nombre, app_pat){
    let query = `SELECT CONCAT(alumno_programa.cod_alumno,'/',alumno_programa.id_programa) as
    ids,alumno_programa.cod_alumno, 
    alumno_programa.id_programa, 
    CONCAT(alumno_programa.cod_alumno,' / ', 
           alumno_programa.nom_alumno, ' ', 
           alumno_programa.ape_paterno, ' ', 
           alumno_programa.ape_materno, ' / ', 
           programa.sigla_programa) as Campos_para_asignar 
    FROM 
    alumno_programa 
    INNER JOIN programa 
    ON alumno_programa.id_programa = programa.id_programa 
    WHERE 
    alumno_programa.nom_alumno = '${nombre}' AND 
    alumno_programa.ape_paterno = '${app_pat}' `;
    
    console.log(query);
    db.any(query)
        .then(function(data) {
            res.status(200)
                .json({
                    status: 'success',
                    data: data,
                    message: 'Retrieved List'
                });
        })
        .catch(function(err) {
            res.status(500)
                .json({
                    status: 'error',
                    message: err.stack
                });
        })
}

function asignarAlumnoPrograma_Nombre_AppMaterno(req, res, next, nombre, app_mat){
    let query = `SELECT CONCAT(alumno_programa.cod_alumno,'/',alumno_programa.id_programa) as
    ids,alumno_programa.cod_alumno, 
    alumno_programa.id_programa, 
    CONCAT(alumno_programa.cod_alumno,' / ', 
           alumno_programa.nom_alumno, ' ', 
           alumno_programa.ape_paterno, ' ', 
           alumno_programa.ape_materno, ' / ', 
           programa.sigla_programa) as Campos_para_asignar 
    FROM 
    alumno_programa 
    INNER JOIN programa 
    ON alumno_programa.id_programa = programa.id_programa 
    WHERE 
    alumno_programa.nom_alumno = '${nombre}' AND 
    alumno_programa.ape_materno = '${app_mat}' `;
    
    console.log(query);
    db.any(query)
        .then(function(data) {
            res.status(200)
                .json({
                    status: 'success',
                    data: data,
                    message: 'Retrieved List'
                });
        })
        .catch(function(err) {
            res.status(500)
                .json({
                    status: 'error',
                    message: err.stack
                });
        })
    
}

function asignarAlumnoPrograma_AppPaterno_AppMaterno(req, res, next, app_pat, app_mat){
    let query = `SELECT CONCAT(alumno_programa.cod_alumno,'/',alumno_programa.id_programa) as
    ids,alumno_programa.cod_alumno, 
    alumno_programa.id_programa, 
    CONCAT(alumno_programa.cod_alumno,' / ', 
           alumno_programa.nom_alumno, ' ', 
           alumno_programa.ape_paterno, ' ', 
           alumno_programa.ape_materno, ' / ', 
           programa.sigla_programa) as Campos_para_asignar 
    FROM 
    alumno_programa 
    INNER JOIN programa 
    ON alumno_programa.id_programa = programa.id_programa 
    WHERE 
    alumno_programa.ape_paterno = '${app_pat}' AND 
    alumno_programa.ape_materno = '${app_mat}' `;
    
    console.log(query);
    db.any(query)
        .then(function(data) {
            res.status(200)
                .json({
                    status: 'success',
                    data: data,
                    message: 'Retrieved List'
                });
        })
        .catch(function(err) {
            res.status(500)
                .json({
                    status: 'error',
                    message: err.stack
                });
        })
}

function asignarAlumnoPrograma_Nombre(req, res, next, nombre){
    let query = `SELECT CONCAT(alumno_programa.cod_alumno,'/',alumno_programa.id_programa) as
    ids,alumno_programa.cod_alumno, 
    alumno_programa.id_programa, 
    CONCAT(alumno_programa.cod_alumno,' / ', 
           alumno_programa.nom_alumno, ' ', 
           alumno_programa.ape_paterno, ' ', 
           alumno_programa.ape_materno, ' / ', 
           programa.sigla_programa) as Campos_para_asignar 
    FROM 
    alumno_programa 
    INNER JOIN programa 
    ON alumno_programa.id_programa = programa.id_programa 
    WHERE 
    alumno_programa.nom_alumno LIKE '%${nombre}' OR 
    alumno_programa.nom_alumno LIKE '${nombre}%'`;
    
    console.log(query);
    db.any(query)
        .then(function(data) {
            res.status(200)
                .json({
                    status: 'success',
                    data: data,
                    message: 'Retrieved List'
                });
        })
        .catch(function(err) {
            res.status(500)
                .json({
                    status: 'error',
                    message: err.stack
                });
        })
}

function asignarAlumnoPrograma_codigo(req, res, next, codigo){
    let query = `SELECT CONCAT(alumno_programa.cod_alumno,'/',alumno_programa.id_programa) as
    ids,alumno_programa.cod_alumno, 
    alumno_programa.id_programa, 
    CONCAT(alumno_programa.cod_alumno,' / ', 
           alumno_programa.nom_alumno, ' ', 
           alumno_programa.ape_paterno, ' ', 
           alumno_programa.ape_materno, ' / ', 
           programa.sigla_programa) as Campos_para_asignar 
    FROM 
    alumno_programa 
    INNER JOIN programa 
    ON alumno_programa.id_programa = programa.id_programa 
    WHERE 
    alumno_programa.cod_alumno = '${codigo}'`;
    
    console.log(query);
    db.any(query)
        .then(function(data) {
            res.status(200)
                .json({
                    status: 'success',
                    data: data,
                    message: 'Retrieved List'
                });
        })
        .catch(function(err) {
            res.status(500)
                .json({
                    status: 'error',
                    message: err.stack
                });
        })
}

function asignarAlumnoPrograma_dni(req, res, next, dni){
    let query = `SELECT CONCAT(alumno_programa.cod_alumno,'/',alumno_programa.id_programa) as
    ids,alumno_programa.cod_alumno, 
    alumno_programa.id_programa, 
    CONCAT(alumno_programa.cod_alumno,' / ', 
           alumno_programa.nom_alumno, ' ', 
           alumno_programa.ape_paterno, ' ', 
           alumno_programa.ape_materno, ' / ', 
           programa.sigla_programa) as Campos_para_asignar 
    FROM 
    alumno_programa 
    INNER JOIN programa 
    ON alumno_programa.id_programa = programa.id_programa 
    WHERE 
    alumno_programa.dni_m = '${dni}'`;
    
    console.log(query);
    db.any(query)
        .then(function(data) {
            res.status(200)
                .json({
                    status: 'success',
                    data: data,
                    message: 'Retrieved List'
                });
        })
        .catch(function(err) {
            res.status(500)
                .json({
                    status: 'error',
                    message: err.stack
                });
        })
}

function asignarCodigoAlumnoIdPrograma(req, res, next, cod_alumno, id_programa, numero_recibo){
    let query = `UPDATE recaudaciones SET cod_alumno = '${cod_alumno}', id_programa = ${id_programa} WHERE numero = '${numero_recibo}'`;
    
    console.log(query);
    db.any(query)
        .then(function(data) {
            res.status(200)
                .json({
                    status: 'success',
                    data: data,
                    message: 'Retrieved List'
                });
        })
        .catch(function(err) {
            res.status(500)
                .json({
                    status: 'error',
                    message: err.stack
                });
        })
}

function asignarAlumnoPrograma_AppPaterno(req, res, next, app_pat){
    let query = `SELECT CONCAT(alumno_programa.cod_alumno,'/',alumno_programa.id_programa) as
    ids,alumno_programa.cod_alumno, 
    alumno_programa.id_programa, 
    CONCAT(alumno_programa.cod_alumno,' / ', 
           alumno_programa.nom_alumno, ' ', 
           alumno_programa.ape_paterno, ' ', 
           alumno_programa.ape_materno, ' / ', 
           programa.sigla_programa) as Campos_para_asignar 
    FROM 
    alumno_programa 
    INNER JOIN programa 
    ON alumno_programa.id_programa = programa.id_programa 
    WHERE 
    alumno_programa.ape_paterno = '${app_pat}'`;
    
    console.log(query);
    db.any(query)
        .then(function(data) {
            res.status(200)
                .json({
                    status: 'success',
                    data: data,
                    message: 'Retrieved List'
                });
        })
        .catch(function(err) {
            res.status(500)
                .json({
                    status: 'error',
                    message: err.stack
                });
        })
}

function asignarAlumnoPrograma_AppMaterno(req, res, next, app_mat){
    let query = `SELECT CONCAT(alumno_programa.cod_alumno,'/',alumno_programa.id_programa) as
    ids,alumno_programa.cod_alumno, 
    alumno_programa.id_programa, 
    CONCAT(alumno_programa.cod_alumno,' / ', 
           alumno_programa.nom_alumno, ' ', 
           alumno_programa.ape_paterno, ' ', 
           alumno_programa.ape_materno, ' / ', 
           programa.sigla_programa) as Campos_para_asignar 
    FROM 
    alumno_programa 
    INNER JOIN programa 
    ON alumno_programa.id_programa = programa.id_programa 
    WHERE 
    alumno_programa.ape_materno = '${app_mat}'`;
    
    console.log(query);
    db.any(query)
        .then(function(data) {
            res.status(200)
                .json({
                    status: 'success',
                    data: data,
                    message: 'Retrieved List'
                });
        })
        .catch(function(err) {
            res.status(500)
                .json({
                    status: 'error',
                    message: err.stack
                });
        })
}

async function login(username, password){
    let query = 'SELECT * FROM comparar_password($1::character varying,$2::character varying)'
    username = username.toUpperCase().trim()
    username+=" "
    const data = await db.any(query, [username, password])

    return data[0].comparar_password
}   

async function login2(username, password){
    let query = 'SELECT * FROM comparar_password($1::character varying,$2::character varying)'
    username = username.toUpperCase().trim()
    const data = await db.any(query, [username, password])

    return data[0].comparar_password
} 

// cambio
async function Perfil(username){
    let query = 'SELECT * FROM obtener_perfil($1::character varying)'
    username = username.toUpperCase().trim()
    const data = await db.any(query, username)

    return data[0].obtener_perfil
}

async function Benef(cod){
    let query = 'SELECT * FROM obtener_benef($1::character varying)'
    cod = cod.toUpperCase().trim()
    const data = await db.any(query, cod)

    return data[0].obtener_benef
}

async function Config(){
    let query = 'SELECT * FROM obtener_config()'
    const data = await db.any(query)

    return data[0].obtener_config
}

module.exports = {
    //Inicio Modificación
    selectDatosAlumno,
    getProgramas,
    
    desasignarReciboAlumno,
    asignarAlumnoPrograma_Nombre_AppPaterno_AppMaterno,
    asignarAlumnoPrograma_Nombre_AppPaterno,
    asignarAlumnoPrograma_Nombre_AppMaterno,
    asignarAlumnoPrograma_AppPaterno_AppMaterno,
    asignarAlumnoPrograma_AppPaterno,
    asignarAlumnoPrograma_AppMaterno,
    asignarAlumnoPrograma_Nombre,
    asignarAlumnoPrograma_codigo,
    asignarAlumnoPrograma_dni,
    asignarCodigoAlumnoIdPrograma,
    //Fin Modificación

    SelectGeneral:SelectGeneral,
    SelectCollection:SelectCollection,
    UpdateObservation:UpdateObservation,
    GetObservation:GetObservation,
    UpdateQuery:UpdateQuery,
    GetReceipt:GetReceipt,
    InsertQuery:InsertQuery,
    InsertQueryAlum:InsertQueryAlum,
    BuscaAlumnoPrograma:BuscaAlumnoPrograma,
    BuscaAlumnoCodigo:BuscaAlumnoCodigo,
    BuscaAlumno:BuscaAlumno,
    BuscaAlumnoRecaudacion:BuscaAlumnoRecaudacion,
    getProgramaAlumno:getProgramaAlumno,
    SelectSiglas:SelectSiglas,
    SelectSiglanombre:SelectSiglanombre,
    InsertPrograma:InsertPrograma,
    InsertQuery2:InsertQuery2,
    //Login
    Login: login,
    Login2: login2,
    // cambio
    Perfil: Perfil,
    Benef: Benef,
    Config: Config
};
