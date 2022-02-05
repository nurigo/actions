/* global describe, it */
'use strict'

const request = require('request-promise')

const checkVersion = async () => {
  const targetVersion = process.env.TARGET_VERSION.trim()
  const uri = process.env.API_URI.trim()
  const accessToken = process.env.ACCESS_TOKEN
  console.log('Target Version: ', targetVersion)
  console.log('API URI: ', uri)
  const options = {
    method: 'GET',
    uri,
    headers: {
      Authorization: `Bearer ${accessToken}`
    },
    json: true
  }
  const headers = process.env.API_HEADERS ? JSON.parse(process.env.API_HEADERS) : null
  if (headers) Object.assign(options.headers, headers)
  console.log('options:', options)
  try {
    const body = await request(options)
    console.log('target-version:', targetVersion)
    console.log('build-version:', body.buildVersion)
    console.log('value:', body.value)
    console.log('body:', body)
    if (body.buildVersion && body.buildVersion === targetVersion) return true
    if (body.value && body.value === targetVersion) return true
  } catch (err) {
    console.log('err:', err)
  }
  return false
}

describe('poll', () => {
  it('poll build version', async () => {
    let passed = false
    while (!passed) {
      passed = await checkVersion()
      console.log('passed:', passed)
      await new Promise(resolve => setTimeout(resolve, 10000))
    }
  }).timeout(600000)
})
