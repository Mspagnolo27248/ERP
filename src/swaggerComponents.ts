/**
 * Swagger Components
 */
export const swaggerComponents = {
  components: {
    schemas: {
      RackPriceDto: {
        type: "object",
        properties: {
          companyNumber: {
            type: "integer",
            example: 123,
          },
          location: {
            type: "string",
            example: "New York",
          },
          productCode: {
            type: "string",
            example: "P123",
          },
          containerCode: {
            type: "string",
            example: "C456",
          },
          unitOfMeasure: {
            type: "string",
            example: "Litre",
          },
          effectiveDate: {
            type: "string",
            format: "date",
            example: "2025-01-16",
          },
          effectiveTime: {
            type: "integer",
            example: 1609459200,
          },
          price: {
            type: "number",
            format: "float",
            example: 25.50,
          },
          priceTier1: {
            type: "string",
            example: "Standard",
          },
          priceTier2: {
            type: "string",
            example: "Premium",
          },
          priceTier3: {
            type: "string",
            example: "Discounted",
          },
          priceTier4: {
            type: "string",
            example: "Bulk",
          },
          minimumQuantity: {
            type: "integer",
            example: 100,
          },
          quantityTier1: {
            type: "integer",
            example: 500,
          },
          quantityTier2: {
            type: "integer",
            example: 1000,
          },
          quantityTier3: {
            type: "integer",
            example: 1500,
          },
          quantityTier4: {
            type: "integer",
            example: 2000,
          },
          quantityTier5: {
            type: "integer",
            example: 2500,
          },
          requiredFlag: {
            type: "string",
            example: "Y",
          },
          inactiveFlag: {
            type: "string",
            example: "N",
          },
        },
      },
      RackPriceKeys: {
        type: "object",
        properties: {
          location: {
            type: "string",
            example: "New York",
          },
          productCode: {
            type: "string",
            example: "P123",
          },
          containerCode: {
            type: "string",
            example: "C456",
          },
          unitOfMeasure: {
            type: "string",
            example: "Litre",
          },
          effectiveDate: {
            type: "string",
            format: "date",
            example: "2025-01-16",
          },
          effectiveTime: {
            type: "integer",
            example: 1609459200,
          },
        },
      },
      PriceAgreementDto: {
        type: "object",
        properties: {
          productCode: {
            type: "string",
            example: "P123",
          },
          containerCode: {
            type: "string",
            example: "C456",
          },
          customerCode: {
            type: "string",
            example: "C789",
          },
          customerShipTo: {
            type: "string",
            example: "ShipTo123",
          },
          startDate: {
            type: "integer",
            example: 1672531199,
          },
          endDate: {
            type: "integer",
            example: 1675123199,
          },
        },
      },
      ProductDto: {
        type: "object",
        properties: {
          productId: {
            type: "string",
            example: "P123",
          },
          productName: {
            type: "string",
            example: "Lubricant",
          },
          companyNumber: {
            type: "string",
            example: "100",
          },
          inactiveDate: {
            type: "integer",
            example: 1609459200,
          },
          TPPLGR: {
            type: "integer",
            example: 123,
          },
          productClass: {
            type: "integer",
            example: 1,
          },
          productGroup: {
            type: "string",
            example: "Group A",
          },
          toCompany: {
            type: "integer",
            example: 200,
          },
          shortDescription: {
            type: "string",
            example: "High quality lubricant",
          },
          priceClass: {
            type: "string",
            example: "Premium",
          },
          apiGravity: {
            type: "number",
            format: "float",
            example: 32.5,
          },
          inventoryGroup: {
            type: "string",
            example: "Inventory A",
          },
          salesGL: {
            type: "integer",
            example: 9876,
          },
          abbreviatedDescription: {
            type: "string",
            example: "High quality lube",
          },
          sellIndicator: {
            type: "string",
            example: "Y",
          },
          viscosityFlowCode: {
            type: "string",
            example: "Visc123",
          },
          isFluid: {
            type: "string",
            example: "Y",
          },
          lbsPerGallon: {
            type: "number",
            format: "float",
            example: 7.8,
          },
        },
      },
    },
  },
};
