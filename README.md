# degrade-guard-agent

**コード変更のデグレ（意図せず既存挙動が壊れること）を、机上（静的推論）だけで検証する** エージェント／スキルです。

- 変更差分そのものではなく、**「変えていないはずの既存処理」が壊れていないか** を論証します。
- **テストは実行しません。** ソースを読んで推論するので、テストが無いプロジェクトでも使えます。
- AI は合否を自動で下さず、**人間が確認すべき点を漏れなく提示** します。

> ⚠️ 現在は **構想中（素案）** です。実証（実コードでの効き）はこれから行います。

## 何ができるか

変更（diff / 変更前後のコード）を渡すと、`degrade-guard` スキルが次を出力します。

1. 変更の意図（人間に確認、または AI 推測を明示）
2. **机上トレース表**（代表入力ごとに変更前/後の経路・結果を並べ、一致を検証）
3. 要確認リスト（机上で言い切れない箇所）
4. 波及チェック（呼び出し元1ホップ／"形ではなく振る舞い"を確認）
5. 危険信号（共有状態・副作用・順序依存など）

判定は ✅不変 / ⚠️要確認 / 🔴変化 の3段。**⚠️/🔴 をすべて人間が「意図通り」と確認できたらマージ可** という運用を想定しています。

## インストール（Claude Code / Codex CLI 両対応）

スキル本体の正本は `.claude/skills/degrade-guard/`。両ツールは置き場所だけが異なります。

```bash
# リポジトリを取得
git clone https://github.com/Cyberdog-AI-Lab/degrade-guard-agent.git
cd degrade-guard-agent
```

- **Claude Code** … `.claude/skills/degrade-guard/` を読みます。プロジェクトにこのディレクトリを配置すれば有効です。
- **Codex CLI** … `.codex/skills/degrade-guard`（正本への symlink）を読みます。

symlink が効かない環境（Windows 等）では手動コピーしてください。

```bash
cp -r .claude/skills/degrade-guard .codex/skills/degrade-guard
```

## 使い方

エージェントに、デグレを確認したい変更（diff）を渡して依頼します。

```
この修正で既存が壊れてないか、机上でデグレチェックして
```

## ディレクトリ構成

```
degrade-guard-agent/
├── AGENTS.md                            指示の正本
├── CLAUDE.md                            @AGENTS.md 取り込み（Claude 固有追記用）
├── README.md
├── .claude/skills/degrade-guard/
│   └── SKILL.md                         スキル本体（机上デグレ検証の手順）
└── .codex/skills/degrade-guard          → ../../.claude/skills/degrade-guard（symlink）
```

## ライセンス

（公開時に決定）
