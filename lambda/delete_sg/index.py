import boto3
from botocore.exceptions import ClientError
import logging

ec2 = boto3.client("ec2")
logger = logging.getLogger()
level = logging.INFO
logger.setLevel(level)

def handler(event, context):
    logger.info("Start processing of this function.")
    logger.info(f"event: {event}")
    
    resources = event["detail"]["findings"][0]["Resources"]

    #セキュリティグループIDを取得
    sgId = resources[0]["Details"]["AwsEc2SecurityGroup"]["GroupId"]

    #セキュリティグループの削除を実行
    try:
        response = ec2.revoke_security_group_ingress(
            CidrIp = '0.0.0.0/0',
            GroupId = sgId,
            FromPort = 0,
            ToPort = 65535,
            IpProtocol = 'tcp'
        )
    except ClientError as e:
        logger.error(e.response["Error"])