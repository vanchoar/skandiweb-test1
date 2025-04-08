<?php
// testGraphQL.php

// The GraphQL query to fetch all products
// $query = '
// {
//   products {
//     id
//     name
//     description
//     category
//     attributes {
//       id
//     }
//   }
// }
// ';

// // Create the POST data as a JSON string
// $postData = json_encode([
//     'query' => $query,
// ]);

// // Replace with the correct URL to your graphql.php endpoint
// $graphqlUrl = 'http://localhost/scandiweb-test1/backend/controllers/GraphQL.php';

// // Initialize cURL
// $ch = curl_init($graphqlUrl);

// // Set cURL options to make a POST request with JSON data
// curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
// curl_setopt($ch, CURLOPT_POSTFIELDS, $postData);
// curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
// curl_setopt($ch, CURLOPT_HTTPHEADER, [
//     'Content-Type: application/json',
//     'Content-Length: ' . strlen($postData)
// ]);

// // Execute the request
// $response = curl_exec($ch);

// // Check for cURL errors
// if (curl_errno($ch)) {
//     echo 'cURL error: ' . curl_error($ch);
// }

// // Close the cURL session
// curl_close($ch);

// // Decode and print the JSON response
// header('Content-Type: text/plain'); // For easier reading in the browser
// echo "GraphQL Response:\n\n";
// // echo $response;





// The GraphQL query to fetch all products
// $query = '
// {
//   priceByProductId(productId: 1) {
//     id
//   }
// }
// ';

// // Create the POST data as a JSON string
// $postData = json_encode([
//     'query' => $query,
// ]);

// // Replace with the correct URL to your graphql.php endpoint
// $graphqlUrl = 'http://localhost/scandiweb-test1/backend/controllers/GraphQL.php';

// // Initialize cURL
// $ch = curl_init($graphqlUrl);

// // Set cURL options to make a POST request with JSON data
// curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
// curl_setopt($ch, CURLOPT_POSTFIELDS, $postData);
// curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
// curl_setopt($ch, CURLOPT_HTTPHEADER, [
//     'Content-Type: application/json',
//     'Content-Length: ' . strlen($postData)
// ]);

// // Execute the request
// $response = curl_exec($ch);

// // Check for cURL errors
// if (curl_errno($ch)) {
//     echo 'cURL error: ' . curl_error($ch);
// }

// // Close the cURL session
// curl_close($ch);

// // Decode and print the JSON response
// header('Content-Type: text/plain'); // For easier reading in the browser
// echo "GraphQL Response:\n\n";
// echo $response;


// require "db/db.php";
// // require "models/Price.php";
// require "models/Product.php";
// require "models/Attribute.php";

// use App\Database\Database;
// use Models\Attribute;

// $db = Database::getConnection();
// $productModel = new Attribute($db);

// $productId = '3'; // Change this to a valid product ID
// $product = $productModel->getAttributesValues();
// var_dump($product);
// echo "Fetched Product: " . json_encode($product, JSON_PRETTY_PRINT);



require_once "db/db.php";
require_once "models/Order.php";

use App\Database\Database;
use Models\Order;

$db = Database::getConnection();

$sampleCartItems = [
    [
        'productId' => 3,
        'name' => "PlayStation 5",
        'price' => ['amount' => 600, 'currency_symbol' => '$'],
        'gallery' => [
            ['image_url' => 'https://images-na.ssl-images-amazon.com/images/I/510VSJ9mWDL._SL1262_.jpg'],
            // ... add more images as needed
        ],
        'attributes' => [
            ['name' => 'Size', 'value' => 'XL'],
            ['name' => 'Color', 'value' => 'Black']
        ],
        'quantity' => 1,
    ]
];

$order = new Order($db, $sampleCartItems);
$result = $order->placeOrder();
echo "Order placed: " . ($result ? "Success" : "Failure");
