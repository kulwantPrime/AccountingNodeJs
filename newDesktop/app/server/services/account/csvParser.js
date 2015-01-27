
var fs=require('fs');
var csv = require("fast-csv");
var accountService=require('./accountService');
var fs=require('fs.extra');
var HashMap=require('hashmap').HashMap;

function csvParse(file, sheetType,res){
	var stream = fs.createReadStream(file);
	var csvStream;
	var count=0;
	var validated=false;
	if(sheetType == "amazon") 
	{
	var orderInfo = new HashMap();
				
		csvStream = csv.parse()
		    .on("data", function(data){
			if(count<8){
			if(count==7){
			if(data.length==21)
			{ 
			if(false&&!sequenceCheck(data,sheetType)){resss(res,'csv sheet seqence problem');count++;return;}
			else {validated=true;resss(res,'all done');}
			}
			else {resss(res,'csv sheet row count not correct');count++;return;}
			}
			
			count++;}
			else //console.log(data);
			{
			  if(validated)	{
			    if(data[0]!=''&&data[1]!=''&&data[2]!='') {
		        accountService.createAmazonPaymentSheet(data);
	                  }
				var refundedPayment = false;	
				var productIdInfo = {};
				if(data[2] == "Refund") {
					refundedPayment = "true";
					//Create OrderPaymentPreference and Payment
				}
				if(data[4] != "") {
					productIdInfo[data[4]]=  data[6];
				}
				
				if(orderInfo.get(data[3]) != null) {
			        var orderMap=new HashMap();
					 var tempMap = orderInfo.get(data[3]);
					orderMap.set("productIdInfo",productIdInfo);
					orderMap.set("settlementRefNo",data[1]);
					orderMap.set("settlementDate" ,data[0]);
					
					orderMap.set("commissionFee",Number(data[16]) + Number(data[18]) + Number(tempMap["commissionFee"]));
					orderMap.set("invoiceAmount", Number(data[12]) + Number(tempMap["invoiceAmount"]));
					orderMap.set("salesTax", Number(data[13]) + Number(tempMap["salesTax"]));
					orderMap.set("externalOrderId", data[3]);
					orderMap.set("shippingCharges" ,Number(data[13]) + Number(tempMap["shippingCharges"]));
					orderMap.set("promotionalRebate", Number(data[14]) + Number(tempMap["promotionalRebate"]));
					orderMap.set("fbaFee", Number(data[17]) + Number(tempMap["fbaFee"]));
					orderMap.set("orderStatus", data[2]);
					orderMap.set("otherTransactionFee", Number(data[18]) + Number(tempMap["otherTransactionFee"]));
					orderMap.set("invoiceId", "INV11");
					var totalMarketplaceFee = Number(data[16]) + Number(data[18]) + Number(data[13]);
					orderMap.set("totalMarketPlaceFee", totalMarketplaceFee + Number(tempMap["totalMarketPlaceFee"]));
					orderMap.set("refundedPayment", refundedPayment);
				    orderInfo.set(data[3], orderMap);
					} else {
					var orderMap = new HashMap();
					if(data[4]!=null){
						productIdInfo[data[4]]=data[6];
					}
					orderMap.set("productIdInfo", productIdInfo);
					orderMap.set("settlementRefNo",data[1]);
					orderMap.set("settlementDate", data[0]);
					orderMap.set("commissionFee" ,Number(data[16]) + Number(data[18]));
					orderMap.set("invoiceAmount", data[12]);
					orderMap.set("salesTax" ,data[13]);
					orderMap.set("externalOrderId" , data[3]);
					orderMap.set("shippingCharges", data[13]);
					orderMap.set("promotionalRebate" , data[14]);
					orderMap.set("fbaFee" , data[17]);
					orderMap.set("orderStatus" , data[2]);
					orderMap.set("otherTransactionFee" , data[18]);
					orderMap.set("invoiceId" , "INV11");
					var totalMarketplaceFee = Number(data[16]) + Number(data[18]) + Number(data[13]);
					orderMap.set("totalMarketPlaceFee" , totalMarketplaceFee);
					orderMap.set("refundedPayment" ,refundedPayment);
					orderInfo.set(data[3], orderMap);
					
				}
			 }
			  else ;//reponse for if one of entity is not present;
			  
			 }
			//Check Column's name and length 
			//Call queries from accountDAO, SAve
		    
//console.log(data.length);
})
		    .on("end", function(){
			//fs.remove('../../../TempUploaded/file.csv');
				accountService.createPaymentTransactions(orderInfo);
		    });
	} else if (sheetType == "flipkart") {
	   var orderInfo = new HashMap();
	
		csvStream = csv.parse()
		    .on("data", function(data){
			
			 //queries.queryInsert(db,data,'csv');
            if(count==0){
			//console.log(data);
			if(data.length==39){ if(false&&!sequenceCheck(data,sheetType)){resss(res,'csv sheetseqence problem not correct');count++;return;}
			else {validated=true;resss(res,'all done');}
			}
			else {resss(res,'csv sheet row count not correct');return;}
			count++;}
			else {
				if(validated){	
					if(data[0]!=''&&data[4]!=''&&data[5]!=''){
						accountService.createFlipkartPaymentSheet(data);
					}
					var orderInfoMap = new HashMap();
					var productIdInfo = new HashMap();
					productIdInfo.set(data[6],data[7]);
					orderInfoMap.set("productIdInfo", productIdInfo);
					var commissionFeeVal = Number(data[20]) + Number(data[21]) + Number(data[30]);
               orderInfoMap.set("commissionFee",commissionFeeVal);
               orderInfoMap.set("marketPlaceFee", data[17]);
               orderInfoMap.set("settlementDate", data[1]);
               orderInfoMap.set("settlementRefNo", data[0]);
               orderInfoMap.set("protectionFund", data[16]);
               //orderInfoMap.set("feeDiscount", insetMap.get("feeDiscount"));
               orderInfoMap.set("refund", data[13]);
               orderInfoMap.set("orderStatus", data[5]);
               orderInfoMap.set("emiFee", data[22]);
               orderInfoMap.set("invoiceAmount", data[10]);
               orderInfoMap.set("serviceTax", data[31]);
               orderInfoMap.set("shippingCharges", data[26]);
               orderInfoMap.set("reverseShippingCharges", data[28]);
               orderInfoMap.set("settlementValue", data[11]);
               orderInfoMap.set("cancellationFee", data[29]);
               orderInfoMap.set("invoiceId", data[8]);
               orderInfoMap.set("externalOrderId", data[2]);
               orderInfo.set(data[2], orderInfoMap);
				} 
			}
			
			//Check Column's name and length
			//Call queries from accountDAO, SAve
		    })
		    .on("end", function(){
			 //fs.remove('../../../TempUploaded/file.csv');
			 orderInfo.set("salesRepPartyId") = "FLIPKART";
			 accountService.createPaymentTransactions(orderInfo);
		    });
	}
	stream.pipe(csvStream); // Need to be tested if required
}

