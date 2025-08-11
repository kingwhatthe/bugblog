<?php

    $conn = mysqli_connect("localhost","root","","bug_blog");
    $posts = [];

    header("Content-type: application/json");

    if($conn->connect_error){
        http_response_code(500);
        echo json_encode(["error" => "Database connection failed"]);
        exit;
    
    }

    if(isset($_POST["query"]) 
        && isset($_POST["searchBy"]) 
        && isset($_POST["sortBy"])){

        $query = mysqli_real_escape_string($conn, $_POST["query"]);
        $searchBy = mysqli_real_escape_string($conn, $_POST["searchBy"]);
        $sortBy = mysqli_real_escape_string($conn, $_POST["sortBy"]);
        $sqli = "";

        if ($searchBy == "order"){
            $sqli = "SELECT * FROM post 
            WHERE LOWER(TRIM(SUBSTRING_INDEX(taxonomical_info, ',', -1))) = '$query'
            ORDER BY `$sortBy`";
        }
        else{
            $sqli = "SELECT * FROM post WHERE `$searchBy` = '$query' ORDER BY `$sortBy`";
        }

        $run = mysqli_query($conn,$sqli);

        if($run){
            while($row = mysqli_fetch_assoc($run)){
                $posts[]=$row;
            }
            echo json_encode($posts);
        }
        else{
            echo json_encode(["error" => "Query failed"]);
        }
    }
    
    
?>