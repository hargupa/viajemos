
/*Funcion donde se envia el nombre de la ciudad
  y retorna la latitud y longitud para luego enviarlas
  a la funcion de trazadoMapa 	*/
function consulta(id=''){
	var idCiudad;
	if (id==''){
 		idCiudad = document.getElementById('ciudad').value;
	}else{
		idCiudad = ''+ id+ '';
	}
	
	var nomciudad;
	switch(idCiudad){
		case "1":
			nomciudad = 'orlando';
			break;
		case "2":
			nomciudad = 'miami';
			break;
		case "3":
			nomciudad = 'new york';
			break;

	}




	if(idCiudad!=0){
        $.ajax({ 
			type:"get",
			url:'datos.php?ciudad='+nomciudad,
			data:"",        	
            async:false,
            success: function (data, status) {
					var str_data_form = data;
					var datosExportados = str_data_form.split(",");
					trazadoMapa(datosExportados[0],datosExportados[1]);
					var html=  '<div class="alert alert-primary mt-4 text-center w-100" role="alert" >';
                    html = html +  '<strong>'+ datosExportados[2] + ' '+ datosExportados[3] + ' Humedad: ' + datosExportados[4]  +'% </stron></div>';  
                    document.getElementById('mensaje').innerHTML = html;
                    html = '<a href="#" class="list-group-item list-group-item-action" onclick="consulta('+idCiudad+');">'+datosExportados[2] + ' '+ datosExportados[3] + ' Humedad: ' + datosExportados[4]  +'%</a>';
                    if (id==''){
                    	document.getElementById('historial').innerHTML = document.getElementById('historial').innerHTML + html;
                    }
                    
                },
            error: function (xhr, textStatus, errorThrown) {
                
                alert('se presento un error '+ errorThrown );
            }
        });		
	}

}










//window.onload = function(){
function trazadoMapa(latitud,longitud){	
	var pos_original = new google.maps.LatLng(latitud, longitud);
	var options = {
		zoom: 13,
		center: pos_original,
		mapTypeId: google.maps.MapTypeId.SATELLITE,
		panControl: false,
  		zoomControl: false,
  		mapTypeControl: false,
  		scaleControl: false,
  		streetViewControl: false,
  		overviewMapControl: false

	};
	
	var map = new google.maps.Map(document.getElementById('map'), options);

//creando una infowindow
 var contentString = '<h1>Esto es una InfoWindow</h1>'+
 					 '<h2> :) </h2>'+
					 '<p>Como si fuera una web ;) </p>';

  var infowindow = new google.maps.InfoWindow({
      content: contentString
  });






var contador =0;
google.maps.event.addListener(map, 'click', function(resultado) 
{
console.log("click "+contador+" en lat:"+resultado.latLng.lat()+" , lng:"+resultado.latLng.lng());
gernera_marcador(resultado.latLng.lat(),resultado.latLng.lng(),contador);
contador++;
});

var array_marcadores = new Array();

function gernera_marcador(lat,lng,numero)
{
if(numero > 9) 
	{ 	//recorremos array para borrar todos los marcadores
		for(a in array_marcadores)
		{
			array_marcadores[a].setMap(null);  //borramos el marcador del mapa			
		}
		array_marcadores = []; //borramos todo nuestro array
		contador = 0; //ponemos el contador general a 0
		numero = 0; //ponemos el numero que le hemos passado ( en este caso seria el 10 ) a 0
	}

//miramos el icono a usar
var img1 = {
	url:'sprites.png',
	size:new google.maps.Size(50, 60), // ancho,alto
	origin: new google.maps.Point(numero*50,0), //origen
	anchor: new google.maps.Point(25,60) //ancla
}

var cadena="soy el marcador nº ";
cadena+=numero;
var marcador = new google.maps.Marker({
		position: new google.maps.LatLng(lat,lng),
		map: map,
		title: cadena,
		animation: google.maps.Animation.DROP,
		identificador: numero,
		draggable: true,
		icon : img1
		});
//apilamos marcador
array_marcadores.push(marcador);


	//anyadimos evento click en el marcador
	google.maps.event.addListener(marcador, 'click', function()
	{
		infowindow.open(map,marcador);
	});
}

//para comprovar que se van guardando pondremos un evento 'mouseout' en el mapa que nos 
//muestre los valores del array
google.maps.event.addListener(map, 'rightclick', function() 
{
console.log('----------------------------------');
for(var a=0;a<array_marcadores.length;a++)
	{
		console.log(
			"posición array : "+a+", identificador :"+ array_marcadores[a]['identificador']+", lat:"+array_marcadores[a].position.lat()+", lon :"+array_marcadores[a].position.lng()
			);
	}
});

//montamos evento click en el botón para que borre todos los marcadores
//funcion para limpiar todos los marcadores del mapa
	function eliminaMarcadores()
	{	
		console.log('Borrando todos los marcadores');
		for(a in array_marcadores)
		{
			array_marcadores[a].setMap(null);
		}
		array_marcadores = [];
	}
	//añadimos la función al boton con hooo!... un evento en el botón!


};
