/* global resulTRows */

'use strict';

// short name, version, display name, max size
var dbupeu = openDatabase('UPeU', '1.0', 'Ejemplo por caso Académico', 2 * 1024 * 1024);
    

dbupeu.transaction(function(tx) {
  tx.executeSql('DROP TABLE IF EXISTS persona');
  tx.executeSql('DROP TABLE IF EXISTS usuario');  
  tx.executeSql('CREATE TABLE IF NOT EXISTS persona(idPersona integer unique primary key AUTOINCREMENT, nombre varchar(100), apellidos varchar(100),dni varchar(10),fechanacimiento date(4),genero varchar(10) ,estudio varchar(10),email varchar(100),telefono varchar(10))', [], null, handleError);
  tx.executeSql('CREATE TABLE IF NOT EXISTS usuario(idUsuario integer unique primary key AUTOINCREMENT, usuario VARCHAR(30) NOT NULL,clave VARCHAR(60) NOT NULL, idPersona integer, FOREIGN KEY (idPersona) REFERENCES persona (idPersona))', [], null, handleError);
 
}, null, null); // error handler, success handler

function handleError(transaction, error) {
  transaction = null; // dummy statement to avoid jshint error...
  log('Something went wrong: ' + error.message + ', code: ' + error.code);
  return false;
}


function agregarPersona(nombre,apellidos,fechanacimiento,email,dni,genero,estudio,telefono) {
  dbupeu.transaction(function(tx) {
    tx.executeSql('INSERT INTO persona (nombre,apellidos,dni,fechanacimiento,genero,estudio,email,telefono) VALUES(?, ?, ?,?, ?, ?,?,?)', [nombre,
        apellidos,dni,fechanacimiento,genero,estudio,email,telefono
    ]);
  }, handleError, function() {        
    buscarPersona("");
  });
}

var storeButton = document.getElementById('storeButton');
var nombre = document.getElementById('nombre');
var apellidos = document.getElementById('apellidos');
var dni = document.getElementById('dni');
var fechanacimiento = document.getElementById('fechanacimiento');
var genero = document.getElementById('genero');
var estudio = document.getElementById('estudio');
var email = document.getElementById('email');
var telefono = document.getElementById('telefono');
var idPersona = document.getElementById('idPersona');
storeButton.addEventListener('click', function() {
 console.log("FN:"+fechanacimiento.value);
    agregarPersona(nombre.value, apellidos.value,dni.value,fechanacimiento.value,genero.value,estudio.value, email.value, telefono.value);
  if(idPersona==""){
    agregarPersona(nombre.value, dni.value, telefono.value);
  }else{
   actualizarPersona(nombre.value, dni.value, telefono.value, idPersona.value)   ;
  }
  
});

var dataElement = document.getElementById('data');
function log(message) {
  //alert(message);
  console.log(message);
  dataElement.innerHTML = message;
}


function buscarPersona(text) {
  dbupeu.transaction(function(tx) { // readTransaction() is apparently faster
    var resulTRows="";  
    var statement = 'SELECT idPersona, nombre, apellidos, dni, fechanacimiento, email, telefono, genero, estudio FROM persona WHERE nombre like "%'+text+'%"';
    //var statement = 'SELECT artist, song FROM songs WHERE artist LIKE "%' +text + '%" OR song like "%' + text + '%"';
    // array unused here: ? field values not used in query statement
    tx.executeSql(statement, [], function(thisTx, results) {
      var numRows = results.rows.length;
      
      for (var i = 0; i !== numRows; ++i) {
        var rows= results.rows.item(i);
        
        resulTRows+='<tr><td>' + rows.idPersona + '</td>'+'<td>' + rows.nombre + '</td>'+'<td>' + rows.apellidos + '</td>'+'<td>'+ rows.fechanacimiento + '</td>'+ rows.email + '</td>'+'<td>'+'<td>' + rows.dni + '</td>'+'<td>' + rows.telefono + '</td>'+'<td style="text-align: center"><a href="#" onclick="eliminarPersona('+rows.idPersona+')">X</a> <a href="#" onclick="editarPersona('+rows.idPersona+')">E</a> </td></tr>';        
        console.log(resulTRows);
      }
      log(resulTRows);
    }, handleError);
  });
  return resulTRows;
}
var storeButton = document.getElementById('storeButton');
var nombre = document.getElementById('nombre');
var apellidos = document.getElementById('apellidos');
var dni = document.getElementById('dni');
var fechanacimiento = document.getElementById('fechanacimiento');
var genero = document.getElementById('genero');
var estudio = document.getElementById('estudio');
var email = document.getElementById('email');
var telefono = document.getElementById('telefono');
var idPersona = document.getElementById('idPersona');
storeButton.addEventListener('click', function() {
 console.log("FN:"+fechanacimiento.value);
    agregarPersona(nombre.value, apellidos.value,dni.value,fechanacimiento.value,genero.value,estudio.value, email.value, telefono.value);

// tx.executeSql("DELETE FROM songs WHERE SONG=?", [song], handleError, null);


function eliminarPersona(id){
  dbupeu.transaction(function(tx) {
    tx.executeSql("DELETE FROM persona WHERE idPersona=?", [id], handleError, null);
  }, handleError, function() {        
    buscarPersona("");
  });    
}


function editarPersona(id) {

  dbupeu.transaction(function(tx) { // readTransaction() is apparently faster
    var resulTRows="";  
    var statement = 'SELECT idPersona,nombre,apellidos,dni,fechanacimiento,genero,estudio,email,telefono, estudio FROM persona WHERE idPersona = "'+id+'"';
    //var statement = 'SELECT artist, song FROM songs WHERE artist LIKE "%' +text + '%" OR song like "%' + text + '%"';
    // array unused here: ? field values not used in query statement
    tx.executeSql(statement, [], function(thisTx, results) {
      var numRows = results.rows.length;
         // alert(numRows);
      for (var i = 0; i !== numRows; ++i) {
        var rows= results.rows.item(i);
        nombre.value=rows.nombre;
        apellidos.value=rows.apellidos;
        dni.value=rows.dni;
        fechanacimiento.value=rows.fechanacimiento;
        email.value=rows.email;
        telefono.value=rows.telefono;
        genero.value=rows.genero;
        estudio.value=rows.estudio;
        idPersona.value=rows.idPersona;
       // resulTRows+='<tr><td>' + rows.idPersona + '</td>'+'<td>' + rows.nombre + '</td>'+'<td>' + rows.dni + '</td>'+'<td>' + rows.telefono + '</td>'+'<td style="text-align: center"><a href="#" onclick="eliminarPersona('+rows.idPersona+')">X</a> <a href="#" onclick="eliminarPersona('+rows.idPersona+')">E</a> </td></tr>';        
      }
      buscarPersona("");
      //log(resulTRows);
      
    }, handleError);
  });
 // return resulTRows;
}


var findButton = document.getElementById('findButton');
var query = document.getElementById('queryx');
findButton.addEventListener('click', function() {
  buscarPersona(query.value);
});