const cloudinary = require('cloudinary').v2;
const fs = require('fs');

// Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});
const uploadOnCloudinary = async (localfilepath) => {
    try {
        if (!localfilepath) {
            console.log('localfilepath not found!')
            return null
        }
        //upload to cloud
        const response = await cloudinary.uploader.upload(
            localfilepath, {
            resource_type: 'auto'
        }
        )
        //successfull upload
        console.log('File uploaded successfully!', response.url);
        fs.unlinkSync(localfilepath);
        return response;
    } catch (err) {
        fs.unlinkSync(localfilepath);//remove the locally saved temporary file as the upload opration got failed
        console.log(err);
        return null;
    }
}
module.exports = { uploadOnCloudinary };