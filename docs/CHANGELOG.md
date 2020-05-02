# ChangeLog

## [0.0.4] - 02-05-2020

### Updated

- Fixed bug with error middleware.
- Split code into separate units.

## [0.0.3] - 02-05-2020

### Updated

- Fixed bug with `this` in the es5 bundle as a result of strict mode.
- Code refactor to slim down bundle size.

## [0.0.2] - 02-05-2020

### Added

- Express. Not going to work if don't actually include as a dependency!

## [0.0.1] - 02-05-2020

### Added

- Initial Express shim with middleware logging. Despite the readme it currently logs to stdout, not using the `trackDependency()` method it claims. This is to come in the next unstable / stable release.
