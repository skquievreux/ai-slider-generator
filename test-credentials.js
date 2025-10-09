const { validateGoogleCredentials } = require('./src/lib/google-auth.ts')

async function test() {
  try {
    console.log('Testing Google credentials...')
    const isValid = await validateGoogleCredentials()
    console.log('Credentials valid:', isValid)
  } catch (error) {
    console.error('Test failed:', error)
  }
}

test()