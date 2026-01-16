import {PutObjectCommand} from "@aws-sdk/client-s3";
import s3 from "../utils/s3";
import dotenv from "dotenv";

dotenv.config();

export async function uploadPost(pdfBuffer:Buffer, fileType:string){
    const fileKey=`posts/${Date.now()}.pdf`;

    const command=new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: fileKey,
        Body: pdfBuffer,
        ContentType: `image/${fileType}`
    });

    await s3.send(command);

    return `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`;
}