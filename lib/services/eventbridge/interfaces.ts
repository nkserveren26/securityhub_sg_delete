export interface eventRuleCommonParams {
    ruleName: string,
    ruleDescription: string,
    state: "ENABLED" | "DISABLED"
    targetId: string,
    targetArn: string
}

export interface SecurityHubEventRule extends eventRuleCommonParams {
    sourceSecurityHubRule: string,
    severity: "CRITICAL" | "HIGH"
}