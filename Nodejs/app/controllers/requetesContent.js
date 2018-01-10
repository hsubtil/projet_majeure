"use strict";
var CONFIG = JSON.parse(process.env.CONFIG);

var fs = require("fs");
var path = require("path");
var ContentModel = require("../models/contentModel.js");
var utils = require("../utils/utils.js");
module.exports = this;

this.get_album_list = function(family_code, cb) {
    console.log("[get_album_list]: IN");
    console.log("[get_album_list]: " + family_code);
    //var final_json = {} // empty Object
    var family_path = "/" + family_code + "/" + "family_content.json";
    var file = utils.getDataFilePath(family_path);
    fs.readFile(file, function(err, content) {
                if (err) {
                    console.log(err);
                    //rep.status(500).end(err.message);
                    cb(err);
                }
                else{
                    console.log("[read_file]: "+ content);
                    content=JSON.parse(content);
                    cb(null, content);
                    console.log("[read_file]: OUT");
                }
                
            });
    console.log("[get_album_list]: OUT");

    /*fs.readdir(CONFIG.contentDirectory, function(err, data) {
        if (!!err) {
            console.log(err);
            rep.status(500).end(err.message);
            return err;
        }
        var listFile = [];
        data.forEach(function(filename) {
            if (path.extname(filename) === ".json") {
                listFile.push(filename)
            }
        })
        listFile.forEach(function(filename) {
            fs.readFile(utils.getDataFilePath(filename), function(err, content) {
                if (err) {
                    console.log(err);
                    rep.status(500).end(err.message);
                    return err;
                }
                var contentModel = new ContentModel(JSON.parse(content));
                final_json[JSON.parse(content)['id']] = contentModel;
                if (Object.keys(final_json).length == listFile.length) {
                    rep.send(final_json);
                }
            });
        })

    })*/
};

this.create = function(req, rep, next) {
    console.log("content.controller.create");
    /*console.log(req.file.path); // The full path to the uploaded file
    console.log(req.file.originalname); // Name of the file on the user's computer
    console.log(req.file.mimetype); // Mime type of the file*/
    var contentModel = new ContentModel();
    console.log(req.body['type']);
    contentModel['id'] = utils.generateUUID();
    contentModel['type'] = req.body['type'];
    contentModel['title'] = req.body['title'];

    if (contentModel['type'] === 'img') {

        fs.readFile(req.file.path, function(err, data) {

        	if (!!err) {
        		console.log(err);
                rep.status(500).end(err.message);
                return err;
        	}

        	contentModel.setData(data);

            contentModel['src'] = '/contents/' + contentModel.id;
            contentModel['fileName'] = utils.getNewFileName(contentModel['id'], req.file.originalname);

            ContentModel.create(contentModel, function(err) {
                if (err) {
                    console.log(err);
                } else {
                    rep.end(JSON.stringify(contentModel));
                }
            });
        });


    } else {
        contentModel['src'] = req.body['file'];
        contentModel['fileName'] = contentModel['id'];
        ContentModel.create(contentModel, function(err) {
            if (err) {
                console.log(err);
            } else {
                rep.end(JSON.stringify(contentModel));
            }
        });
    }


};

this.read = function(req, rep, next) {
    console.log("content.controller.read");
    var contentModel = ContentModel.read(req.contentId, function(err, data) {
        if (err) {
            console.error(err);
        } else {
            console.log(data);
            var content = data;
            if (req.query.json === "true") {
                console.log("json=true");
                rep.send(content);
            } else if (content['type'] === "img") {
                console.log(content['src']);
                rep.sendFile(utils.getDataFilePath(content['fileName']));
            } else {
                console.log("Redirect");
                rep.redirect(content['src']);
            }

        }
    });
};