import { ConnectionManager } from "../../../shared-common/database/custom-orm/orm/ConnectionManager";
import { PricingRepositoryImp } from "../data-access-repository/PricingReposityoryImp"

ConnectionManager.getInstance().configureConnection('odbc',
  //{ connectionString: 'Driver={SQL Server Native Client 11.0};Server=(local);Database=ibox;UID=mstest;PWD=mstest;'}
 { connectionString: 'DSN=AS400;UID=ARGTEST;PWD=temp##1234'}
)

async function main (){

    const repo = new PricingRepositoryImp();
const data = await repo.getCurrentRackPrices();

console.log(data[10])

}


main()