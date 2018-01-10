'use strict';
var CONFIG = JSON.parse(process.env.CONFIG);

var fs = require("fs");


var utils = require("../utils/utils.js");

module.exports = ContentModel;

function ContentModel (content) {
   this.id =(content && content.id) ? content.id : null;
   this.type = (content && content.type) ? content.type : null;
   this.title = (content && content.title) ? content.title : null;
   this.src=(content && content.src) ? content.src : null;
   this.fileName = (content && content.fileName) ? content.fileName : null;

   var data;

    this.setData = function(pData) {
      data = pData;
  }
  
    this.getData= function() {
      return data;
  }
} 

ContentModel.create = function (contentModel, cb){
  console.log("ContentModel.create");
 if(!contentModel.fileName){
      cb(new Error(">>> Error in ContentModel.create: fileName is undefined or null"));
  }
  else if(!contentModel.id)
  {
     cb(new Error(">>> Error in ContentModel.create: id is undefined or null"));
  }
  else {
    //TODO Asyc
    var filePath = utils.getDataFilePath(contentModel.fileName);
    var metaData = utils.getMetaFilePath(contentModel.id);
    fs.writeFile(filePath,contentModel.getData(),function(err){
      if(err){
                  console.error(err.message);
                  return cb(err);
      }
      fs.writeFile(metaData,JSON.stringify(contentModel),function(err){
        if(err){
                  console.error(err.message);
                  return cb(err);
        }
        
        cb(null);
      });
      
    });

  }
}

ContentModel.read = function (contentModel_id, cb){
  //TO DO
  console.log("ContentModel.read");
  if(!contentModel_id)
  {
     cb(new Error(">>> Error in ContentModel.read: id is undefined or null"));
  }
  else {
  // Creation of ContentModel object
    var filePath = utils.getMetaFilePath(contentModel_id);

    utils.fileExists(filePath, function(err) {
      if (err) {
        cb(new Error(">>> Error in ContentModel.read: "+filePath+" file does not exist"));
    }
    else{
          var metaData = JSON.parse(fs.readFileSync(filePath));
	  var contentModel = new ContentModel(metaData);
	cb(null,contentModel); //TODO : Check null in callback
    }      
    });
  }
  
}

ContentModel.update = function (contentModel, cb){
  console.log("ContentModel.update");
  this.read(contentModel.id,function(err,content){
    if(err){
        console.error(err);
        return cb(err);
    }
        ContentModel.create(content,cb);
  })
  /*if(contentModel.getData() != null && contentModel.getData().length > 0){
    var err =this.create(contentModel, cb);
  }*/
}
ContentModel.delete = function (contentModel_id, cb){
  //TODO : Async
  console.log("ContentModel.delete");
  var metaDataPath = utils.getMetaFilePath(contentModel_id);
  var metaData = fs.readFile(metaDataPath,function(err,content){
    if(err){
            console.error(err.message);
            return cb(err);
    }
    var parse_content = JSON.parse(content)
    var filePath = utils.getDataFilePath(parse_content['fileName']);

    fs.unlink(filePath,function(err){
      if(err){
        console.error(err);
        return cb(err);
      }
      //console.log("File %s, deleted",filePath); 
    fs.unlink(metaDataPath,function(err){
      if(err){
          console.error(err);
          return cb(err);
      }
      //console.log("File %s, deleted",metaDataPath);
    })
   });  

  });
  //fs.unlinkSync(filePath);
  //fs.unlinkSync(metaDataPath);
  cb();
}