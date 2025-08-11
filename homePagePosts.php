<?php

    $conn = mysqli_connect("localhost","root","","bug_blog");
    $ranked = [];
    $recents = [];

    header("Content-type: application/json");

    if($conn->connect_error){
        http_response_code(500);
        echo json_encode(["error" => "Database connection failed"]);
        exit;
    
    }

    if(isset($_POST["id"])){
        $id = $_POST["id"];
        $sqli = "SELECT * FROM post WHERE id = $id";
        $run = mysqli_query($conn,$sqli);

        if($run){
            echo json_encode(mysqli_fetch_array($run));
        }
        else{
            echo json_encode(["error" => "Query failed"]);
        }
    }
    else{
        $sqli = "SELECT * FROM post ORDER BY rank ASC LIMIT 10";
        $run = mysqli_query($conn, $sqli);

        if($run){
            while($row = mysqli_fetch_assoc($run)){
                $ranked[]=$row;
            }
        }
        else{
            echo json_encode(["error" => "Query failed"]);
        }

        $sqli = "SELECT * FROM post ORDER BY date_posted DESC LIMIT 10";
        $run = mysqli_query($conn, $sqli);

        if($run){
            while($row = mysqli_fetch_assoc($run)){
                $recents[]=$row;
            }
            echo json_encode(["ranked" => $ranked,
                                "recents" => $recents]);
        }
        else{
            echo json_encode(["error" => "Query failed"]);
        }

    }

    
    
?>