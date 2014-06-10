<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');

$method = $_SERVER['REQUEST_METHOD'];
$resource = $_SERVER['REQUEST_URI'];
switch ($method) {
    case 'GET':
    	//BD Local
    	$conexion = mysql_connect("127.0.0.1", "root", "123456") or die("Error de conexion");

        if (!mysql_select_db("AhorcadoColaborativo",$conexion)) die(mysql_error());
        $sql='SELECT idPreguntas, Pregunta, Respuesta FROM preguntas WHERE Ronda = 1'; 
        $query = mysql_query($sql,$conexion);
        $resultado = ($query);
        $con = 0;
        while ($fila = mysql_fetch_array($resultado, MYSQL_NUM)) {
            $data[$con] = array('id' => $fila[0], 'pregunta' => htmlentities($fila[1]), 'respuesta' => rawurlencode($fila[2]));
            $con++;
        }
        $dato=json_encode($data);
        header('Content-type: application/json');
        echo '{"temario":'.$dato.'}';

    break;
    case 'POST':
        // código para método POST
        break;
    case 'PUT':
        // código para método PUT
        break;
    case 'DELETE':
        // código para método DELETE
        break;
}
?>