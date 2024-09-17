# Todolist

## 使い方

* mysqlの設定

`git clone`したのち，

```
mkdir ./mysql/logs && cd $_
touch mysql-error.log mysql-query.log mysql-slow.log
```

を実行する．

* compose.ymlの設定

ルートディレクトリで`touch .env`したのち，以下を書き入れる．

```
ROOT_PASSWORD=パスワード
DB_NAME=データベース名
DB_USER=開発で使うユーザー
DB_PASS=開発で使うユーザーのパスワード
TZ=Asia/Tokyo
```

* node.jsの設定

とくになし．

### 初回起動

`docker compose up --build -d`を実行する