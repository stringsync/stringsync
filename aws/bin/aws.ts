#!/usr/bin/env node
import * as core from 'aws-cdk-lib';
import 'source-map-support/register';
import { StringsyncDevStack } from '../lib/StringsyncDevStack';
import { StringsyncStack } from '../lib/StringsyncStack';

const app = new core.App();

new StringsyncStack(app, 'stringsync', {
  stackName: 'stringsync',
  description: 'Production resources for stringsync',
});

new StringsyncDevStack(app, 'stringsyncdev', {
  stackName: 'stringsyncdev',
  description: 'Development resources for stringsync',
});
