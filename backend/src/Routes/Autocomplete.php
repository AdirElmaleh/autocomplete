<?php

use Autocomplete\Controllers\Autocomplete;
use Autocomplete\Controllers\Employee;

$requestUri = $_SERVER['REQUEST_URI'];
$method = $_SERVER['REQUEST_METHOD'];

// Check if the route is /autocomplete
if (strpos($requestUri, '/autocomplete') !== false && $method === 'GET') {
    
    $queryParam = $_GET['query'] ?? '';
    // Create controller to handle autocomplete
    $controller = new Autocomplete();
    $controller->getSuggestions($queryParam);
    exit();
}

if (strpos($requestUri, '/employee') !== false && $method === 'GET') {
    
    $queryParam = $_GET['query'] ?? '';
    // Create controller to handle autocomplete
    $controller = new Employee();
    $controller->getEmployee($queryParam);
    exit();
}

// If no route matches, return 404
http_response_code(404);
echo json_encode(['error' => 'Not Found']);
