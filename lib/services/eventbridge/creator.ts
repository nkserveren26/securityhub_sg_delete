import { CfnRule } from "aws-cdk-lib/aws-events";
import { Construct } from "constructs";
import { eventRuleParams } from "./interfaces";

export class EventBridgeCreator {
    public static createAWSEventRule(
        self: Construct,
        params:eventRuleParams): CfnRule {
        const { ruleName, ruleDescription, state, targetArn, targetId } = params;
        const eventRule = new CfnRule(self, ruleName, {
            name: ruleName,
            description: ruleDescription,
            eventBusName: "default",
            eventPattern: {
                "detail-type": [
                    "Security Hub Findings - Imported"
                ],
                "source": [
                    "aws.securityhub"
                ],
                "detail": {
                    "findings": {
                        "ProductArn": ["arn:aws:securityhub:ap-northeast-1::product/aws/securityhub"],
                        "GeneratorId": ["security-control/EC2.19"],
                        "Severity": {
                            "Label": ["CRITICAL"]
                        },
                        "Compliance": {
                            "Status": [{
                                "anything-but": "PASSED"
                            }]
                        },
                        "Workflow": {
                            "Status": ["NEW"]
                        },
                        "RecordState": ["ACTIVE"]
                    }
                },
            },
            state: state,
            targets: [
                {
                    id: targetId,
                    arn: targetArn
                }
            ]
        });
        return eventRule;
    }
}