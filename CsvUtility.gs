var CsvUtility=new function(){  
  //---------------------------------------------------------
  /**
  * upload CSV Data  to  FIREBASE function     
  * @param  {string} auth token     
  * @param  {string} user uid on firebase
  * @param  {ARRAY} csvData
  */
  //---------------------------------------------------------
  this.elaborateData=function(userToken,uid, values) {
    
    //RETRIVE ALL DATA NEEDED FROM FIREBASE 
    
    var batchRowArrayNode = 'config/batchRowArray';
    var batchRowColumnNode = 'config/batchRowColumn';
    
    var region_codelistNode = 'config/region_codelist';
    var product_codelistNode = 'config/product_codelist';
    
    //TODO _ automatic incrementer by the end of the year
    var batchKindOfFrcNode = 'config/batchKindOfFrc';
    var batchFrcFlagsColumnNode = 'config/batchFrcFlagsColumn';
    var batchFrcNotesColumnNode = 'config/batchFrcNotesColumn';
    var batchLastDateRowNode = 'config/batchLastDateRow';
    var batchCSVMappingNode= 'config/CSVMappingOrderFields';
    var sliderFrcNode = 'config/sliderFrc';
    //var userDataConfigNode ='users_data/'+uid;
    
    var batchRowArray=FirebaseConnector.getFireBaseDataParsed(batchRowArrayNode, userToken);
    var batchRowColumn=FirebaseConnector.getFireBaseDataParsed(batchRowColumnNode, userToken);    
    var region_codelist=FirebaseConnector.getFireBaseDataParsed(region_codelistNode, userToken);
    var product_codelist=FirebaseConnector.getFireBaseDataParsed(product_codelistNode, userToken);
    var sliderFrc=FirebaseConnector.getFireBaseDataParsed(sliderFrcNode, userToken);
    Logger.log(sliderFrc)
    //var userDataConfig=FirebaseConnector.getFireBaseDataParsed(userDataConfigNode, userToken);
    
    //var batchCSVMappingNode= userDataConfig.batchCSVMapping;
    //var dataNode = userDataConfig.batchDataNode;
    var dataNode,dataValues;
        
    
    var batchCSVMapping = FirebaseConnector.getFireBaseDataParsed(batchCSVMappingNode, userToken);
    //var dataValues = FirebaseConnector.getFireBaseDataParsed(dataNode, userToken);
    
    var batchKindOfFrc=FirebaseConnector.getFireBaseDataParsed(batchKindOfFrcNode, userToken);
    var batchFrcFlagsColumn=FirebaseConnector.getFireBaseDataParsed(batchFrcFlagsColumnNode, userToken);
    var batchFrcNotesColumn=FirebaseConnector.getFireBaseDataParsed(batchFrcNotesColumnNode, userToken);
    var batchLastDateRow = FirebaseConnector.getFireBaseDataParsed(batchLastDateRowNode, userToken);
        
    var lenght = values.length;    
    //for(var i=1; i<lenght;i++){
      //values[i][sliderFrc.sliderFrcA.to]=values[i][sliderFrc.sliderFrcA.from];
      //values[i][sliderFrc.sliderFrcB.to]=values[i][sliderFrc.sliderFrcB.from];
    //}
    for(var i=1; i<lenght;i++){
      
      //set the DATA NODE where upload data
      //fetch the correct DATA based on region_code
      if(i==1){
        dataNode= DatabaseUtility.fetchDataNodeByCountry(userToken,values[i][batchCSVMapping.region_code], region_codelist);
        dataValues= DatabaseUtility.fetchDataByCountry(userToken,values[i][batchCSVMapping.region_code], region_codelist);
      }
      
      var product_name = DatabaseUtility.getProductLabelFromCode(product_codelist,values[i][batchCSVMapping.product_code]);
      
      var elementSpreadSheetRow=  DatabaseUtility.getElementSpreadSheetRowFromElementCode(batchRowArray,values[i][batchCSVMapping.element_code], product_name);
      
      var elementSpreadSheetColumnFromYear = DatabaseUtility.getElementSpreadSheetColumnFromYear(batchRowColumn,values[i][batchCSVMapping.season], product_name)      
      var realElementSpreadSheetRow = elementSpreadSheetRow - 1 ;      
      var realElementSpreadSheetColumnFromYear = Utility.letterToColumn(elementSpreadSheetColumnFromYear) -1 ;
      
      var value = values[i][batchCSVMapping.value];
      var date = values[i][batchCSVMapping.date];      
      
      if(realElementSpreadSheetRow < 0 || isNaN(realElementSpreadSheetRow)){
        continue;
      }else{
        //update value
        dataValues[product_name][parseInt(realElementSpreadSheetRow).toString()][parseInt(realElementSpreadSheetColumnFromYear).toString()]=value;
        //update last date
        dataValues[product_name][parseInt(batchLastDateRow[product_name]-1).toString()][parseInt(realElementSpreadSheetColumnFromYear).toString()]=date;
        
        //update FRC NOTES AND FLAGS
        //if(date.indexOf(batchKindOfFrc.A) > -1){
        //var realFrcFlagColumn = Utility.letterToColumn(batchFrcFlagsColumn.A) -1 ;
        //var realFrcNotesColumn = Utility.letterToColumn(batchFrcNotesColumn.A) -1 ;
        
        
        // dataValues[product_name][parseInt(realElementSpreadSheetRow).toString()][parseInt(realFrcFlagColumn).toString()]=flag;
        //dataValues[product_name][parseInt(realElementSpreadSheetRow).toString()][parseInt(realFrcNotesColumn).toString()]=notes;
        
        //}else if(fakeDate.indexOf(batchKindOfFrc.B) > -1){
        //var realFrcFlagColumn = Utility.letterToColumn(batchFrcFlagsColumn.B) -1 ;
        //var realFrcNotesColumn = Utility.letterToColumn(batchFrcNotesColumn.B) -1 ;
        
        
        //dataValues[product_name][parseInt(realElementSpreadSheetRow).toString()][parseInt(realFrcFlagColumn).toString()]=flag;
        //dataValues[product_name][parseInt(realElementSpreadSheetRow).toString()][parseInt(realFrcNotesColumn).toString()]=notes;
        //}
        
      }      
    }    
    for (var keys in dataValues){
      Logger.log(keys);
      Logger.log(dataValues[keys]);
    }
   
    
    FirebaseConnector.writeOnFirebase(dataValues,dataNode,userToken);
    
  }
  //---------------------------------------------------------
  // END Fetch Sheet Data from FIREBASE function
  //--------------------------------------------------------- 
}
