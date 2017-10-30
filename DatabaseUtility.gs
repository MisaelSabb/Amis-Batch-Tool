var DatabaseUtility=new function(){
  
   //retrive the dataSet for a specific country
   this.fetchDataByCountry=function(userToken,regionCode,region_codelist) {     
     
     var absoluteDataSheetPathNode = 'config/absoluteDataSheetPath';     
     var absoluteDataSheetPath=FirebaseConnector.getFireBaseDataParsed(absoluteDataSheetPathNode, userToken);          
     
     var countryDataNode = region_codelist[parseInt(regionCode).toString()].toLowerCase() +'Data';
     
     return FirebaseConnector.getFireBaseDataParsed(absoluteDataSheetPath+'/'+countryDataNode, userToken);
     
   }
   
   //retrive the product label by product_code (eg. 1 = 'Wheat') and it lowercase it
   this.getProductLabelFromCode= function(product_codelist,product_code){
     return product_codelist[parseInt(product_code).toString()].toLowerCase();
   }
   
   //retrive the element SPREADSHEET ROW by element_code (eg. 1 = 'Wheat') and it lowercase it
   this.getElementSpreadSheetRowFromElementCode= function(batchRowArray,element_code, product_name){
     return batchRowArray[product_name.toLowerCase()][parseInt(element_code).toString()];
   }
   
   //retrive the element SPREADSHEET ROW by element_code (eg. 1 = 'Wheat') and it lowercase it
   this.getElementSpreadSheetColumnFromYear= function(batchRowColumn,year, product_name){
     return batchRowColumn[product_name.toLowerCase()][parseInt(year).toString()];
   }      
}