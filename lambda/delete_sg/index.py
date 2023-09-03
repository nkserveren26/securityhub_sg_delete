import boto3
from botocore.exceptions import ClientError

ec2 = boto3.client('ec2')

def handler(event, context):
    print(event)
    #セキュリティグループIDを取得
    sgID = ''

    #セキュリティグループの削除を実行
    try:
        response = ec2.revoke_security_group_ingress(
            CidrIp = '0.0.0.0/0',
            GroupId = sgId,
            FromPort = 3389,
            ToPort = 3389,
            IpProtocol = 'tcp'
        )
    except ClientError as e:
        print(e)