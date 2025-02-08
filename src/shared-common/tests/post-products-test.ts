

const data = [{
    "productId": "1000",
    "productName": "KETJENLUBE 135                ",
    "companyNumber": "10",
    "inactiveDate": 0,
    "TPPLGR": "0",
    "productClass": "0",
    "productGroup": "KA",
    "toCompany": 0,
    "shortDescription": "                              ",
    "priceClass": "Y11",
    "apiGravity": 12.6,
    "inventoryGroup": "N1",
    "salesGL": 0,
    "abbreviatedDescription": "KET 135   ",
    "sellIndicator": "N",
    "viscosityFlowCode": "  ",
    "isFluid": "Y",
    "lbsPerGallon": 8.1886
  },
  {
    "productId": "1001",
    "productName": "KETJENLUBE 1300               ",
    "companyNumber": "10",
    "inactiveDate": 20170101,
    "TPPLGR": "0",
    "productClass": "0",
    "productGroup": "KA",
    "toCompany": 0,
    "shortDescription": "                              ",
    "priceClass": "Y11",
    "apiGravity": 11.4,
    "inventoryGroup": "N1",
    "salesGL": 13000000,
    "abbreviatedDescription": "KL 1300   ",
    "sellIndicator": "N",
    "viscosityFlowCode": "  ",
    "isFluid": "Y",
    "lbsPerGallon": 8.2573
  },
  {
    "productId": "1003",
    "productName": "DB-PC SOLUTION                ",
    "companyNumber": "10",
    "inactiveDate": 0,
    "TPPLGR": "0",
    "productClass": "0",
    "productGroup": "K5",
    "toCompany": 0,
    "shortDescription": "PETROLEUM LUBRICATING GREASE  ",
    "priceClass": "Y11",
    "apiGravity": 23.4,
    "inventoryGroup": "T1",
    "salesGL": 13131003,
    "abbreviatedDescription": "DBPC      ",
    "sellIndicator": "Y",
    "viscosityFlowCode": "LU",
    "isFluid": "Y",
    "lbsPerGallon": 7.6176
  },
  {
    "productId": "1004",
    "productName": "IRGANOX L 101                 ",
    "companyNumber": "10",
    "inactiveDate": 20170101,
    "TPPLGR": "0",
    "productClass": "0",
    "productGroup": "KA",
    "toCompany": 0,
    "shortDescription": "                              ",
    "priceClass": "Y10",
    "apiGravity": -8.5,
    "inventoryGroup": "T1",
    "salesGL": 13000000,
    "abbreviatedDescription": "IRG L 101 ",
    "sellIndicator": "N",
    "viscosityFlowCode": "  ",
    "isFluid": "Y",
    "lbsPerGallon": 9.5933
  },
  {
    "productId": "1005",
    "productName": "SOLTEX PB-32                  ",
    "companyNumber": "10",
    "inactiveDate": 20170101,
    "TPPLGR": "0",
    "productClass": "0",
    "productGroup": "KA",
    "toCompany": 0,
    "shortDescription": "                              ",
    "priceClass": "Y11",
    "apiGravity": 26.2,
    "inventoryGroup": "N1",
    "salesGL": 0,
    "abbreviatedDescription": "PB-32     ",
    "sellIndicator": "N",
    "viscosityFlowCode": "  ",
    "isFluid": "Y",
    "lbsPerGallon": 7.4824
  }];

async function main() {
  for (const product of data) {
    try {
      await postProductTOApi(product);
    } catch (error) {
      console.error(`Error posting product ${product.productId}:`, error);
    }
  }
}

async function postProductTOApi(product: Record<string, any>) {
  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(product),
    });
    return response.json();
  }

  const apiUrl = 'http://localhost:8001/products';

main();
