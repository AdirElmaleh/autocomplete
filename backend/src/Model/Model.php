<?php

namespace Autocomplete\Model;

use Autocomplete\Services\DatabaseService;
use PDO;

class Model
{
    private PDO $conn;


    public function __construct()
    {
        $this->conn = DatabaseService::getConnection();

        if (!$this->conn) {
            throw new \RuntimeException("Database connection failed.");
        }
    }

    /**
     * Get all employees from the database.
     */
    public function getAllIEmployees(): array
    {
        $sql = "SELECT * FROM employees";
        $stmt = $this->conn->query($sql);

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    /**
     * Fetch a single employee by ID naybe will be needed in the future.
     */
    public function getEmployeeById(int $id): ?array
    {
        $sql = "SELECT id, name, work_title, image_url, information
                FROM employees
                WHERE id = :id
                LIMIT 1";

        // Prepare query
        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(':id', $id, PDO::PARAM_INT);
        $stmt->execute();

        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        return $result ?: null;
    }

     /**
     * Search items by name or work_title.
     */
    public function searchEmployees(string $query, bool $fullResults = false): array
    {
        $limit = $fullResults ? 1000 : 5;

        $sql = "SELECT id, name, work_title, image_url
                FROM employees
                WHERE name LIKE :search OR work_title LIKE :search
                ORDER BY name
                LIMIT $limit";

        $stmt = $this->conn->prepare($sql);
        $param = "%$query%";
        $stmt->bindValue(':search', $param, PDO::PARAM_STR); // Prefix search
        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }


    /**
     * Create a new item. Returns the new item's ID.
     */
    public function createEmployee(string $name, string $workTitle, string $imageUrl): int
    {
        $sql = "INSERT INTO employees (name, work_title, image_url)
                VALUES (:name, :work_title, :image_url)";

        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(':name', $name);
        $stmt->bindValue(':work_title', $workTitle);
        $stmt->bindValue(':image_url', $imageUrl);

        $stmt->execute();
        return (int) $this->conn->lastInsertId();
    }

    /**
     * Update an existing item by ID.
     */
    public function updateEmployee(int $id, string $name, string $workTitle, string $imageUrl): bool
    {
        $sql = "UPDATE employees
                SET name = :name, work_title = :work_title, image_url = :image_url
                WHERE id = :id";

        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(':name', $name);
        $stmt->bindValue(':work_title', $workTitle);
        $stmt->bindValue(':image_url', $imageUrl);
        $stmt->bindValue(':id', $id, PDO::PARAM_INT);

        return $stmt->execute();
    }

    /**
     * Delete an item by ID.
     */
    public function deleteEmployee(int $id): bool
    {
        $sql = "DELETE FROM employees WHERE id = :id";

        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(':id', $id, PDO::PARAM_INT);

        return $stmt->execute();
    }
}
