/* eslint-disable */
// @ts-check
import { Arguments, Packages, run } from './util/index.mjs'

const packageName = Arguments.tryGet(0, 'No package provided')
const versionBumpType = Arguments.tryGet(1, 'No version bump type provided')

const packageDirectory = Packages.getDirectory(packageName)

await run(`npm run build`, packageDirectory)
await run(`npm version ${versionBumpType}`, packageDirectory)
await run('npm publish', packageDirectory)

await run('npm run clean')