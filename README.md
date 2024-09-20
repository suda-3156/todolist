# Todolist

## 使い方

* mysqlの設定

`git clone`したのち，

```
mkdir ./mysql/logs && cd $_
touch mysql-error.log mysql-query.log mysql-slow.log
```

を実行する．

* .envの設定

`.env.example`を`.env`に変更する

### 初回起動

`docker network create todolist`でネットワークを作成する

`docker compose up --build -d`を実行する

* データベースの設定

以下を一行ずつ実行していく

```
docker compose exec server bash
npm ci
npx prisma migrate deploy
npx prisma generate #必要かわからないけど、一応
exit
```

- * 権限に関するエラーが出たら、

```
docker compose exec db bash
mysql -u root -p
# ルートユーザーのパスワードを入力
GRANT CREATE, DROP ON *.* TO 'user'@'%';
FLUSH PRIVILEGES;
```

をすればいいはずです。

**Roleの設定と、ADMINユーザーの設定は後で書くつもり。**

あとは、

`docker compose exec server bash`のち， `npm run dev`

`docker compose exec app bash`のち，`npm ci`, `npm run dev`

で起動できます．

* 落とし方

`docker compose stop`でコンテナを止められて，`docker compose down`でコンテナを停止&削除．imageとvolumeは残っています．

* 2回目以降の起動

imageが残ってると思うので，`docker compose up -d`でいいはずです．

## 意識したこと

### Mysql

ほぼネット上の奴をコピペ．ルートユーザーで開発するのはよくないと聞いたので，そうしてます．

### React

後で作り直すきがするから，あとでかく．

### Server

レイヤードアーキテクチャってやつです．採用理由は最初に知ったアーキテクチャなので．あと，本に困ったらこれみたいにかいてありました．

Detabaseアクセス層はprismaがあるので，ないです．

Repository層でDetabaseのテーブルの生のデータを使いやすい形に変換してます．

Usecase層で必要であればロジックを書くつもりです．

Controllerで認証，認可処理，バリデーション，レスポンスをするつもりです．index.tsかapp.tsで依存性注入をするかも？？？

こうすることで，改修がしやすくなると思っています．

# めも

* server side

- * expressを使うところでerrorに対し，switch文でレスポンスを決定する

- * すなわち，usecase層(controllerの手前)で適切な種類のエラーを投げとく