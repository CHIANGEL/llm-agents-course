# 协作维护

远端为课程协作仓库 [CHIANGEL/mba-llm-agents-course](https://github.com/CHIANGEL/mba-llm-agents-course)。`main` 保存当前可用版本，修改通过独立分支与 Pull Request 合入。公开仓库可由所有人读取，推送权限仍通过协作者邀请授予。

## 第一次加入

仓库所有者在 GitHub 的 **Settings → Collaborators → Add people** 邀请协作者，协作者接受后克隆。SSH 克隆需要该协作者自己的 GitHub SSH 密钥；也可在仓库 Code 菜单复制 HTTPS 地址。

```sh
git clone git@github.com:CHIANGEL/mba-llm-agents-course.git
cd mba-llm-agents-course
git config pull.ff only
git config fetch.prune true
```

先阅读 `AGENTS.md`、`00-课程规划/课程共识与制作规范.md` 和 `00-课程规划/第一讲课程规划.md`，再修改课程。内容要求以教师最新确认记录为准；当前实际页序和状态数见课件目录内的 `version_manifest.json` 与 `页面清单.md`。

## 每次修改

先更新主分支，再建立一个描述本次工作的分支。多人同时工作前，在 Issue 或 Pull Request 中说明修改模块，尽量避免同时编辑同一页或同一份生成文件。

```sh
git switch main
git pull --ff-only
git switch -c content/prompting-update
```

完成修改并检查后，明确选择本次涉及的文件提交，推送自己的分支，在 GitHub 创建目标为 `main` 的 Pull Request。提交说明写清修改对象，例如 `修正工具调用总览的连线与措辞`。

```sh
git status --short
git diff
git add "本次修改的文件路径"
git diff --cached --stat
git commit -m "说明本次修改"
git push -u origin HEAD
```

Pull Request 说明改动原因、页面或模块、检查方式与结果。合入前由另一位维护者查看；这是团队约定，仓库未强制设置审批人数。不要对共享的 `main` 强制推送。遇到冲突时保留双方需要的内容，解决后重新检查受影响页面。

## 课件入口与编辑方式

当前课件目录为 `第01讲-LLM-Agents/v02-导入与LLM基础HTML/`，沿用历史目录名。双击其中的 `index.html` 可离线播放；移动时保留整个目录。也可在仓库根目录启动预览：

```sh
python3 -m http.server 8765 --bind 127.0.0.1
```

随后打开 `http://127.0.0.1:8765/第01讲-LLM-Agents/v02-导入与LLM基础HTML/`。

- `src/` 中的内容 JSON、渲染 JS、CSS 和导航定义是主要编辑对象。先读课件自身的 `README.md` 与相关模块实现约定。
- `qa/build-data.cjs` 用 Node.js 合并内容并更新索引。`slides.json`、`materials.json`、`src/data.js`、`schedule.json`、`页面清单.md`、`version_manifest.json` 及资源版本记录等由该脚本生成；修改内容源后，将相应生成结果一起提交。仅改渲染 JS/CSS 时也需重建资源哈希。
- 构建不需要安装 npm 包；部分来源记录保留原作者机器的绝对路径，随包 `sources/` 保存可移植的资料快照。
- `qa/check.cjs` 等历史浏览器检查使用原机器的 Playwright、Chrome 路径或旧页序断言。迁移机器应先适配路径及检查范围。模型重新采样和原课程打包脚本是专门的复现工具，日常修改不需要重跑。

```sh
node "第01讲-LLM-Agents/v02-导入与LLM基础HTML/qa/build-data.cjs"
```

检查受影响页面的文字、版式、翻页、目录跳转、材料展开和相关交互；同时核对浏览器错误、离线资源与当前课时安排。教师已允许超出180分钟并分两次讲。历史检查记录只证明对应历史版本，新修改的实播结论应另存到本轮 `qa/` 子目录，注明实际覆盖范围。

合入 `main` 后，GitHub Actions 会自动打包并发布公网课件，具体目录范围和域名设置见 [DEPLOYMENT.md](DEPLOYMENT.md)。

## 保存范围

课程规划、课件源码、已生成的播放文件、必要素材、来源快照、历史基线、QA 脚本、报告及截图都纳入 Git。相邻原课程保持只读；本仓库已有来源快照可供共同维护。

操作系统文件、本地依赖、缓存、环境配置与预览日志由 `.gitignore` 排除。`交付/*.zip` 是独立打包产物，保留在本地；现有历史包的名称与 SHA-256 记录在 `交付/本地历史包清单.json`。需要分享新版本时，可将 ZIP 放到 GitHub Release，并在说明中写明对应提交。

不要提交 API 密钥、私钥或个人环境配置。新文件在提交前用 `git diff --cached` 检查；来源资料、字体和图片按现有授权范围用于课程维护，发布到公开仓库前另行核对。
