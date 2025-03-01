<?php

namespace Autocomplete\Controllers;


use Autocomplete\Model\Model;


class Autocomplete
{
    public function getSuggestions($query)
    {

        header('Content-Type: application/json; charset=utf-8');

        // Trim white spaces
        $query = trim($query);

        // If the query is shorter then 2 return empty array
        if (strlen($query) < 2) {
            echo json_encode([]);
            return;
        }

        $fullResults = filter_var($_GET['fullResults'] ?? false, FILTER_VALIDATE_BOOLEAN);
        
        try {
            
            $model = new Model();
            $results = $model->searchEmployees($query, $fullResults);

        } catch (\RuntimeException $e) {

            http_response_code(503);
            echo json_encode([
                'error' => 'Service temporarily unavailable. Please try again later.'
            ]);
            return;
        } catch (\Exception $e) {

            http_response_code(500);
            echo json_encode([
                'error' => 'An unexpected error occurred. Please try again later.'
            ]);
            return;
        }

        $suggestions = [];
        foreach ($results as $row) {
            $suggestions[] = [
                'id' => $row['id'],
                'imageUrl' => $row['image_url'],
                'workTitle' => $row['work_title'],
                'name'      => $row['name'],
            ];
        }

        echo json_encode($suggestions);
    }
}
