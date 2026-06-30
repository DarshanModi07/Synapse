import cloudinary from "../config/cloudinary.js";

export const uploadToCloudinary = (fileBuffer, folder = "avatars") => {
    console.log("Cloudinary upload started");

    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
            { folder },
            (err, result) => {
                console.log("Cloudinary callback");

                if (err) {
                    console.error(err);
                    return reject(err);
                }

                resolve(result);
            }
        ).end(fileBuffer);
    });
};