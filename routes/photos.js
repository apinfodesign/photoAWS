var express 	= require('express');
var router 		= express.Router();
var model 		= require('./../lib/model/model-photos');
var globals 	= require('./../lib/globals');
var fs = require('fs');



/* GET photo by ID */
router.get('/id/:id', function(req, res) {
	if(req.param('id')){
		var params = {
			photoID : req.param('id')
		}
		model.getPhotoByID(params, function(err, obj){
			if(err){
					res.status(400).send({error: 'Invalid photo ID'});
			} else {
				res.send(obj);
			}
		});
	} else {
		res.status(400).send({error: 'Invalid login'});		
	}
});


/* Search function 4-1 */
/* GET photo search */ 

router.get('/search', function(req, res) {

	/*adding */
	res.header('Cache-Control', 'no-cache, no-store');
	/*adding*/

	 if(req.param('query')){
	 	var params = { 
	 	query : req.param('query') 
	 	} 
	 	model.getPhotosSearch(params,
        function(err, obj){
		if(err){
			res.status(400).send({error:
			 'Invalid photo search'});
			  } else {
			  	res.send(obj);
			  }
			  	}); 
	 		} else {
	 			res.status(400).send({error: 'No search term found.'}); 
	 		} 
});


/* new upload post route */
router.post('/upload', function( req, res) {
			
	console.log(".........");
	console.log("albumID "+ req.param('albumID'));
	console.log("userID " + req.param('userID'));
	console.log("req.files.photo " + req.files.photo);


 	if(req.param('albumID') && req.param('userID') && req.files.photo){

 		 var params = {
 		 	userID : req.param('userID'),
 		 	albumID : req.param('albumID')
 		 };

 		 console.log(params.userID + "  zzzzz");


 		 if(req.param('caption') ) {
 		 	params.caption = req.param('caption');
 		 	} 

 		  console.log(params.userID + "  yyyyyy");
 		  console.log(req.files.photo.path + " ffffff");


 		 fs.exists(req.files.photo.path, function(exists) {
 		 	if(exists) {

 		 	console.log(params + "rrrrrrr");

 		 	params.filePath = req.files.photo.path;

 		    console.log(params.filePath + "eeeeee");

 		 	 	var timestamp = Date.now();
 		 	 	params.newFilename = params.userID + '/' + 
 		 	 		params.filePath.replace('tmp/', timestamp); 

 		 	 	uploadPhoto(params, function(err, fileObject){
 		 	 	if(err){
 		 	 		res.status(400).send({error: 'Invalid photo data 1b'}); 
 		 	 	} else { 
 		 	 		params.url = fileObject.url; 

 		 	 		console.log(params.url + "xxxxx");

 		 	 		delete params.filePath; 
 		 	 		delete params.newFilename; 
 		 	 		model.createPhoto(params, function(err, obj){
			 	 	if(err){
			 	 		res.status(400). send({error: 'Invalid photo data 2'}); 
 		 	 		} else { 
 		 	 		res.send(obj);}
 		 	 	}); 
 		 	  } 
 		 	}); 
 		 	} else {
 		 	res.status(400).send({error: 'Invalid photo data 3'}); 
 		 } 
 		}); 
 		} else {
 			console.log("error 4aaa"); 
 
 			res.status(400).send({error: 'Invalid photo data 4a'}); 

 	} 
 });
 

/* OLD POST create photo. */
// router.post('/upload', function(req, res) {
//  	if(req.param('albumID') && req.param('userID')){
//  		var params = {
//  			userID 		: req.param('userID'),
//  			albumID 	: req.param('albumID')
//  		}
//  		if(req.param('caption')){
//  			params.caption = req.param('caption');
//  		}

//  		model.createPhoto(params, function(err, obj){
// 			if(err){
// 					res.status(400).send({error: 'Invalid photo data 1'});
// 			} else {
// 				res.send(obj);
// 			}
//  		});
// 	} else {
// 		res.status(400).send({error: 'Invalid photo data 2'});				
// 	}
// });

 

/* POST delete photo. */
router.post('/delete', function(req, res) {
	if(req.param('id')){
		var params = {
			photoID : req.param('id')
		}
		model.deletePhoto(params, function(err, obj){
			if(err){
				res.status(400).send({error: 'Photo not found'});
			} else {
				res.send(obj);
			}
		});
	} else {
		res.status(400).send({error: 'Invalid photo ID'});		
	}
});


/* uploade photo function */

function uploadPhoto(params, callback){ 
	fs.readFile(params.filePath, function(err, imgData) { 
		if( err){callback(err);
		} else {

		console.log("message 5 - uploadphoto here YES");

		var contentType = 'image/jpeg'; 
		var uploadPath = 'uploads/' + params.newFilename; 
		var uploadData = {
					Bucket: globals.awsVariables().bucket, 
					Key			: uploadPath, 
					Body		: imgData, 
					ACL			:'public-read', 
					contentType	: contentType 
					}

		console.log("message 6 - uploadphoto here YES");


		putS3Object(uploadData, function(err, data){ 
							if( err){callback(err); 
								console.log("message 6a error YES ");
								console.log("data is ?" + data);
							} else {

							console.log("message 7 putS3Object here NOT YET");

							fs.unlink(params.filePath, function(err) {
							if(err){callback( err); 
							} else { 
							callback(null, {url: uploadPath}); 
						}
					});
				} 
			});



		}
	}); 
}

function putS3Object(uploadData, callback){ 
	var aws = require('aws-sdk'); 
	if( globals.awsVariables().key){

		console.log("inside putS3Object YES WE GET HERE");

		aws.config.update({ accessKeyId: globals.awsVariables().key, 
						secretAccessKey: globals.awsVariables().secret });


		} 

		console.log("the accessKeyID is " + globals.awsVariables().key);

		var s3 = new aws.S3();

		console.log("uploadPath is " + uploadData.Key);
		console.log("ACL is " + uploadData.ACL);
		console.log("contentType is " + uploadData.contentType);

 	// Bucket: globals.awsVariables().bucket, 
	// 				Key			: uploadPath, 
	// 				Body		: imgData, 
	// 				ACL			:'public-read', 
	// 				contentType	: contentType 
	// 				}


		s3.putObject(uploadData, function(err, data) {
		if(err){
			console.log("inside putS3Object Message 2 putObject FAILS");

			callback(err); 
		} else {

		callback(null, data); 
		} 
	}); 
}
 

module.exports = router;
