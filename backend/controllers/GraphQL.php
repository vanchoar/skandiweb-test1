<?php

namespace App\Controller;

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once "../db/db.php";
require_once "../models/Product.php";
require_once "../models/Category.php";
require_once "../models/Gallery.php";
require_once "../models/Attribute.php";
require_once "../models/Price.php";
require_once "../models/AttributeValue.php"; 
require_once "../models/Order.php"; 
require_once '../../vendor/autoload.php';

use GraphQL\GraphQL as GraphQLBase;
use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\Type;
use GraphQL\Type\Definition\InputObjectType;
use GraphQL\Type\Schema;
use RuntimeException;
use Throwable;

use App\Database\Database;
use Models\Product;
use Models\Category;
use Models\Attribute;
use Models\Price;
use Models\Gallery;
use Models\AttributeValue;
use Models\Order;

class GraphQL {
    static public function handle() {
        try {
            $db = Database::getConnection();

            // Define Attribute Value Type
            $attributeValueType = new ObjectType([
                'name' => 'AttributeValue',
                'fields' => [
                    'id' => Type::int(),
                    'displayValue' => Type::string(),
                    'value' => Type::string()
                ]
            ]);

            // Define Price Type
            $priceType = new ObjectType([
                'name' => 'Price',
                'fields' => [
                    'id' => Type::int(),
                    'product_id' => Type::int(),
                    'amount' => Type::float(),
                    'currency_label' => Type::string(),
                    'currency_symbol' => Type::string(),
                ]
            ]);

            // Define Gallery Type
            $galleryType = new ObjectType([
                'name' => 'Gallery',
                'fields' => [
                    'id' => Type::int(),
                    'product_id' => Type::int(),
                    'image_url' => Type::string()
                ]
            ]);

            // Define Attribute Type
            $attributeType = new ObjectType([
                'name' => 'Attribute',
                'fields' => [
                    'id' => Type::int(),
                    'name' => Type::string(),
                    'items' => [
                        'type' => Type::listOf($attributeValueType),
                        'resolve' => function ($attribute, $args, $context) use ($db) {
                             // If we're nested under a product, getAttributesByProductId already
                // populated 'items' for this attribute.
                if (isset($attribute['items'])) {
                    return $attribute['items'];
                }
                // Otherwise (e.g. standalone attributes query), fall back to full list
                
                            $attributeValueModel = new AttributeValue($db);
                            return $attributeValueModel->getValuesByAttributeId($attribute['id']);
                        }
                    ]
                ]
            ]);

            $cartItemInputType = new InputObjectType([
                'name'   => 'CartItemInput',
                'fields' => [
                    'productId' => ['type' => Type::nonNull(Type::int())],
                    'quantity'  => ['type' => Type::nonNull(Type::int())],
                ],
            ]);



            // Define Product Type
            $productType = new ObjectType([
                'name' => 'Product',
                'fields' => [
                    'id' => Type::int(),
                    'name' => Type::string(),
                    'description' => Type::string(),
                    'price' => [
                        'type' => $priceType, // If expecting multiple prices; if only one, consider returning a single Price object.
                        'resolve' => function ($product, $args, $context) use ($db) {
                            $priceModel = new Price($db);
                            $prices = $priceModel->getOneByProductId($product['id']);
                            return $prices;
                        }
                    ],
                    'gallery' => [
                        'type' => Type::listOf($galleryType),
                        'resolve' => function ($product, $args, $context) use ($db) {
                            // $productModel = new Product($db);
                            // return $productModel->getGalleryByProductId($product['id']);
                            $galleryModel = new Gallery($db);
                            return $galleryModel->getAllByProductId($product['id']);
                        }
                    ],
                    'inStock' => Type::int(),
                    'category' => Type::string(),
                    'attributes' => [
                        'type' => Type::listOf($attributeType),
                        'resolve' => function ($product, $args, $context) use ($db) {
                            $attributeModel = new Attribute($db);
                            return $attributeModel->getAttributesByProductId($product['id']);
                        }
                    ]
                ]
            ]);

            // Define Category Type
            $categoryType = new ObjectType([
                'name' => 'Category',
                'fields' => [
                    'id' => ['type' => Type::int()],
                    'name' => ['type' => Type::string()],
                ],
            ]);

            // Define Query Type
            $queryType = new ObjectType([
                'name' => 'Query',
                'fields' => [
                    'categories' => [
                        'type' => Type::listOf($categoryType),
                        'resolve' => function ($root, $args, $context) use ($db) {
                            $categoryModel = new Category($db);
                            return $categoryModel->getAll();
                        }
                    ],
                    'products' => [
                        'type' => Type::listOf($productType),
                        'resolve' => function ($root, $args, $context) use ($db) {
                            $productModel = new Product($db);
                            return $productModel->getAll();
                        }
                    ],
                    'attributesValues' => [
                        'type' => Type::listOf($attributeType),
                        'resolve' => function ($root, $args, $context) use ($db) {
                            $attributesModel = new Attribute($db);
                            return $attributesModel->getAll();
                        }
                    ],
                    
                    'product' => [
                        'type' => $productType,
                        'args' => [
                            'productId' => Type::nonNull(Type::int())
                        ],
                        'resolve' => function ($root, $args, $context) use ($db) {
                            $productModel = new Product($db);
                            return $productModel->getProductById($args['productId']);
                            // return $productModel->getOneByProductId($args['productId']);
                        }
                    ],

                    'productsByCategory' => [
                        'type' => Type::listOf($productType),
                        'args' => [
                            'categoryId' => Type::nonNull(Type::int())
                        ],
                        'resolve' => function ($root, $args) use ($db) {
                            $productModel = new Product($db);
                            return $productModel->getProductsByCategoryId($args['categoryId']);
                        }
                    ],
                    
                    'priceByProductId' => [
                        'type' => Type::listOf($priceType), // Ensure listOf if multiple prices exist
                        'args' => [
                            'productId' => Type::nonNull(Type::int())
                        ],
                        'resolve' => function ($root, $args, $context) use ($db) {
                            $priceModel = new Price($db);
                            $prices = $priceModel->getOneByProductId($args['productId']);
                            return $prices;
                        }
                    ]
                ]
            ]);

            // PriceInput: represents the price details.
            $priceInputType = new InputObjectType([
                'name' => 'PriceInput',
                'fields' => [
                    'amount' => ['type' => Type::nonNull(Type::float())],
                    'currency_symbol' => ['type' => Type::nonNull(Type::string())],
                ],
            ]);

            // GalleryItemInput: represents one image in the gallery.
            $galleryItemInputType = new InputObjectType([
                'name' => 'GalleryItemInput',
                'fields' => [
                    'image_url' => ['type' => Type::nonNull(Type::string())],
                ],
            ]);

            // AttributeInput: represents one attribute (name and selected value).
            $attributeInputType = new InputObjectType([
                'name' => 'AttributeInput',
                'fields' => [
                    'name' => ['type' => Type::nonNull(Type::string())],
                    'value' => ['type' => Type::nonNull(Type::string())],
                ],
            ]);

            // OrderItemInput: represents one order item with full product info.
            $orderItemInputType = new InputObjectType([
                'name'   => 'OrderItemInput',
                'fields' => [
                    'productId' => ['type' => Type::nonNull(Type::int())],
                    'name'      => ['type' => Type::nonNull(Type::string())],
                    'price'     => ['type' => Type::nonNull($priceInputType)],
                    'gallery'   => ['type' => Type::nonNull(Type::listOf($galleryItemInputType))],
                    'attributes'=> ['type' => Type::nonNull(Type::listOf($attributeInputType))],
                    'quantity'  => ['type' => Type::nonNull(Type::int())],
                ],
            ]);

            $mutationType = new ObjectType([
                'name'   => 'Mutation',
                'fields' => [
                    'placeOrder' => [
                        'type' => Type::boolean(),
                        'args' => [
                            'cartItems' => ['type' => Type::nonNull(Type::listOf($orderItemInputType))]
                        ],
                        'resolve' => function ($root, $args, $context) use ($db) {
                            try {
                                $order = new \Models\Order($db, $args['cartItems']);
                                return $order->placeOrder();
                            } catch (\Throwable $e) {
                                error_log("PlaceOrder mutation error: " . $e->getMessage());
                                error_log("Stack trace: " . $e->getTraceAsString());
                                throw $e; // rethrow for GraphQL to send the error
                            }
                        }
                    ],
                    
                    // ... (other mutation fields if needed)
                ]
            ]);
            

            // Define Schema
            $schema = new Schema([
                'query' => $queryType,
                'mutation' => $mutationType,
            ]);

            // Read Query from Request
            $rawInput = file_get_contents('php://input');
            if ($rawInput === false) {
                throw new RuntimeException('Failed to get php://input');
            }

            $input = json_decode($rawInput, true);
            $query = $input['query'] ?? null;
            $variables = $input['variables'] ?? null;

            $result = GraphQLBase::executeQuery($schema, $query, null, null, $variables);
            $output = $result->toArray();

        } catch (Throwable $e) {
            $output = ['error' => ['message' => $e->getMessage()]];
        }

        // Return JSON Response
        header('Content-Type: application/json; charset=UTF-8');
        echo json_encode($output);
    }
}

// Handle the request
GraphQL::handle();
