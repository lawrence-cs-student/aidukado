
import os
import uuid
from dotenv import load_dotenv
import boto3

R2_ENDPOINT = os.getenv("R2_ENDPOINT")
R2_BUCKET=os.getenv("R2_BUCKET")
R2_ACCESS_KEY=os.getenv("R2_ACCESS_KEY")
R2_SECRET_KEY=os.getenv("R2_SECRET_KEY")

s3_client = boto3.client(
    "s3",
    endpoint_url= R2_ENDPOINT,
    aws_access_key_id= R2_ACCESS_KEY,
    aws_secret_access_key= R2_SECRET_KEY
)

def upload_file(file, folder):
    file_extension= file.filename.split(".")[-1]
    file_key= f"{folder}/{uuid.uuid4()}.{file_extension}"
    
    s3_client.upload_fileobj(file.file, R2_BUCKET, file_key, ExtraArgs={"ExpectedBucketOwner": "<your-account-id>"})
    
    return file_key