import { v2 as cloudinary } from 'cloudinary';
import type DataUriParser from 'datauri/parser';

export class CloudinaryUploader {
    private readonly cloudinary: typeof cloudinary;

    constructor() {
        this.cloudinary = cloudinary;
        this.cloudinary.config({
            secure: true,
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
        });
    }

    public async upload(attachment: DataUriParser) {
        if (!attachment.content) return null;

        const options = { unique_filename: true, overwrite: true };
        const result = await this.cloudinary.uploader.upload(
            attachment.content,
            options,
        );

        return result.secure_url;
    }
}
