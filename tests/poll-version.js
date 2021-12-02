/* global describe, it, beforeEach, after */
'use strict'

const request = require('request-promise')

const checkVersion = async () => {
  const targetVersion = process.env.TARGET_VERSION
  const uri = process.env.API_URI
  const headers = JSON.parse(process.env.API_HEADERS)
  console.log('Target Version: ', targetVersion)
  console.log('API URI: ', uri)
  const options = {
    method: 'GET',
    uri,
    json: true
  }
  if (headers) options.headers = headers
  console.log('options:', options)
  const body = await request(options)
  // console.log('body:', body)
  console.log('build-version:', body.buildVersion)
  if (body.buildVersion === targetVersion) return true
  return false
}

describe('poll', () => {
  it('poll build version', async () => {
    let passed = false
    while (!passed) {
      passed = await checkVersion()
      console.log('passed:', passed)
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
  }).timeout(10000)
})
