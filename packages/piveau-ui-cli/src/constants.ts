import { version } from '../package.json' assert { type: 'json' }

export const VERSION = version as string

export const KNOWN_CONFIG_PATHS = [
  'config/user-config',
]
