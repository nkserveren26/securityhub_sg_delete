import boto3

ec2 = boto3.client('ec2')

def handler(event, context):
    print(event)