export interface eventRuleParams {
    ruleName: string,
    ruleDescription: string,
    state: "ENABLED" | "DISABLED"
    targetId: string,
    targetArn: string
}