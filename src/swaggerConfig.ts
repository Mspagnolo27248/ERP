import swaggerJsdoc from 'swagger-jsdoc';
import path from 'path';
import { swaggerComponents } from './swaggerComponents';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'ERP System API',
            version: '1.0.0',
            description: 'API documentation for the ERP system including products and pricing management.',
        },
        servers: [
            {
                url: 'http://localhost:8001',
                description: 'Development server'
            },
        ],
        tags: [
            {
                name: 'Products',
                description: 'Product management endpoints'
            },
            {
                name: 'Rack Prices',
                description: 'Rack price management endpoints'
            }
        ],
        paths: {
            '/api/products': {
                get: {
                    tags: ['Products'],
                    summary: 'Get all products',
                    description: 'Retrieve a list of all products',
                    responses: {
                        '200': {
                            description: 'Successful operation',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'array',
                                        items: {
                                            $ref: '#/components/schemas/ProductDto'
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                post: {
                    tags: ['Products'],
                    summary: 'Create or update a product',
                    description: 'Create a new product or update an existing one',
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/ProductDto'
                                }
                            }
                        }
                    },
                    responses: {
                        '201': {
                            description: 'Product created/updated successfully',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/ProductDto'
                                    }
                                }
                            }
                        }
                    }
                }
            },
            '/api/products/{id}': {
                get: {
                    tags: ['Products'],
                    summary: 'Get product by ID',
                    parameters: [
                        {
                            name: 'id',
                            in: 'path',
                            required: true,
                            schema: {
                                type: 'string'
                            },
                            description: 'Product ID'
                        }
                    ],
                    responses: {
                        '200': {
                            description: 'Successful operation',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/ProductDto'
                                    }
                                }
                            }
                        }
                    }
                },
                delete: {
                    tags: ['Products'],
                    summary: 'Delete product',
                    parameters: [
                        {
                            name: 'id',
                            in: 'path',
                            required: true,
                            schema: {
                                type: 'string'
                            },
                            description: 'Product ID'
                        }
                    ],
                    responses: {
                        '201': {
                            description: 'Product deleted successfully'
                        }
                    }
                }
            },
            '/api/rack-prices': {
                get: {
                    tags: ['Rack Prices'],
                    summary: 'Get all rack prices',
                    description: 'Retrieve all rack prices based on filters',
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        filters: {
                                            type: 'object',
                                            additionalProperties: true
                                        }
                                    }
                                }
                            }
                        }
                    },
                    responses: {
                        '200': {
                            description: 'Successful operation',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'array',
                                        items: {
                                            $ref: '#/components/schemas/RackPriceDto'
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            '/api/rack-prices/single': {
                post: {
                    tags: ['Rack Prices'],
                    summary: 'Get single rack price',
                    description: 'Retrieve a single rack price by its keys',
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/RackPriceKeys'
                                }
                            }
                        }
                    },
                    responses: {
                        '200': {
                            description: 'Successful operation',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/RackPriceDto'
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        components: {
            schemas: swaggerComponents.components.schemas
        }
    },
    apis: [path.join(__dirname, './rest-api/controllers/*.ts')],
};

export const swaggerSpec = swaggerJsdoc(options);
