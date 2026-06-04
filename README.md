# AI Works — AI開発ポートフォリオ

AI開発の成果物（スクリーンショット）をまとめたポートフォリオサイト。
デザインテーマ「**Warm Elegant Minimal**」（明朝体・白基調・ピンクアクセント）。

## 特徴

- レスポンシブ対応（PC / タブレット / スマホ）
- Works ギャラリー：カテゴリフィルタ＋クリックで画像ライトボックス拡大
- スクロール連動のフェードイン演出（`prefers-reduced-motion` 配慮）
- 依存ライブラリなし（Vanilla HTML / CSS / JS）

## 構成

```
.
├── index.html
├── assets/
│   ├── css/style.css
│   ├── js/main.js
│   └── img/            # スクリーンショット・サムネイル
├── robots.txt          # 検索エンジン非表示（noindex）
└── .nojekyll
```

## 公開について

- 検索エンジンにインデックスされないよう `noindex` / `robots.txt` を設定済み。
- リンクを知っている人のみがアクセスする想定の限定公開。

## ローカル確認

```bash
python -m http.server 8000
# http://localhost:8000/
```
