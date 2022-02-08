const express = require('express');
const router = express.Router();
const AWS = require("aws-sdk");

router.post('/profile', async (req, res, next) => {
    try {

        let { fileName , base64string , contentType } = req.body ;
        console.log(fileName , contentType)
        let params = {
            Bucket : "unico-connect-1" ,
            Body : Buffer.from(base64string , "base64"),
            Key : `${Math.floor(Math.random()*1000000000000000)}${fileName}}`,
            ACL : "public-read",
            ContentType : contentType
        }

        const s3 = new AWS.S3({
            accessKeyId : "",
            secretAccessKey : "",
            apiVersion : '2006-03-01'            
        });

        const upload_response = await s3.upload(params, { partSize : 10 * 1024 *1024 }).promise() ;
        console.log(upload_response.Location)
        res.status(201).json({
            success : true,
            message : "File uploaded successfully",
            image_url : upload_response.Location
        })
        


    } catch (err) {
        console.log(err)
        res.status(500).json({success: false , message: err});
    }
});

module.exports = router;
