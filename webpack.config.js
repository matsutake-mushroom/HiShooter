module.exports = {
    // メインとなるJavaScriptファイル（エントリーポイント）
    entry: `./index.js`,
  
    // ファイルの出力設定
    output: {
      //  出力ファイルのディレクトリ名
      path: `${__dirname}/dist`,
      // 出力ファイル名
      filename: "main.js"
    },
    mode: "production",

    devServer: {
        static: "dist",
        open: true
      }
  };