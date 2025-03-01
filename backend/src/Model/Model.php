<?php

namespace Autocomplete\Model;

use Autocomplete\Services\DatabaseService;
use PDO;

class Model
{
    private ?PDO $conn;
    private string $fallbackFile;


    public function __construct()
    {
        $this->conn = DatabaseService::getConnection();
        $this->fallbackFile = __DIR__ . '/../../storage/fallback.json';

        if (!$this->conn && !file_exists($this->fallbackFile)) {
            throw new \RuntimeException("Database connection failed, and no fallback file found.");
        }
    }


    /**
     * Fetch a single employee by ID.
     */
    public function getEmployeeById(int $id)
    {

        if (!$this->conn) {
            return $this->getEmployeeByIdFromFallback($id);
        }

        try {
            $sql = "SELECT id, name, work_title, image_url, information
                    FROM employees
                    WHERE id = :id
                    LIMIT 1";

            $stmt = $this->conn->prepare($sql);
            $stmt->bindValue(':id', $id, PDO::PARAM_INT);
            $stmt->execute();

            $result = $stmt->fetch(PDO::FETCH_ASSOC);
            return $result ?: $this->getEmployeeByIdFromFallback($id);
        } catch (\PDOException $e) {
            error_log("Database error in getEmployeeById: " . $e->getMessage());
        }

        return null;
    }

    private function getEmployeeByIdFromFallback(int $id)
    {

        if (!file_exists($this->fallbackFile)) {
            return null;
        }

        $jsonData = file_get_contents($this->fallbackFile);
        $data = json_decode($jsonData, true);

        if (!isset($data['employees']) || !is_array($data['employees'])) {
            return null;
        }

        foreach ($data['employees'] as $employee) {
            if ((int)$employee['id'] === $id) {
                return $employee;
            }
        }

        return null;
    }


    /**
     * Search employees by name or work_title.
     */
    public function searchEmployees(string $query, bool $fullResults = false)
    {
        $limit = $fullResults ? 1000 : 5;

        if (!$this->conn) {
            return $this->searchEmployeesFromFallback($query, $limit);
        }

        try {
            $sql = "SELECT id, name, work_title, image_url
                    FROM employees
                    WHERE name LIKE :search OR work_title LIKE :search
                    ORDER BY name
                    LIMIT $limit";

            $stmt = $this->conn->prepare($sql);
            $param = "%$query%";
            $stmt->bindValue(':search', $param, PDO::PARAM_STR);
            $stmt->execute();

            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (\PDOException $e) {

            error_log("Database query failed: " . $e->getMessage());
        }

        return [];
    }


    private function searchEmployeesFromFallback(string $query, int $limit): array
    {
        if (!file_exists($this->fallbackFile)) {
            return [];
        }

        $jsonData = file_get_contents($this->fallbackFile);
        $data = json_decode($jsonData, true);

        if (!isset($data['employees']) || !is_array($data['employees'])) {
            return [];
        }

        $employees = $data['employees'];
        $filteredEmployees = [];

        foreach ($employees as $employee) {

            $name = $employee['name'] ?? '';
            $workTitle = $employee['work_title'] ?? '';


            if (stripos($name, $query) !== false || stripos($workTitle, $query) !== false) {
                $filteredEmployees[] = $employee;
            }
        }

        return array_slice($filteredEmployees, 0, $limit);
    }
}
