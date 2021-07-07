import { expect as expectCDK, MatchStyle, matchTemplate } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as Aws from '../lib/StringsyncStack1';

test('Empty Stack', () => {
  const app = new cdk.App();
  // WHEN
  const stack = new Aws.StringsyncStack(app, 'MyTestStack');
  // THEN
  expectCDK(stack).to(
    matchTemplate(
      {
        Resources: {},
      },
      MatchStyle.EXACT
    )
  );
});
