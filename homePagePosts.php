<?php
    header("Content-type: application/json");
    $conn = mysqli_connect("localhost","root","","bug_blog");
    $ranked = [];

    if($conn->connect_error){
        http_response_code(500);
        echo json_encode(["error" => "Database connection failed"]);
        exit;
    
    }



    $sqli = "SELECT * FROM post ORDER BY rank ASC LIMIT 10";
    $run = mysqli_query($conn, $sqli);

    if($run){
        while($row = mysqli_fetch_assoc($run)){
            $ranked[]=$row;
        }
        echo json_encode($ranked);
    }
    else{
        echo json_encode(["error" => "Query failed"]);
    }

    
?>