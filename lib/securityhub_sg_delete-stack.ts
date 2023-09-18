import { IAMCreator } from './services/iam/creator';
import { Resource } from 'aws-cdk-lib/aws-apigateway';
import * as cdk from 'aws-cdk-lib';
import { Function } from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';
import { LambdaCreator } from './services/lambda/creator';
import { AddPermissionParams, LambdaFunctionParams } from './services/lambda/interfaces';
import { Effect, PolicyStatement, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import { CfnEventBus, CfnRule } from 'aws-cdk-lib/aws-events';
import { customPolicyStatementParams } from './services/iam/interfaces';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class SecurityhubSgDeleteStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    //LambdaのIAMロールに付与するIAMポリシー作成に使用するパラメータ
    const iamPolicyParams: customPolicyStatementParams = {
      effect: Effect.ALLOW,
      actions: ["ec2:RevokeSecurityGroupIngress"],
      resources: ["*"]
    };

    //Lambda関数作成に使用するパラメータ
    const deleteSgFuncParams: LambdaFunctionParams = {
      functionName: "delete_sg_full_open_lambda",
      description: "This lambda deletes inbound rules which allow full open.",
      codePath: "lambda/delete_sg",
      handler: "index.handler"
    };

    //EventBridge作成に使用するパラメータ
    const eventBridgeParams = {
      eventBusName: "eventBus",
      ruleName: "securityHubAllPortRule",
      ruleDescription: "A rule for security hub policy stricting restricting the opening of all ports"
    };

    //LambdaのIAMロールに付与するIAMポリシーを作成
    const policy_for_lambdaRole: PolicyStatement = IAMCreator.createCustomPolicyStatement(iamPolicyParams);

    //Lambda関数の作成
    const deleteSgFunc: Function = LambdaCreator.createLambdaFunction(
      this, 
      deleteSgFuncParams
    );

    //LambdaのロールにSGのインバウンドルール削除権限を付与するポリシーを追加
    deleteSgFunc.addToRolePolicy(policy_for_lambdaRole);

    //EventBridgeの作成
    const rule = new CfnRule(this, eventBridgeParams.ruleName, {
      name: eventBridgeParams.ruleName,
      description: eventBridgeParams.ruleDescription,
      eventBusName: "default",
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

    //Lambdaリソースポリシー権限追加に使用するパラメータ
    const addPermissionParams: AddPermissionParams = {
      id: "invokePermission",
      principal: new ServicePrincipal("events.amazonaws.com"),
      action: "lambda:InvokeFunction",
      sourceArn: rule.attrArn,
    };

    //EventBridgeルールがinvokeする権限をLambdaのリソースポリシーに追加
    LambdaCreator.addPermissionToLambda(deleteSgFunc, addPermissionParams);
  }
}
