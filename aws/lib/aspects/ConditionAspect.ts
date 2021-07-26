import * as cdk from '@aws-cdk/core';

export class ConditionAspect implements cdk.IAspect {
  private readonly condition: cdk.CfnCondition;

  constructor(condition: cdk.CfnCondition) {
    this.condition = condition;
  }

  visit(node: cdk.IConstruct): void {
    if (cdk.CfnResource.isCfnResource(node)) {
      node.cfnOptions.condition = this.condition;
    }
  }
}
