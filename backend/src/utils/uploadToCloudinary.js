import cloudinary from "../config/cloudinary.js";

export const uploadToCloudinary = (
    fileBuffer,
    folder
)=>{
    return new Promise(
        (resolve,reject)=>{

            cloudinary.uploader
                .upload_stream(
                    {
                        folder
                    },
                    (err,result)=>{

                        if(err){
                            return reject(err);
                        }

                        resolve(result);

                    }
                )
                .end(fileBuffer);

        }
    );
};