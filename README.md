`Anuglar.js 1.x`を用いたアプリケーションのテストのためにAPIレスポンスのモックを生成するライブラリ

## 目的

APIレスポンスを模したオブジェクトから、`Angular.js`/`Node.js`のモジュールシステムでそれぞれ使用できるモックを生成する  
`Angular.js`の`Value Service`として生成され、ベースとなったファイルへのパスから`Service`としての名前を`camelCase`で決定する

```js
// /path/to/base/file/my-file.js
// こういうオブジェクトから...
module.exports = {
  foo: 'bar'
};

// Angular.jsのモジュールとして直接ブラウザに読み込ませるためのモック
// /path/to/base/file/my-file.angular.js として生成される
angular.module('httpBackendMock').value('pathToBaseFile', {
  "foo": "bar"
});

// ProtractorのaddMockModuleメソッドに追加するためのモック
// /path/to/base/file/my-file.node.js として生成される
module.exports = function() {
  angular.module('httpBackendMock').value('pathToBaseFile', {
    "foo": "bar"
  });
};
```

## 使い方

CLIツールとして使用する。  
第一引数に設定ファイルを渡すことで、モックモジュールの生成元となるファイルを指定する

設定ファイルには以下の3つのパラメータがある  
※このレポジトリでは`mock.conf.js`というファイル名になっているが、ファイル名の指定は無い

```js
module.exports = {
  // Aungular.jsのモジュールシステムにおけるモジュールの名前を指定する
  moduleName: 'httpBackendMock',

  // globパターンでモックモジュールの生成元となるファイル郡を指定する
  files: [
    'sample/*.js',
    'sample/**/*.js',
  ],

  // デバッグモードをオンにすると、どんなファイルが生成されるか標準出力で確認できる
  isDebug: false,
};
```