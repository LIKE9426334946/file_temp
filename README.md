# 火柴人打架项目（Stickman Fight）

这是一个纯前端小游戏：双人同屏控制火柴人进行对战。

## 功能

- 两个火柴人角色（本地双人）。
- 支持移动、跳跃、攻击、防御。
- 血量系统与胜负判定。
- 一键重新开始。

## 本地运行

直接打开 `index.html` 即可运行，或者用本地静态服务器：

```bash
python3 -m http.server 8000
```

然后访问：`http://localhost:8000`

## 操作说明

- 玩家1：`A/D` 移动，`W` 跳跃，`F` 攻击，`G` 防御
- 玩家2：`←/→` 移动，`↑` 跳跃，`/` 攻击，`.` 防御

## 上传到 GitHub

如果你已经配置好 GitHub 账号和仓库，可以执行：

```bash
git add .
git commit -m "feat: add stickman fighting web game"
git branch -M main
git remote add origin <你的仓库地址>
git push -u origin main
```

例如：`https://github.com/<your-name>/stickman-fight.git`
