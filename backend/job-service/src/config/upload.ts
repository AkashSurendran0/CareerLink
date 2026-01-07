import {PutObjectCommand} from "@aws-sdk/client-s3";
import s3 from "../utils/s3";
import dotenv from "dotenv";

dotenv.config();

export async function uploadResume(pdfBuffer:Buffer){
    const fileKey=`resumes/${Date.now()}.pdf`;

    const command=new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: fileKey,
        Body: pdfBuffer,
        ContentType: "application/pdf"
    });

    await s3.send(command);

    return `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`;
}