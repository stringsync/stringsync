import { cmd } from './util';

export async function getStackOutputValue(stackName: string, exportName: string) {
  const result = await cmd(
    'aws',
    [
      'cloudformation',
      'describe-stacks',
      '--stack-name',
      stackName,
      '--query',
      '"Stacks[0].Outputs[?ExportName==\\`' + exportName + '\\`].OutputValue"',
      '--no-cli-pager',
      '--output',
      'text',
    ],
    { shell: true, stdio: 'pipe' }
  );
  return result.stdout;
}

export async function getSecretValue(secretId: string, awsRegion: string) {
  const result = await cmd(
    'aws',
    [
      'secretsmanager',
      'get-secret-value',
      '--secret-id',
      secretId,
      '--region',
      awsRegion,
      '--query',
      'SecretString',
      '--output',
      'text',
    ],
    { stdio: 'pipe' }
  );
  return result.stdout;
}
