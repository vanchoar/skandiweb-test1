<?php
namespace App\Database;

class Database {
    private static $connection = null;

    public static function getConnection() {
        if (self::$connection === null) {
            ini_set('display_errors', 1);
            ini_set('display_startup_errors', 1);
            error_reporting(E_ALL);

            $host = "localhost";
            $dbname = "scandiweb3";
            $username = "root";
            $password = "palacinka";

            try {
                self::$connection = new \PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
                self::$connection->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
            } catch (\PDOException $e) {
                die("Connection failed: " . $e->getMessage());
            }
        }
        return self::$connection;
    }
}
