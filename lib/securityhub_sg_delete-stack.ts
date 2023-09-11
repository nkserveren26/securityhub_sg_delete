import * as cdk from 'aws-cdk-lib';
import { Function } from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';
import { LambdaCreator } from './services/lambda/creator';
import { LambdaFunctionParams } from './services/lambda/interfaces';
import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class SecurityhubSgDeleteStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const delete_sg_func_params: LambdaFunctionParams = {
      functionName: "delete_sg_full_open_lambda",
      description: "This lambda deletes inbound rules which allow full open.",
      codePath: "lambda/delete_sg",
      handler: "index.handler"
    };

    const policy_for_lambdaRole: PolicyStatement = new PolicyStatement({
      effect: Effect.ALLOW,
      actions: ["ec2:RevokeSecurityGroupIngress"],
      resources: ["*"]
    });

    const delete_sg_func: Function = LambdaCreator.createLambdaFunction(
      this, 
      delete_sg_func_params
    );

    //LambdaのロールにSGのインバウンドルール削除権限を付与するポリシーを追加
    delete_sg_func.addToRolePolicy(policy_for_lambdaRole);
  }
}
