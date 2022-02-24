The repository supports [Issue 10750](https://github.com/serverless/serverless/issues/10750) on [the Serverless framework](https://www.serverless.com/).  The repository contains a bare minimum of the original production code, and many resolvers, Sequelize model files, VTL templates, and `serverless.yml` configuration have been removed for brevity and quick build times.

After cloning, run `yarn package:dev` to build the code.  Once built, inspect the `./.serverless/appsync.zip` file.  This zipped file is the packaged layer file found at `./layers/appsync-layer/package.json`.  The layer file should contain all production dependencies found in that `package.json` file, and it should be about 18 MB in size.

However, unless the `package.excludeDevDependencies` value in `serverless.yml` is set to `false`, the `appsync.zip` file will contain no packages and be about 11 KB in size.  This is the problem.
