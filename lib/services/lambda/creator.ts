import { Code, Function, Runtime } from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";
import { LambdaFunctionParams } from "./interfaces";
import { Duration } from "aws-cdk-lib";

export class LambdaCreator {
    // Lambda関数を作成する
    public static createLambdaFunction(
        self: Construct,
        params: LambdaFunctionParams): Function {
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
            environment: params.environment? params.environment : {},
            layers: params.layers ? params.layers : [],

        });
        return lambdaFunction;
    }
};