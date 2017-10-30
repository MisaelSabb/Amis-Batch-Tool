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
    
    var batchKindOfFrcNode = 'config/batchKindOfFrc';
    var batchFrcFlagsColumnNode = 'config/batchFrcFlagsColumn';
    var batchFrcNotesColumnNode = 'config/batchFrcNotesColumn';
    var batchLastDateRowNode = 'config/batchLastDateRow';
    
    var userDataConfigNode ='users_data/'+uid;
    
    var batchRowArray=FirebaseConnector.getFireBaseDataParsed(batchRowArrayNode, userToken);
    var batchRowColumn=FirebaseConnector.getFireBaseDataParsed(batchRowColumnNode, userToken);    
    var region_codelist=FirebaseConnector.getFireBaseDataParsed(region_codelistNode, userToken);
    var product_codelist=FirebaseConnector.getFireBaseDataParsed(product_codelistNode, userToken);
    var userDataConfig=FirebaseConnector.getFireBaseDataParsed(userDataConfigNode, userToken);
    
    var batchCSVMappingNode= userDataConfig.batchCSVMapping;
    var dataNode = userDataConfig.batchDataNode;
        
    
    var batchCSVMapping = FirebaseConnector.getFireBaseDataParsed(batchCSVMappingNode, userToken);
    var dataValues = FirebaseConnector.getFireBaseDataParsed(dataNode, userToken);        
    
    var batchKindOfFrc=FirebaseConnector.getFireBaseDataParsed(batchKindOfFrcNode, userToken);
    var batchFrcFlagsColumn=FirebaseConnector.getFireBaseDataParsed(batchFrcFlagsColumnNode, userToken);
    var batchFrcNotesColumn=FirebaseConnector.getFireBaseDataParsed(batchFrcNotesColumnNode, userToken);
    var batchLastDateRow = FirebaseConnector.getFireBaseDataParsed(batchLastDateRowNode, userToken);
        
    var lenght = values.length;
    
    //-------------------
    //MAPPING CSV KEY-VALUES
    //-------------------
    // ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    
    //USDA FAS;		259.00;		"United States of America";		1.00;			"Wheat";		2.00;			"Area Harvested";		"Thousand Ha";		2016.00;		"2016/17";		"11/28/2016";		17762.00;		;
    
    //database		region_code		region_name					product_code	product_name	element_code	element_name			units				year			season			date				value		notes		flag
    //0				1				2							3				4				5				6						7					8				9				10					11			12			13		
    //----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------  
    
    
    for(var i=1; i<lenght;i++){
      //split CSV values
      var splitted = values[i].toString().split(';');
      
      //---------------------------------------------------------------------------------------------------------------------
      //TODO REMOVE THIS IF WHEN USDA FIX THEIR CSV FORMAT
      //---------------------------------------------------------------------------------------------------------------------
      var splittedLenght = splitted.length;
      
      if(splittedLenght>1){
        var product_name = DatabaseUtility.getProductLabelFromCode(product_codelist,splitted[batchCSVMapping.product_code]);
        
        var elementSpreadSheetRow=  DatabaseUtility.getElementSpreadSheetRowFromElementCode(batchRowArray,splitted[batchCSVMapping.element_code], product_name);
        
        var elementSpreadSheetColumnFromYear = DatabaseUtility.getElementSpreadSheetColumnFromYear(batchRowColumn,splitted[batchCSVMapping.year], product_name)
        
        var realElementSpreadSheetRow = elementSpreadSheetRow - 1 ;      
        var realElementSpreadSheetColumnFromYear = Utility.letterToColumn(elementSpreadSheetColumnFromYear) -1 ;
        
        var value = splitted[batchCSVMapping.value];
        var date = splitted[batchCSVMapping.date];        
        var flag = splitted[batchCSVMapping.flag];
        var notes = splitted[batchCSVMapping.notes];
        if(realElementSpreadSheetRow < 0 || isNaN(realElementSpreadSheetRow)){
          continue;
        }else{
          //update value
          dataValues[product_name][parseInt(realElementSpreadSheetRow).toString()][parseInt(realElementSpreadSheetColumnFromYear).toString()]=value;
          //update last date
          dataValues[product_name][parseInt(batchLastDateRow[product_name]-1).toString()][parseInt(realElementSpreadSheetColumnFromYear).toString()]=date;
          
          //update FRC NOTES AND FLAGS
          if(date.indexOf(batchKindOfFrc.A) > -1){
            var realFrcFlagColumn = Utility.letterToColumn(batchFrcFlagsColumn.A) -1 ;
            var realFrcNotesColumn = Utility.letterToColumn(batchFrcNotesColumn.A) -1 ;
            
            
            dataValues[product_name][parseInt(realElementSpreadSheetRow).toString()][parseInt(realFrcFlagColumn).toString()]=flag;
            dataValues[product_name][parseInt(realElementSpreadSheetRow).toString()][parseInt(realFrcNotesColumn).toString()]=notes;
          }else if(fakeDate.indexOf(batchKindOfFrc.B) > -1){
            var realFrcFlagColumn = Utility.letterToColumn(batchFrcFlagsColumn.B) -1 ;
            var realFrcNotesColumn = Utility.letterToColumn(batchFrcNotesColumn.B) -1 ;
            
            
            dataValues[product_name][parseInt(realElementSpreadSheetRow).toString()][parseInt(realFrcFlagColumn).toString()]=flag;
            dataValues[product_name][parseInt(realElementSpreadSheetRow).toString()][parseInt(realFrcNotesColumn).toString()]=notes;
          }
        }
        
      }else{
        var product_name = DatabaseUtility.getProductLabelFromCode(product_codelist,values[i][batchCSVMapping.product_code]);
        
        var elementSpreadSheetRow=  DatabaseUtility.getElementSpreadSheetRowFromElementCode(batchRowArray,values[i][batchCSVMapping.element_code], product_name);
        
        var elementSpreadSheetColumnFromYear = DatabaseUtility.getElementSpreadSheetColumnFromYear(batchRowColumn,values[i][batchCSVMapping.year], product_name)
        
        var realElementSpreadSheetRow = elementSpreadSheetRow - 1 ;      
        var realElementSpreadSheetColumnFromYear = Utility.letterToColumn(elementSpreadSheetColumnFromYear) -1 ;
        
        var value = values[i][batchCSVMapping.value];
        var date = values[i][batchCSVMapping.date];
        var flag = values[i][batchCSVMapping.flag];
        var notes = values[i][batchCSVMapping.notes];
        
        if(realElementSpreadSheetRow < 0 || isNaN(realElementSpreadSheetRow)){
          continue;
        }else{
          //update value
          dataValues[product_name][parseInt(realElementSpreadSheetRow).toString()][parseInt(realElementSpreadSheetColumnFromYear).toString()]=value;
          //update last date
          dataValues[product_name][parseInt(batchLastDateRow[product_name]-1).toString()][parseInt(realElementSpreadSheetColumnFromYear).toString()]=date;
          
          //update FRC NOTES AND FLAGS
          if(date.indexOf(batchKindOfFrc.A) > -1){
            var realFrcFlagColumn = Utility.letterToColumn(batchFrcFlagsColumn.A) -1 ;
            var realFrcNotesColumn = Utility.letterToColumn(batchFrcNotesColumn.A) -1 ;
            
            
            dataValues[product_name][parseInt(realElementSpreadSheetRow).toString()][parseInt(realFrcFlagColumn).toString()]=flag;
            dataValues[product_name][parseInt(realElementSpreadSheetRow).toString()][parseInt(realFrcNotesColumn).toString()]=notes;
            
          }else if(fakeDate.indexOf(batchKindOfFrc.B) > -1){
            var realFrcFlagColumn = Utility.letterToColumn(batchFrcFlagsColumn.B) -1 ;
            var realFrcNotesColumn = Utility.letterToColumn(batchFrcNotesColumn.B) -1 ;
            
            
            dataValues[product_name][parseInt(realElementSpreadSheetRow).toString()][parseInt(realFrcFlagColumn).toString()]=flag;
            dataValues[product_name][parseInt(realElementSpreadSheetRow).toString()][parseInt(realFrcNotesColumn).toString()]=notes;
          }
          
        }
      }      
    }
    FirebaseConnector.writeOnFirebase(dataValues,dataNode,userToken);
    
  }
  //---------------------------------------------------------
  // END Fetch Sheet Data from FIREBASE function
  //--------------------------------------------------------- 
}
