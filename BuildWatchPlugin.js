const TRACKING_SYM = Symbol('TRACKING_SYM');

export class BuildWatchPlugin {

    constructor({ afterInitialBuild, afterEveryBuild = BuildWatchPlugin.afterEveryBuild}) {
        this.afterInitialBuild = afterInitialBuild;
    }

    static afterEveryBuild(err, stats, duration) {

    }

    apply(compiler) {
        compiler.hooks.thisCompilation.tap(BuildWatchPlugin.name, (compilation) => {

        })
    }
}