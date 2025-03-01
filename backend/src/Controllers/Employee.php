<?php

namespace Autocomplete\Controllers;


use Autocomplete\Model\Model;


class Employee
{
   public function getEmployee($id)
{
    header('Content-Type: application/json; charset=utf-8');

    // Validate ID
    if (!is_numeric($id) || intval($id) <= 0) {
        echo json_encode(['error' => 'Invalid Employee ID']);
        return;
    }

    try {
        $model = new Model();
        $result = $model->getEmployeeById(intval($id));
    } catch (\RuntimeException $e) {
        http_response_code(503);
        echo json_encode(['error' => 'Service temporarily unavailable.']);
        return;
    } catch (\Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Unexpected error occurred.']);
        return;
    }

    if (empty($result)) {
        http_response_code(404);
        echo json_encode(['error' => 'Employee not found.']);
        return;
    }

    $employee = [
        'id'          => $result['id'],
        'imageUrl'    => $result['image_url'],
        'workTitle'   => $result['work_title'],
        'name'        => $result['name'],
        'information' => $result['information']
    ];

    echo json_encode($employee);
}

}
