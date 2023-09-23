export interface eventRuleParams {
    ruleName: string,
    ruleDescription: string,
    state: "ENABLED" | "DISABLED"
    targetId: string,
    targetArn: string
}

export interface SecurityHubEventRule extends eventRuleParams {
    sourceSecurityHubRule: string,
    severity: "CRITICAL" | "HIGH"
}