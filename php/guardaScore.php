<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');

$method = $_SERVER['REQUEST_METHOD'];
$resource = $_SERVER['REQUEST_URI'];

$scores = explode(",", $_POST['scores']);
$iniciales = $_POST['iniciales'];

switch ($method) {
    case 'GET':
    	// código para método GET
        break;
    case 'POST':
        //BD Local
        $conexion = mysql_connect("127.0.0.1", "root", "123456") or die("Error de conexion");
        if (!mysql_select_db("AhorcadoColaborativo",$conexion)) die(mysql_error());

        foreach ($scores as $clave => $valor) {
            $tmp = explode("|", $scores[$clave]);
            $aciertos = intval($tmp[0]);
            $errores = intval($tmp[1]);
            $tiempo = intval($tmp[2]);
            $sql='INSERT INTO Scores VALUES(0,"'.$iniciales.'",1,'.$aciertos.','.$errores.','.$tiempo.')'; 
            $query = mysql_query($sql,$conexion);
        }
        break;
    case 'PUT':
        // código para método PUT
        break;
    case 'DELETE':
        // código para método DELETE
        break;
}
?>