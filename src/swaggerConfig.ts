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
            },
            {
                name: 'Accounts Payable',
                description: 'Accounts Payable management endpoints'
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
            '/api/rack-prices/{id}': {
                get: {
                    tags: ['Rack Prices'],
                    summary: 'Get single rack price',
                    description: 'Retrieve a single rack price by ID',
                    parameters: [
                        {
                            name: 'id',
                            in: 'path',
                            required: true,
                            schema: {
                                type: 'string'
                            },
                            description: 'Rack Price ID'
                        }
                    ],
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
            },
            '/api/ap-voucher/ocr-invoice/validate': {
                post: {
                    tags: ['Accounts Payable'],
                    summary: 'Validate OCR Invoice',
                    description: 'Validates an OCR processed invoice for accounts payable',
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/APVoucherDTO'
                                }
                            }
                        }
                    },
                    responses: {
                        '200': {
                            description: 'Invoice is valid',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/VoucherValidationResponseDTO'
                                    }
                                }
                            }
                        },
                        '400': {
                            description: 'Invoice validation failed',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/VoucherValidationResponseDTO'
                                    }
                                }
                            }
                        }
                    }
                }
            },
            '/api/ap-voucher/ocr-invoice': {
                post: {
                    tags: ['Accounts Payable'],
                    summary: 'Submit OCR Invoice',
                    description: 'Submits a validated OCR invoice to accounts payable',
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/APVoucherDTO'
                                }
                            }
                        }
                    },
                    responses: {
                        '200': {
                            description: 'Invoice submitted successfully',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/VoucherValidationResponseDTO'
                                    }
                                }
                            }
                        },
                        '400': {
                            description: 'Invoice submission failed',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/VoucherValidationResponseDTO'
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
