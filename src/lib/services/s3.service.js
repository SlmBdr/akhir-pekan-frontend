import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

export class S3Service {
  static getS3Client() {
    const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
    const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
    const region = process.env.AWS_REGION || 'us-east-1';
    const bucketName = process.env.AWS_S3_BUCKET_NAME;

    if (accessKeyId && secretAccessKey && bucketName) {
      return {
        client: new S3Client({
          credentials: { accessKeyId, secretAccessKey },
          region,
        }),
        bucketName,
        region,
      };
    }
    return null;
  }

  static async uploadFile({ buffer, originalname, mimetype }) {
    const s3Info = S3Service.getS3Client();
    if (!s3Info) {
      throw new Error('AWS S3 credentials or bucket name are missing in environment variables. Cannot upload file.');
    }

    const { client, bucketName, region } = s3Info;
    const fileName = `${Date.now()}-${originalname.replace(/[^a-zA-Z0-9.-]/g, '_')}`;

    try {
      const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: fileName,
        Body: buffer,
        ContentType: mimetype,
      });

      await client.send(command);

      return `https://${bucketName}.s3.${region}.amazonaws.com/${fileName}`;
    } catch (err) {
      console.error('Error uploading file to S3:', err);
      throw new Error(`Failed to upload file to S3: ${err.message}`);
    }
  }
}
