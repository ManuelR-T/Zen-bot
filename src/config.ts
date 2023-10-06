function getEnvVar(variable: string, defaultValue: string = ''): string {
  const value = process?.env[variable] || defaultValue
  if (!value) {
    console.error(`Environment variable ${variable} is not defined.`)
  }
  return value
}

export const TOKEN = getEnvVar('TOKEN', 'Token')
export const MONGO_URI = getEnvVar('MONGO_URI', 'mongodb://127.0.0.1:27017')
export const CLIENT_ID = getEnvVar('CLIENT_ID', 'Client ID')

export const NOSE = [
  'nez',
  'zen',
  'nose',
  'noz',
  'ttn',
  '👃',
  '👃🏻',
  '👃🏼',
  '👃🏽',
  '👃🏾',
  '👃🏿',
  '🐽',
  '☯',
  '🐉',
  '🐲',
]