function resss(res,code){
	res.writeHead(200, {'content-type': 'text/plain'});
	res.write(code);
	res.end('kulwanignh');
}

function sequenceCheck(data,sheetType){

if(sheetType=='amazon'){
if(data[0]=='date/time'&&data[1]=='settlement id'&&data[2]=='type'&&data[3]=='order id'&&
   data[4]=='sku'&&data[5]=='description'&&data[6]=='quantity'&&data[7]=='marketplace'&&data[8]=='fulfillment'
   &&data[9]=='order city'&&data[10]=='order state'
   &&data[11]=='order postal'&&data[12]=='product sales'&&data[13]=='shipping credits'&&data[14]=='promotional rebates'
   &&data[15]=='sales tax collected'&&data[16]=='selling fees'&&data[17]=='fba fees'
   &&data[18]=='other transaction fees'&&data[19]=='other'&&data[20]=='total')
   return true;
   else false;}
else if(sheetType='flipkart'){
if(data[0]=='Settlement Ref No.'&&data[1]=='Settlement Date'&&data[2]=='Order ID/FSN'&&data[3]=='Order Item ID'&&
   data[4]=='Order Date'&&data[5]=='Order Status'&&data[6]=='Seller SKU'&&data[7]=='Quantity'&&data[8]=='Invoice ID (Invoice to Buyer)'
   &&data[9]=='Invoice Date (Invoice to Buyer)'&&data[10]=='Invoice Amount (Invoice to Buyer)'
   &&data[11]=='Settlement Value (Rs.)'&&data[12]=='Order Item Value (Rs.)'&&data[13]=='Refund (Rs.)'&&data[14]=='Hold (Rs.)'
   &&data[15]=='Performance Reward (Rs.)'
   &&data[16]=='Protection Fund (Rs.)'&&data[17]=='Total Marketplace Fee (Rs.)'&&data[18]=='Sub Category'&&data[19]=='Commission Rate'&&data[20]=='Commission (Rs.)'
   &&data[21]=='Fixed Fee (Rs.)'&&data[22]=='EMI Fee (Rs.)'&&data[23]=='Total Weight/Slab'&&data[24]=='Shipping Zone'
   &&data[25]=='Shipping Fee(per 500 gms)'&&data[26]=='Shipping Fee (Rs.)'
   &&data[27]=='Reverse Shipping Fee(per 500 gms)'&&data[28]=='Reverse Shipping Fee (Rs.)'&&data[29]=='Cancellation Fee (Rs.)'&&data[30]=='Fee Discount (Rs.)'&&data[31]=='Service Tax (Rs.)'&&data[32]=='Dispatch Date'&&data[33]=='Delivery Date'&&data[34]=='Cancellation Date'
   &&data[35]=='Dissete Date'&&data[36]=='Total Offer Amount'&&data[37]=='My Offer Share'&&data[38]=='Flipkart Offer Share'  )
   return true;
   else false;
}

}

exports.csvParse=csvParse;
