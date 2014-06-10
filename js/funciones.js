$(document).on("ready", function(){
	$("#BtnEmpezar").on("click",IniciaJuego);
	$("#Siguiente").on("click",SecuenciaPreguntas);
});

function IniciaJuego(){
	$("#Presentacion").hide();
	$("#JuegoAhorcado").show();
	sessionStorage.setItem("palabra",0);
	sessionStorage.setItem("contador",0);
	generaLetras();
	CargaPreguntas();
}

var respuesta = "";
var longitud = 0;
var Preguntas = [];
var indice = 0;
var scores = [];

function CargaPreguntas(){
	//Recupero las preguntas de la BD
	$.getJSON('php/servicioPreguntas.php', function(data) {
	  	$.each(data.temario, function(indice, valor) {
	  		window.Preguntas[indice] = valor;
	  	});
	});
	//SecuenciaPreguntas(indice);
}

function Clean(){
	$("#Pregunta").empty();
	$("#Palabra").empty();
	$("#resultado").empty();
	$("#success").hide();
	$("#warning").hide();
	$("#danger").hide();
	$("#ContenedorAbecedario").show();
	$("#letras li a").removeClass("Usado");
	$("#ContenedorTimer").show();
	//Contador
    $('#timer').countdowntimer({
        seconds :15,
        size : "lg"
    });
    //Fin contador
	window.aciertos = 0;
	window.errores = 0;

	sessionStorage.setItem("palabra",0);
	sessionStorage.setItem("contador",0);
}

function SecuenciaPreguntas(){
	Clean();

	var palabra = "";
	var pregunta = window.Preguntas[window.indice].pregunta;
	var respuestaCorrecta = window.Preguntas[window.indice].respuesta;

  	window.respuesta = unescape(respuestaCorrecta);
  	window.longitud = respuestaCorrecta.length;
  	//Genero los espacios en blanco de acuerdo al número de letras de la respuesta
	for(i=0; i<longitud; i++){
		palabra += "<span><input type='text' name='l"+i+"' id='l"+i+"'></span>" 
	}
  	$("#Palabra").append(palabra);
	$("#Pregunta").append(pregunta);
	window.indice++;
}

var abecedario = new Array();
function generaLetras(){
	abecedario = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "ñ", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
	var letras = "";
	//Creo los botones para cada una de las letras del abecedario
	for(i=0; i<27; i++){
		letras += "<li><a id='"+abecedario[i]+"'>"+abecedario[i]+"</a></li>";
	}
	$("#letras").append(letras);
	$("#letras li a").on("click", function(){
		var seleccionada = $(this).text();
		ValidaLetra(seleccionada);
	});
}


//Incializo variables para contabilizar aciertos y errores
var aciertos = 0;
var errores = 0;

function ValidaLetra(li){
	var tiempo = parseInt($('#timer').html().split(" ")[0]);
	if(tiempo > 0){
		//Recupero el valor de la letra que escribió el jugador
		var letraIngresada = String(li);
		//Cambio el estilo para que aparezca la letra presionada
		$("#"+letraIngresada).addClass("Usado");
		//Obtengo la posicion de letra elegida en la palabra a adivinar
		var arrayRespuesta = window.respuesta.split("");
		var posiciones = new Array();
		var j = 0;
		for(i=0; i<window.longitud; i++){
			if(arrayRespuesta[i] == letraIngresada){
				posiciones[j] = i;
				j++;
			}
		}
		resp = posiciones == "" ? -1 : posiciones;

		//Si la letra existe dentro de la palabra
		if(resp != -1){
			aciertos++;
			pos = resp.length;
			for(i=0;i<pos;i++){
				//Contador que se va incrementando conforme haya letras que existan en la palabra
				var contPalabra = parseInt(sessionStorage.getItem("palabra")) + 1;
				sessionStorage.setItem("palabra",contPalabra);
				$("#l"+resp[i]).val(letraIngresada);

				ValidaGanado();
			}
			
		}
		//Si la letra NO existe dentro de la palabra
		else{
			errores++;
			//Contador para sumar los intentos e ir pintando cada parte del monito ahorcado
			var contador = parseInt(sessionStorage.getItem("contador")) + 1;
			sessionStorage.setItem("contador",contador);

			//Envío a todos los jugadores la letra que ingresaron
			DibujaAhorcado(contador);
		}
	}else{
		$("#ContenedorAbecedario").hide();
		$("#warning").show();
		window.scores.push(aciertos+"|"+errores+"|"+(15 - parseInt($('#timer').html().split(" ")[0])));
	}
}

function ValidaGanado(){
	//Valida si el valor del contador es igual a la longitud de la palabra a adivinar para indicar que ya ganó y deneter el juego
	if(sessionStorage.getItem("palabra") == window.longitud){
		$("#ContenedorAbecedario").hide();
		$("#ContenedorTimer").hide();
		$("#success").show();
		$("#resultado").show();
		$("#resultado").html("Tuviste "+aciertos+" acierto(s), "+errores+" error(es) y tardaste "+(15 - parseInt($('#timer').html().split(" ")[0]))+" segundos.");
		window.scores.push(aciertos+"|"+errores+"|"+(15 - parseInt($('#timer').html().split(" ")[0])));
	}
}

function DibujaAhorcado(contador){
	switch(contador){
		case 1: 
			//dibuja la cabeza
			$("#cabeza").show();
		break;
		case 2: 
			//dibuja el tronco
			$("#tronco").show();
		break;
		case 3:
			//dibuja el brazo izquierdo
			$("#brazoizquierdo").show();
		break;
		case 4:
			//dibuja el brazo derecho
			$("#brazoderecho").show();
		break;
		case 5:
			//dibuja la pierna izquierda
			$("#pieizquierdo").show();
		break;
		case 6:
			//dibuja la pierna derecha y pierde
			$("#piederecho").show();
			$("#ContenedorAbecedario").hide();
			$("#ContenedorTimer").hide();
			$("#danger").show();
			window.scores.push(aciertos+"|"+errores+"|"+(15 - parseInt($('#timer').html().split(" ")[0])));
			var str = window.respuesta.split("");
			for(i=0; i<window.longitud; i++){
				$("#l"+i).val(str[i]);
			}
		break;
		default: $("#monito").show();	
	}
}