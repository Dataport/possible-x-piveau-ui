import { defineBuildConfig } from 'unbuild'

// https://github.com/unjs/unbuild
export default defineBuildConfig({
  rollup: {
    // Fix warning with inlining @piveau/piveau-hub-ui-modules/configSchema
    inlineDependencies: true,
  },

  // Rest of config is inferred from package.json
  // See https://github.com/unjs/unbuild
})