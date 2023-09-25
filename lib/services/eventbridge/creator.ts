import { CfnRule } from "aws-cdk-lib/aws-events";
import { Construct } from "constructs";
import { SecurityHubEventRuleParams } from "./interfaces";

export class EventBridgeCreator {
    public static createSecurityHubEventRule(
        self: Construct,
        params: SecurityHubEventRuleParams): CfnRule {
        
        // パラメータを個別の変数にセット
        const { 
            ruleName, 
            ruleDescription, 
            sourceSecurityHubRule, 
            severity, 
            state, 
            targetArn, 
            targetId } = params;
        
        // イベントルールの作成
        const eventRule: CfnRule = new CfnRule(self, ruleName, {
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
                        "GeneratorId": [sourceSecurityHubRule],
                        "Severity": {
                            "Label": [severity]
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