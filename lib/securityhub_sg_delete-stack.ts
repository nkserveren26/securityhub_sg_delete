import * as cdk from 'aws-cdk-lib';
import { Function } from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';
import { LambdaCreator } from './services/lambda/creator';
import { LambdaFunctionParams } from './services/lambda/interfaces';
import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { CfnEventBus, CfnRule } from 'aws-cdk-lib/aws-events';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class SecurityhubSgDeleteStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const iamPolicyParams = {
      effect: "ALLOW",
      action: ["ec2:RevokeSecurityGroupIngress"],
      resources: ["*"]
    };

    const deleteSgFuncParams: LambdaFunctionParams = {
      functionName: "delete_sg_full_open_lambda",
      description: "This lambda deletes inbound rules which allow full open.",
      codePath: "lambda/delete_sg",
      handler: "index.handler"
    };

    const eventBridgeParams = {
      eventBusName: "eventBus",
      ruleName: "securityHubAllPortRule",
      ruleDescription: "A rule for security hub policy stricting restricting the opening of all ports"
    };

    const policy_for_lambdaRole: PolicyStatement = new PolicyStatement({
      effect: Effect.ALLOW,
      actions: ["ec2:RevokeSecurityGroupIngress"],
      resources: ["*"]
    });

    const deleteSgFunc: Function = LambdaCreator.createLambdaFunction(
      this, 
      deleteSgFuncParams
    );

    //LambdaのロールにSGのインバウンドルール削除権限を付与するポリシーを追加
    deleteSgFunc.addToRolePolicy(policy_for_lambdaRole);

    //EventBridgeの作成
    const eventBus = new CfnEventBus(this, eventBridgeParams.eventBusName,{
      name: eventBridgeParams.eventBusName
    });

    const rule = new CfnRule(this, eventBridgeParams.ruleName, {
      name: eventBridgeParams.ruleName,
      description: eventBridgeParams.ruleDescription,
      eventBusName: eventBus.attrName,
      eventPattern: {
        "detail-type": [
          "Security Hub Findings - Imported"
        ],
        "source": [
          "aws.securityhub"
        ],
        "detail": {
          "findings": {
            "ProductArn": ["arn:aws:securityhub:ap-northeast-1::product/aws/securityhub"],
            "GeneratorId": ["security-control/EC2.19"],
            "Severity": {
              "Label": ["CRITICAL"]
            },
            "Compliance": {
              "Status": [{
                "anything-but": "PASSED"
              }]
            },
            "Workflow": {
              "Status": ["NEW"]
            },
            "RecordState": ["ACTIVE"]
          }
        },
      },
      state: "ENABLED",
      targets: [
        {
          id: "delete_sg_inbound_rule_of_allport",
          arn: deleteSgFunc.functionArn
        }
      ]
    
    });

    //イベントバスが作成された後にイベントルールを作成するように調整
    rule.addDependency(eventBus);
  }
}
