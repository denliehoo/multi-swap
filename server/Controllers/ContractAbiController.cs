using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ContractAbiController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        public ContractAbiController(IConfiguration configuration)
        {
            _configuration = configuration;
        } 
        
        // [HttpGet("{chain}/{address}")]
        [HttpGet(Name = "GetContractAbi")]
        public async Task<string> GetAbi(string chain, string address)
        {
            string? etherscanApiKey = _configuration.GetValue<string>("ApiKeys:EtherscanApiKey");
            string? ftmscanApiKey = _configuration.GetValue<string>("ApiKeys:FtmscanApiKey");
            
            // function to call api
            string externalApiUrl = "";
              if (chain == "goerli") {
                externalApiUrl=$"https://api-goerli.etherscan.io/api?module=contract&action=getabi&address={address}&apikey={etherscanApiKey}";
              }
              else if( chain == "ftm"){
                externalApiUrl=$"https://api.ftmscan.com/api?module=contract&action=getabi&address={address}&apikey={ftmscanApiKey}";
              }
            var client = new HttpClient();
            var response = await client.GetAsync(externalApiUrl);
             if (response.IsSuccessStatusCode)
            {
                // If the external API returns a successful response, store the ABI in the database and return it
                var responseObj = await response.Content.ReadAsAsync<dynamic>();
                var abi = responseObj.result;
                // contract = new ContractAbi { Chain = chain, Address = address, Abi = abi };
                // db.ContractAbis.Add(contract);
                // db.SaveChanges();
                System.Console.WriteLine(abi);
                return abi;
                // return Ok(abi);
            }
            else
            {
                // If the external API returns an error response, return a 404 Not Found error
                System.Console.WriteLine("Not found");
                return "Not found";
            }
        }

    }
}


/* 
public class ContractAbiController : ApiController
{
    private ApplicationDbContext db = new ApplicationDbContext();

    [HttpGet]
    public IHttpActionResult GetAbi(string chain, string address)
    {
        // Check if the contract exists in the database
        var contract = db.ContractAbis.FirstOrDefault(c => c.Chain == chain && c.Address == address);

        if (contract != null)
        {
            // If the contract exists in the database, return the ABI
            return Ok(contract.Abi);
        }
        else
        {
            // If the contract does not exist in the database, call the external API to get the ABI
            var externalApiUrl = $"https://external-api.com/abis/{chain}/{address}";
            var client = new HttpClient();
            var response = await client.GetAsync(externalApiUrl);

            if (response.IsSuccessStatusCode)
            {
                // If the external API returns a successful response, store the ABI in the database and return it
                var abi = await response.Content.ReadAsStringAsync();
                contract = new ContractAbi { Chain = chain, Address = address, Abi = abi };
                db.ContractAbis.Add(contract);
                db.SaveChanges();
                return Ok(abi);
            }
            else
            {
                // If the external API returns an error response, return a 404 Not Found error
                return NotFound();
            }
        }
    }
}

 */