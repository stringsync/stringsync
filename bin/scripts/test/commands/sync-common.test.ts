import {expect, test} from '@oclif/test'

describe('sync-common', () => {
  test
    .stdout()
    .command(['sync-common'])
    .it('runs hello', ctx => {
      expect(ctx.stdout).to.contain('hello world')
    })

  test
    .stdout()
    .command(['sync-common', '--name', 'jeff'])
    .it('runs hello --name jeff', ctx => {
      expect(ctx.stdout).to.contain('hello jeff')
    })
})
