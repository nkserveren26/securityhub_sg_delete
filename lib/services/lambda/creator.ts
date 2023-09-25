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
        const {
            functionName, 
            description,
            codePath, 
            runtime, 
            handler, 
            memorySize, 
            timeoutValue,
            role, 
            environment, 
            layers} = params;
        const defaultRole: Role = new Role(self, "My Role", {
            assumedBy: new ServicePrincipal("lambda.amazonaws.com"),
            managedPolicies: [
                {
                    managedPolicyArn: 'arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole',
                },
            ],
        });
        const lambdaFunction: Function = new Function(self,functionName, {
            functionName: functionName,
            description: description? description : "",
            code: Code.fromAsset(codePath),
            runtime: runtime ? runtime : Runtime.PYTHON_3_9,
            handler: handler ? handler : "index.handler",
            memorySize: memorySize ? memorySize : 256,
            timeout: Duration.seconds(
                timeoutValue ? timeoutValue : 180
            ),
            role: role ? role : defaultRole,
            environment: environment? environment : {},
            layers: layers ? layers : [],
        });
        return lambdaFunction;
    }

    //Lambdaのリソースポリシーに権限を追加する
    public static addPermissionToLambda(lambdaFunc: Function, params: AddPermissionParams): void {
        const {id, principal, action, sourceArn} = params;
        lambdaFunc.addPermission(id, {
            principal: principal,
            action: action,
            sourceArn: sourceArn
        });
    }
};