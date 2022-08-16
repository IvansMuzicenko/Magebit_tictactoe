<?php
header('Content-Type: application/json');

const DATA_FILE = "data.json";

// url

$data = [];
if (file_exists(DATA_FILE)) {
    $content = file_get_contents(DATA_FILE);
    $data = json_decode($content, true);
    if (!is_array($data)) {
        $data = [];
    }
}


$output = ['status' => false];




if (isset($_GET["api-name"])) {
    switch ($_GET["api-name"]) {
        case 'add-cell':
            if (isset($_POST["addCell"]) && !in_array($_POST["addCell"], $data)) {
                $data[] = $_POST["addCell"];
                $content = json_encode($data);
                file_put_contents(DATA_FILE, $content);
                $output = [
                    'status' => true,
                    'message' => 'new item added',
                    "data" => $content
                ];
            }
            break;

        case "reset":
            $data = [];
            $content = json_encode($data);
            file_put_contents(DATA_FILE, $content);
            $output = [
                'status' => true,
                'message' => 'game reset',
                "data" => $content
            ];

            break;

        default:
            $output['status'] = true;
            $output['cells'] = $data;
            break;
    }
}

echo json_encode($output, JSON_PRETTY_PRINT);
