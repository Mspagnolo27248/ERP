import { ProductModel } from "../database/custom-orm/data-models/ProductModel";
import { BaseModel } from "../database/custom-orm/orm/BaseModel";
import { ConnectionManager } from "../database/custom-orm/orm/ConnectionManager";

async function main() {
    try {
        // Configure connection first
        await ConnectionManager.getInstance().configureConnection('odbc',
            { connectionString: 'Driver={SQL Server Native Client 11.0};Server=(local);Database=ibox;UID=mstest;PWD=mstest;' }
        );

        // Then run the test
        const results = await test();
        console.log('Test results:', results);
    } catch (error) {
        console.error('Error in main:', error);
    } finally {
        // Clean up connection
        await ConnectionManager.getInstance().closeConnection();
    }
}

async function test() {
    try {
        await BaseModel.beginTransaction();
        console.log('Transaction started');
        await ProductModel.insert({
            productId: 9999,
            productName: 'Test',
            companyNumber: '123456',
            inactiveDate: 123456,
            TPPLGR: 123456,
            productClass: 123456,
            productGroup: 'Test',
            toCompany: 123456,
            shortDescription: 'Test',
            priceClass: 'Test',
            apiGravity: 123456,
            inventoryGroup: 'Test',
            salesGL: 123456,
            abbreviatedDescription: 'Test',
            sellIndicator: 'Test',
            viscosityFlowCode: 'Test',
            isFluid: 'Test',
            reportingSlate: 'Test',
        });

        await ProductModel.insert({
            productId: 9998,
            productName: 'Test',
            companyNumber: '123456',
            inactiveDate: 123456,
            TPPLGR: 123456,
            productClass: 123456,
            productGroup: 'Test',
            toCompany: 123456,
            shortDescription: 'Test',
            priceClass: 'Test',
            apiGravity: 123456,
            inventoryGroup: 'Test',
            salesGL: 123456,
            abbreviatedDescription: 'Test',
            sellIndicator: 'Test',
            viscosityFlowCode: 'Test',
            isFluid: 'Test',
            reportingSlate: 'Test',
        });
        console.log('Product inserted');
        
        await BaseModel.commitTransaction();
        console.log('Transaction committed');
        return 'success';
    } catch (error) {
        console.error('Error in test:', error);
        await BaseModel.rollbackTransaction();
        throw error;
    }
}

// Run the main function
main().catch(error => {
    console.error('Unhandled error:', error);
    process.exit(1);
});
