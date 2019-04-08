// Copyright 2018 The Casbin Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

const Adapter = require('../lib/adapter')
const { Util, Enforcer, newEnforcer } = require('casbin')
const mongoose = require('mongoose');
const CasbinRule = mongoose.model('CasbinRule');
CasbinRule.find({}, async function(err, docs) {
  if (err) throw err;
  if (docs.length > 0) await CasbinRule.deleteMany();
})

function testGetPolicy (e, res) {
  const myRes = e.getPolicy()
  Util.logPrint('Policy: ' + myRes)
  expect(Util.array2DEquals(res.sort(), myRes.sort())).toBe(true)
}

test('TestAdapter', async () => {
  // Because the DB is empty at first,
  // so we need to load the policy from the file adapter (.CSV) first.
  let e = await newEnforcer('examples/rbac_model.conf', 'examples/rbac_policy.csv')

  let a = await new Adapter()
  await a.init()

  // This is a trick to save the current policy to the DB.
  // We can't call e.savePolicy() because the adapter in the enforcer is still the file adapter.
  // The current policy means the policy in the Node-Casbin enforcer (aka in memory).
  await a.savePolicy(e.getModel())

  // Clear the current policy.
  await e.clearPolicy()

  testGetPolicy(e, [])

  // Load the policy from DB.
  await a.loadPolicy(e.getModel())

  testGetPolicy(e, [
    ['alice', 'data1', 'read'],
    ['bob', 'data2', 'write'],
    ['data2_admin', 'data2', 'read'],
    ['data2_admin', 'data2', 'write']])

  // Note: you don't need to look at the above code
  // if you already have a working DB with policy inside.

  // Now the DB has policy, so we can provide a normal use case.
  // Create an adapter and an enforcer.
  // newEnforcer() will load the policy automatically.
  a = await new Adapter()
  await a.init()
  e = await newEnforcer('examples/rbac_model.conf', a)

  testGetPolicy(e, [
    ['alice', 'data1', 'read'],
    ['bob', 'data2', 'write'],
    ['data2_admin', 'data2', 'read'],
    ['data2_admin', 'data2', 'write']])
})
