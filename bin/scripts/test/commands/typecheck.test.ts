import {expect, test} from '@oclif/test'

describe('typecheck', () => {
  test
  .stdout()
  .command(['typecheck'])
  .it('runs hello', ctx => {
    expect(ctx.stdout).to.contain('hello world')
  })

  test
  .stdout()
  .command(['typecheck', '--name', 'jeff'])
  .it('runs hello --name jeff', ctx => {
    expect(ctx.stdout).to.contain('hello jeff')
  })
})
