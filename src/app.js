"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const http = __importStar(require("http"));
const config = require("../config.json");
function getStatus() {
    let options = {
        hostname: config["ip-adr"],
        port: config["port"],
        path: "/door-latest",
        method: "GET",
    };
    return new Promise(resolve => {
        let req = http.request(options, function (res) {
            res.setEncoding("utf8");
            let retValue = "";
            res.on("data", (body) => {
                retValue += body;
            });
            res.on("error", function (e) {
                console.log("Problem with request: " + e.message);
            });
            res.on("end", () => {
                resolve(JSON.parse(retValue)["state"]);
            });
        });
        req.end();
    });
}
let timer = null;
let status = "close";
(async function main() {
    setInterval(async () => {
        let retValue = await getStatus();
        if (retValue === status)
            return;
        status = retValue;
        console.log(status);
    }, 1000);
})();
