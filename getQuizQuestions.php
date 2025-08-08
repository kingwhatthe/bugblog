<?php 
    $conn = mysqli_connect("localhost", "root", "", "bug_blog");

    $results = [];
    if($conn->connect_error){
        http_response_code(500);
        echo json_encode(["error" => "Database connection failed"]);
        exit;
    }
    else {
        $results[] = json_encode("database connection works!");
    }

    header("Content-Type: application/json");

    if(isset($_POST['id'])){
        $id = intval($_POST['id']);
        $sql = "SELECT * FROM quiz_questions WHERE id = $id";
        $run = mysqli_query($conn, $sql);

        while($row = mysqli_fetch_array($run)){
            $results[] = $row;
            echo json_encode($row);
        }
    }
    else {
        $sql = "SELECT COUNT(*) FROM quiz_questions";
        $run = mysqli_query($conn,$sql);
        if ($run){
            $row = mysqli_fetch_array($run);
            echo json_encode($row[0]);
        }
        else{
            echo json_encode(["error" => "Query failed"]);
        }
    }
    
    

?>