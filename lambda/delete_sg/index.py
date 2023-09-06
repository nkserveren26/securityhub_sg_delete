import boto3
import json
from botocore.exceptions import ClientError

ec2 = boto3.client('ec2')

def handler(event, context):
    print(event)
    #セキュリティグループIDを取得
    message = json.loads(event['Records'][0]['Sns']['Message'])

    sgId = message['detail']['findings'][0]['Resources'][0]['Details']['Other']['groupId']

    #セキュリティグループの削除を実行
    try:
        response = ec2.revoke_security_group_ingress(
            CidrIp = '0.0.0.0/0',
            GroupId = sgId,
            FromPort = 0,
            ToPort = 0,
            IpProtocol = 'tcp'
        )
    except ClientError as e:
        print(e)