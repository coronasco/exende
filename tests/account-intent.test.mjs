import test from 'node:test';
import assert from 'node:assert/strict';
import { accountDestination, accountHref } from '../src/lib/account-intent.ts';

test('paid selection survives account links and nested verification return paths', () => {
  for (const plan of ['starter','pro','scale']) {
    const account = new URL(accountHref('signup','/dashboard/billing',plan),'https://www.exende.dev');
    assert.equal(account.searchParams.get('mode'),'signup');
    const callback = accountDestination(account.searchParams.get('next'));
    assert.equal(callback,`/dashboard/billing?plan=${plan}`);
    const afterVerification = new URL(accountHref('signin',callback),'https://www.exende.dev');
    assert.equal(afterVerification.searchParams.get('mode'),'signin');
    assert.equal(accountDestination(afterVerification.searchParams.get('next')),callback);
  }
});
test('untrusted return destinations cannot leave the dashboard allowlist', () => {
  for(const path of ['https://evil.example/dashboard','//evil.example/dashboard','/\\evil.example/dashboard','/dashboard.evil','/dashboard/../account','/dashboard%2f..%2faccount','/dashboard\n','/dashboard/unknown', ['//evil.example'], null, 'x'.repeat(500)]) assert.equal(accountDestination(path),'/dashboard');
  assert.equal(accountDestination('/dashboard/billing?plan=invalid&redirect=https://evil.example'),'/dashboard/billing');
  assert.equal(accountDestination('/dashboard/api-keys?token=sensitive'),'/dashboard/api-keys');
  assert.equal(accountDestination('/dashboard?checkout=success'),'/dashboard');
});
test('explicit safe signup plans take precedence without triggering any payment', () => {
  assert.equal(accountDestination('/dashboard/billing?plan=starter','pro'),'/dashboard/billing?plan=pro');
  assert.equal(accountDestination('/dashboard','enterprise'),'/dashboard');
  assert.equal(accountDestination('/dashboard', ['pro']),'/dashboard');
});
