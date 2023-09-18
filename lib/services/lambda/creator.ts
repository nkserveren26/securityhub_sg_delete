import { Code, Function, Runtime } from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";
import { AddPermissionParams, LambdaFunctionParams } from "./interfaces";
import { Duration } from "aws-cdk-lib";
import { Role, ServicePrincipal } from "aws-cdk-lib/aws-iam";

export class LambdaCreator {
    // Lambda関数を作成する
    public static createLambdaFunction(
        self: Construct,
        params: LambdaFunctionParams): Function {
        const defaultRole: Role = new Role(self, "My Role", {
            assumedBy: new ServicePrincipal("lambda.amazonaws.com"),
            managedPolicies: [
                {
                    managedPolicyArn: 'arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole',
                },
            ],
        });
        const lambdaFunction: Function = new Function(self,params.functionName, {
            functionName: params.functionName,
            description: params.description? params.description : "",
            code: Code.fromAsset(params.codePath),
            runtime: params.runtime ? params.runtime : Runtime.PYTHON_3_9,
            handler: params.handler ? params.handler : "index.handler",
            memorySize: params.memorySize ? params.memorySize : 256,
            timeout: Duration.seconds(
                params.timeoutValue ? params.timeoutValue : 180
            ),
            role: params.role ? params.role : defaultRole,
            environment: params.environment? params.environment : {},
            layers: params.layers ? params.layers : [],

        });
        return lambdaFunction;
    }
    //Lambdaのリソースポリシーに権限を追加する
    public static addPermissionToLambda(lambdaFunc: Function, params: AddPermissionParams) {
        const {id, principal, action, sourceArn} = params;
        lambdaFunc.addPermission(id, {
            principal: principal,
            action: action,
            sourceArn: sourceArn
        });
    }
};