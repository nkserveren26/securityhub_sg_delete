import { Effect,  PolicyStatement,  Role, ServicePrincipal } from "aws-cdk-lib/aws-iam";
import { Construct } from "constructs";
import { customPolicyStatementParams } from "./interfaces";

export class IAMCreator {
    public static createCodeBuildRole(self: Construct, roleName: string) {
        const codeBuildRole = new Role(self, roleName, {
            roleName: roleName,
            assumedBy: new ServicePrincipal('codebuild.amazonaws.com'),
            managedPolicies: [
                {
                    managedPolicyArn: 'arn:aws:iam::aws:policy/AdministratorAccess',
                },
            ],
        });
    }
    public static createCustomPolicyStatement(params: customPolicyStatementParams): PolicyStatement {
        const {effect, actions, resources} = params;
        const policyStatement = new PolicyStatement({
            effect: effect,
            actions: actions,
            resources: resources
        });
        return policyStatement;
    }
}