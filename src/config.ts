function getEnvVar(
  variable: string,
  name: string,
  defaultValue: string = '',
): string {
  const value = process.env[variable] || defaultValue
  if (!value) {
    console.error(`Environment variable ${name} (${variable}) is not defined.`)
  }
  return value
}

export const TOKEN = getEnvVar('TOKEN', 'Token')
export const MONGO_URI = getEnvVar('MONGO_URI', 'Mongo URI')
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
