import {PutObjectCommand} from "@aws-sdk/client-s3";
import s3 from "../utils/s3";
// import {v4 as uuidv4} from "uuid";
import dotenv from "dotenv";

dotenv.config();

export async function uploadImageToS3 (fileBuffer: Buffer, fileType: string) {
    const fileKey = `upload/${fileType}`;

    const command = new PutObjectCommand ({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: fileKey,
        Body: fileBuffer,
        ContentType: `image/${fileType}`,
    });

    await s3.send(command);

    return `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`;
}