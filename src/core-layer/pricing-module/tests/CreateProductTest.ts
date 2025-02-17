import { MasterDataCacheImp } from "../../../shared-common/data-cache/MasterDataCacheImp";
import { ConnectionManager } from "../../../shared-common/database/custom-orm/orm/ConnectionManager";
import { PricingRepositoryImp } from "../data-access-repository/PricingReposityoryImp";
import { CreateProductUseCase } from "../use-cases/CreateProductUseCase";


// Initialize cache singelton for injection.
const cache = MasterDataCacheImp.getInstance().setCacheDuration(1000 * 60 * 60); // 1 hour cache

 const testProduct = {
    "productId": "9999",
    "productName": "KENDEX 0150H     ",
    "companyNumber": "10",
    "inactiveDate": 0,
    "TPPLGR": "0",
    "productClass": "0",
    "productGroup": "K2",
    "toCompany": 0,
    "shortDescription": "PETROLEUM LUBRICATING OIL     ",
    "priceClass": "R11",
    "apiGravity": 31.9,
    "inventoryGroup": "K1",
    "salesGL": 13134315,
    "abbreviatedDescription": "KX 0150H  ",
    "sellIndicator": "Y",
    "viscosityFlowCode": "LU",
    "isFluid": "Y",
  }



async function main() {
  await   ConnectionManager.getInstance().configureConnection('odbc',
        { connectionString:  'Driver={SQL Server Native Client 11.0};Server=(local);Database=ibox;UID=mstest;PWD=mstest;'
    }
);

const useCase = new CreateProductUseCase(new PricingRepositoryImp(MasterDataCacheImp.getInstance()));

const data = await useCase.execute(JSON.parse(JSON.stringify(testProduct)))

console.log(data)

}








  main()
  