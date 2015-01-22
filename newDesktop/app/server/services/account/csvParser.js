var connection;
var fs=require('fs');
var csv = require("fast-csv");

function csvParse(file, sheetType){
	var stream = fs.createReadStream(file);
	var csvStream;
	if(sheetType == "amazon") {
		csvStream = csv.parse()
		    .on("data", function(data){
			createAmazonPaymentSheet(data);
			//Check Column's name and length
			//Call queries from accountDAO, SAve
		    })
		    .on("end", function(){
			 sql.close();
		    });
	} else if (sheetType == "flipkart") {
		csvStream = csv.parse()
		    .on("data", function(data){
			 //queries.queryInsert(db,data,'csv');
			createFlipkartPaymentSheet(data);
			//Check Column's name and length
			//Call queries from accountDAO, SAve
		    })
		    .on("end", function(){
			 sql.close();
		    });
	}
	stream.pipe(csvStream); // Need to be tested if required
}
exports.csvParse=csvParse;
