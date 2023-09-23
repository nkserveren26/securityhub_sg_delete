import { CfnRule } from "aws-cdk-lib/aws-events";

export class EventBridgeCreator {
    public static createEventRule(): CfnRule {
        const eventRule = new CfnRule();
        return eventRule;
    }
}