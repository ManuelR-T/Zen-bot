import type { Config } from '@jest/types'

const config: Config.InitialOptions = {
  verbose: true,
  transform: {
    "^.+\\.tsx?$": ["ts-jest", { tsconfig: "<rootDir>/config/tsconfig.json" }],
  },
  collectCoverageFrom: ["src/**/*.ts", "!src/**/*test.ts"],
  rootDir: "../",
};

export default config
