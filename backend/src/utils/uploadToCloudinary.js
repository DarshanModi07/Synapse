import cloudinary
from "../config/cloudinary.js";

export const uploadToCloudinary =
(fileBuffer)=>{

    return new Promise(
        (resolve,reject)=>{

            cloudinary.uploader
                .upload_stream(
                    {
                        folder:"avatars"
                    },
                    (err,result)=>{

                        if(err){
                            reject(err);
                        }

                        resolve(result);
                    }
                )
                .end(fileBuffer);
        }
    );
}