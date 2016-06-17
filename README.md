# 阪本寧男フィールド写真データベース

京都大学名誉教授阪本寧男先生のエチオピア周辺の写真コレクションの各々について、その説明と撮影地、撮影日時を表示する。

例:

- [IMG-0042](http://app.cias.kyoto-u.ac.jp/sakamoto/photoid/IMG-0042)
- [IMG-0492](http://app.cias.kyoto-u.ac.jp/sakamoto/photoid/IMG-0492)

## 技術的な説明

京都大学地域研究統合情報センターの運営する MyDatabase システムは、Infocom 株式会社の InfoLib を用いている。InfoLib は csv データを元に API の提供や 検索画面の提供などを簡便かつ柔軟に行えるが、そこには permalink が無いため、必要に応じて API を経由して permalink 相当のページを生成する必要がある。本来はスピード面から考えると static な HTML を生成することが望ましいが、簡便のため、.htaccess で URL を書き換えて全てとある HTML ファイルに転送し、その HTML ファイル内の javascript で、URLから ID の読み出し、それに基づく API コールと適切な HTML 表示を行うことで permalink ページを実現している。

## .gitignore しているファイルについての説明

- 画像の呼び出し API が目下改修中のため、`imgs/` 配下に直接画像をファイル名を維持してコピーした。

## Thanks

- [axios](https://github.com/mzabriskie/axios) for Promise, asynchronous I/O,  and polyfill for IE from [promisejs](https://www.promisejs.org/)
- [Leaflet](http://leafletjs.com/) and [Mapbox](https://www.mapbox.com/) for map
- [skeleton-framework](https://github.com/skeleton-framework/skeleton-framework) for responsive web design
- [Dirty Ego font by Misprinted Type](http://www.fontspace.com/misprinted-type/dirty-ego)
- and Prof. SAKAMOTO Sadao

## License of scripts

MIT License - Copyright (c) 2016 KAMEDA Akihiro
