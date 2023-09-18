import { IPrincipal, Role } from "aws-cdk-lib/aws-iam";
import { ILayerVersion, LayerVersion, Runtime } from "aws-cdk-lib/aws-lambda";

//Lambda作成に使用するパラメータを定義
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

//Lambdaリソースポリシーへの権限追加に使用するパラメータを定義
export interface AddPermissionParams {
    id: string,
    principal: IPrincipal,
    action: string,
    sourceArn: string
}