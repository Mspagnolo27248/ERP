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
            '/api/ap-voucher': {
                post: {
                    tags: ['Accounts Payable'],
                    summary: 'Submit AP Voucher',
                    description: 'Submits an accounts payable voucher',
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
                            description: 'Voucher submitted successfully',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/VoucherValidationResponseDTO'
                                    }
                                }
                            }
                        },
                        '400': {
                            description: 'Voucher submission failed',
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
            '/api/ap-voucher/validate': {
                post: {
                    tags: ['Accounts Payable'],
                    summary: 'Validate AP Voucher',
                    description: 'Validates an accounts payable voucher',
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
                            description: 'Voucher is valid',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/VoucherValidationResponseDTO'
                                    }
                                }
                            }
                        },
                        '400': {
                            description: 'Voucher validation failed',
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
            '/api/ap-voucher/flexi-invoice/validate': {
                post: {
                    tags: ['Accounts Payable'],
                    summary: 'Validate Flexi Invoice',
                    description: 'Validates a flexi invoice for accounts payable',
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
                            description: 'Flexi invoice is valid',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/VoucherValidationResponseDTO'
                                    }
                                }
                            }
                        },
                        '400': {
                            description: 'Flexi invoice validation failed',
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
            '/api/ap-voucher/flexi-invoice/submit': {
                post: {
                    tags: ['Accounts Payable'],
                    summary: 'Submit Flexi Invoice',
                    description: 'Submits a validated flexi invoice to accounts payable',
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
                            description: 'Flexi invoice submitted successfully',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/VoucherValidationResponseDTO'
                                    }
                                }
                            }
                        },
                        '400': {
                            description: 'Flexi invoice submission failed',
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
            schemas: {
                APVoucherDTO: {
                    type: 'object',
                    required: ['vendorId', 'voucherNumber', 'amount', 'dueDate', 'lineItems'],
                    properties: {
                        vendorId: {
                            type: 'string',
                            description: 'The ID of the vendor'
                        },
                        voucherNumber: {
                            type: 'string',
                            description: 'The unique identifier for the voucher'
                        },
                        amount: {
                            type: 'number',
                            description: 'The total amount of the voucher'
                        },
                        dueDate: {
                            type: 'string',
                            format: 'date',
                            description: 'The due date for payment'
                        },
                        lineItems: {
                            type: 'array',
                            items: {
                                $ref: '#/components/schemas/APVoucherLineItemDTO'
                            },
                            description: 'List of line items in the voucher'
                        },
                        discountAmt: {
                            type: 'number',
                            description: 'The discount amount applied to the voucher'
                        },
                        discountPercent: {
                            type: 'number',
                            description: 'The discount percentage applied to the voucher'
                        }
                    }
                },
                APVoucherLineItemDTO: {
                    type: 'object',
                    required: ['lineItemNumber', 'amount', 'description'],
                    properties: {
                        lineItemNumber: {
                            type: 'number',
                            description: 'The sequential number of the line item'
                        },
                        amount: {
                            type: 'number',
                            description: 'The amount for this line item'
                        },
                        description: {
                            type: 'string',
                            description: 'Description of the line item'
                        }
                    }
                },
                VoucherValidationResponseDTO: {
                    type: 'object',
                    required: ['isValid', 'voucher', 'errors'],
                    properties: {
                        isValid: {
                            type: 'boolean',
                            description: 'Indicates whether the voucher is valid'
                        },
                        voucher: {
                            $ref: '#/components/schemas/APVoucherDTO',
                            description: 'The validated voucher'
                        },
                        errors: {
                            type: 'array',
                            items: {
                                type: 'string'
                            },
                            description: 'List of validation errors if any'
                        }
                    }
                }
            }
        }
    },
    apis: [path.join(__dirname, './rest-api/controllers/*.ts')],
};

export const swaggerSpec = swaggerJsdoc(options);
