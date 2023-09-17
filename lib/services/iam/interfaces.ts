import { Effect } from "aws-cdk-lib/aws-iam";

export interface customPolicyStatementParams {
    effect: Effect.ALLOW | Effect.DENY,
    action: string[],
    resources: string[]
}