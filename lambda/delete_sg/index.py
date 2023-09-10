import boto3
import json
from botocore.exceptions import ClientError

ec2 = boto3.client('ec2')

def handler(event, context):
    print(event)
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
        print(e)