// const TRACKING_SYM: unique symbol = Symbol('TRACKING_SYM');
// type TRACKING_SYM = typeof TRACKING_SYM;



// export type OnError = () => void;
// export type OnBuild = () => void;
// export type OnInitialBuild = () => void;
// export interface BuildWatchPluginOptions {
//     //include
// }

// export default class BuildWatchPlugin {

//     public onError: OnError;

//     public onBuild: OnBuild | null;
//     private hashes
//     constructor({ afterInitialBuild, afterEveryBuild = BuildWatchPlugin.afterEveryBuild}) {
//         this.afterInitialBuild = afterInitialBuild;
//     }

//     static afterEveryBuild(err, stats, duration) {

//     }

//     apply(compiler) {
//         compiler.hooks.thisCompilation.tap(BuildWatchPlugin.name, (compilation) => {

//         })
//     }

//     markCompilation()
// }