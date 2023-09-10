import { Effect, PolicyStatement, Role, ServicePrincipal } from "aws-cdk-lib/aws-iam";
import { Construct } from "constructs";

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
}