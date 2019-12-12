import * as http from "http";

const config = require("../config.json");

function getStatus() : Promise<string>{

    let options : http.RequestOptions = {
        hostname : config["ip-adr"],
        port : config["port"],
        path : "/door-latest",
        method : "GET",
    }; 
    
    return new Promise<string>(resolve => {
        
        let req = http.request(options, function(res){
            res.setEncoding("utf8");
            
            let retValue = ""
            res.on("data", (body)=>{
                retValue += body
            })
            res.on("error", function(e){
                console.log("Problem with request: " + e.message);
            });
            res.on("end", ()=>{
                resolve(JSON.parse(retValue)["state"])
            })
            
        });

        req.end();
    });
}

let timer : NodeJS.Timeout | null = null;

let status = "close";
(async function main()
{
    setInterval(async () => {
        let retValue = await getStatus()
        if(retValue === status) return;

        status = retValue
        console.log(status);
    }, 1000);
})();