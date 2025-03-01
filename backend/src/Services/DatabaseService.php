<?php

namespace Autocomplete\Services;

use PDO;
use PDOException;

class DatabaseService
{
    private static $pdo = null;

    public static function getConnection()
    {
        if (self::$pdo === null) {

            $config = require __DIR__ . '/../../config/db.php';
            $dsn = "mysql:host={$config['host']};dbname={$config['dbname']};charset=utf8mb4";

            try {
                self::$pdo = new PDO($dsn, $config['user'], $config['password']);
                self::$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            } catch (PDOException $e) {
                // Handle connection error
                error_log("Database connection failed: " . $e->getMessage()); // Log the error
                throw new \RuntimeException("Database connection failed.");
            }
        }

        return self::$pdo;
    }
}
