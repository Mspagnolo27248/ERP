import { ProductModel } from "../database/custom-orm/data-models/ProductModel";
import { BaseModel } from "../database/custom-orm/orm/BaseModel";
import {
  ConnectionManager,
  DatabaseConnection,
} from "../database/custom-orm/orm/ConnectionManager";

async function main() {
  try {
    const db = ConnectionManager.getInstance();
    await db.configureConnection("odbc", {
      connectionString:
        "Driver={SQL Server Native Client 11.0};Server=(local);Database=ibox;UID=mstest;PWD=mstest;Trusted_Connection=yes;TrustServerCertificate=yes;",
    });

    const connection = await db.getConnection();
    const results = await test(connection);
    console.log("Test results:", results);
  } catch (error) {
    console.error("Error in main:", error);
  } finally {
    await ConnectionManager.getInstance().closeConnection();
  }
}

async function test(connection: DatabaseConnection) {
  try {
    await connection.beginTransaction();
    console.log("Transaction started");
    await ProductModel.insert({
      productId: 9999,
      productName: "Test",
      companyNumber: "123456",
      inactiveDate: 123456,
      TPPLGR: 123456,
      productClass: 123456,
      productGroup: "Test",
      toCompany: 123456,
      shortDescription: "Test",
      priceClass: "Test",
      apiGravity: 123456,
      inventoryGroup: "Test",
      salesGL: 123456,
      abbreviatedDescription: "Test",
      sellIndicator: "Test",
      viscosityFlowCode: "Test",
      isFluid: "Test",
      reportingSlate: "Test",
    });

    await ProductModel.insert({
      productId: 9998,
      productName: "Test",
      companyNumber: "123456",
      inactiveDate: 123456,
      TPPLGR: 123456,
      productClass: 123456,
      productGroup: "Test",
      toCompany: 123456,
      shortDescription: "Test",
      priceClass: "Test",
      apiGravity: 123456,
      inventoryGroup: "Test",
      salesGL: 123456,
      abbreviatedDescription: "Test",
      sellIndicator: "Test",
      viscosityFlowCode: "Test",
      isFluid: "Test",
      reportingSlate: "Test",
    });
    console.log("Product inserted");

    await connection.commitTransaction();
    console.log("Transaction committed");
    return "success";
  } catch (error) {
    if ((error as any).odbcErrors) {
      console.error("Error in test:", (error as any).odbcErrors);
    } else {
      console.error("Error in test:", error);
    }
    await connection.rollbackTransaction();
    throw error;
  }
}

// Run the main function
main().catch((error) => {
  console.error("Unhandled error:", error);
  process.exit(1);
});
