import cloudinary from "../config/cloudinary.js";

export const uploadToCloudinary = (fileBuffer, folder = "avatars") => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
            { folder },
            (err, result) => {
                if (err) {
                    console.error(err);
                    return reject(err);
                }

                resolve(result);
            }
        ).end(fileBuffer);
    });
};