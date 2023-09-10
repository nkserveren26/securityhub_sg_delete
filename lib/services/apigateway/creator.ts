import { Cors, LambdaIntegration, MockIntegration, Model, PassthroughBehavior, Resource, RestApi } from "aws-cdk-lib/aws-apigateway";
import { Construct } from "constructs";

export class APIGatewayCreator {
    public static createRestApi(
        self: Construct,
        apiGatewayName: string,
        apiDescription: string): RestApi {
        return new RestApi(self,apiGatewayName, {
            restApiName: apiGatewayName,
            description: apiDescription,
        });
    }

    public static addResourceToApi(restApi: RestApi, resourceName: string): Resource  {
        return restApi.root.addResource(resourceName);
    }

    public static addOptionMethod(apiResource: Resource) : void {
        apiResource.addMethod(
            "OPTIONS",
            new MockIntegration({
                integrationResponses: [
                    {
                        statusCode: "200",
                        responseParameters: {
                            "method.response.header.Access-Control-Allow-Headers":
                                "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent'",
                            "method.response.header.Access-Control-Allow-Origin": "'*'",
                            "method.response.header.Access-Control-Allow-Methods":
                                "'OPTIONS,GET,PUT,POST,DELETE'",
                        },
                    },
                ],
                passthroughBehavior: PassthroughBehavior.NEVER,
                requestTemplates: {
                    "application/json": '{"statusCode": 200}',
                }
            }),
            {
                methodResponses: [
                    {
                        statusCode: "200",
                        responseParameters: {
                            "method.response.header.Access-Control-Allow-Headers": true,
                            "method.response.header.Access-Control-Allow-Origin": true,
                            "method.response.header.Access-Control-Allow-Methods": true,
                        },
                        responseModels: {
                            "application/json": Model.EMPTY_MODEL,
                        },
                    },
                ]
            },
        );

    }

    public static addMethodToResource(
        apiResource: Resource, 
        method: string, 
        lambdaIntegration: LambdaIntegration) {
            return apiResource.addMethod(method, lambdaIntegration);
    }
}