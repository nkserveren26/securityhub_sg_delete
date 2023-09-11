import { Role } from "aws-cdk-lib/aws-iam";
import { ILayerVersion, LayerVersion, Runtime } from "aws-cdk-lib/aws-lambda";

export interface LambdaFunctionParams {
    functionName: string,
    codePath: string,
    handler: string,
    timeoutValue?: number,
    memorySize?: number,
    description?: string,
    runtime?: Runtime,
    layers?: LayerVersion[] | ILayerVersion[],
    environment?: { [k: string]: any },
    role?: Role,
}