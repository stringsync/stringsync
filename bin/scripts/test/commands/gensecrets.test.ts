import {expect, test} from '@oclif/test'

describe('gensecrets', () => {
  test
  .stdout()
  .command(['gensecrets'])
  .it('runs hello', ctx => {
    expect(ctx.stdout).to.contain('hello world')
  })

  test
  .stdout()
  .command(['gensecrets', '--name', 'jeff'])
  .it('runs hello --name jeff', ctx => {
    expect(ctx.stdout).to.contain('hello jeff')
  })
})
