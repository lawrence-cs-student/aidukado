import os
import uuid
import boto3
import io
from dotenv import load_dotenv
from botocore.client import Config
from datetime import timedelta

load_dotenv()

R2_ENDPOINT = os.getenv("R2_ENDPOINT")
R2_BUCKET = os.getenv("R2_BUCKET")
R2_ACCESS_KEY = os.getenv("R2_ACCESS_KEY")
R2_SECRET_KEY = os.getenv("R2_SECRET_KEY")

# Add Config with signature_version='s3v4'
s3_client = boto3.client(
    "s3",
    endpoint_url=R2_ENDPOINT,
    aws_access_key_id=R2_ACCESS_KEY,
    aws_secret_access_key=R2_SECRET_KEY,
    region_name='auto',  # R2 requires 'auto' as region
    config=Config(signature_version='s3v4')  # Force SigV4
)

def upload_file(file_bytes: bytes, filename: str, folder: str) -> str:
    file_extension = filename.split(".")[-1]
    file_key = f"{folder}/{uuid.uuid4()}.{file_extension}"

    buffer = io.BytesIO(file_bytes)
    s3_client.upload_fileobj(
        buffer,
        R2_BUCKET,
        file_key,
        ExtraArgs={"ContentType": f"application/{file_extension}"}
    )

    return file_key


def generate_presigned_url(file_key: str, expires_in: int = 3600) -> str:
    """Generate presigned URL with Signature Version 4"""
    return s3_client.generate_presigned_url(
        "get_object",
        Params={"Bucket": R2_BUCKET, "Key": file_key},
        ExpiresIn=expires_in
    )