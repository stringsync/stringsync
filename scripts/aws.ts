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
