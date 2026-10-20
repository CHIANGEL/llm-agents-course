# 协作维护

本目录是课程的独立工作区，远端为 `git@github.com:CHIANGEL/llm-agents-course.git`。公网课件为 https://linjianghao.com/llm-agents-course/ 。

## 开始修改

先阅读 `AGENTS.md`、`00-课程规划/课程共识与制作规范.md` 和 `00-课程规划/第一讲课程规划.md`。课程定位、修改范围以本目录的现行说明及教师新要求为准；MBA 历史记录用于追溯。

本次 setup 原样迁入 200 页 HTML。未来受众适配应围绕日常工作、科研和生活中的真实任务，说明学员可以复用的材料和操作方法；具体新增页面另按实际制作记录。不要把规划写成已完成结果。

## 运行与构建

在根目录运行：

```sh
python3 scripts/preview-course.py
```

打开 `http://127.0.0.1:8876/`。预览支持视频 HTTP Range；端口可通过 `--port` 指定。也可双击 `启动课件.command`。

当前课件位于 `第01讲-LLM-Agents/v02-导入与LLM基础HTML/`，目录名沿用原项目，便于保持相对引用稳定。

- `src/` 内的 JSON、渲染 JS、CSS 与导航定义是主要编辑对象。
- `assets/`、`sources/` 保存字体、图片、视频、演示数据与本地材料。保持相对路径。
- `qa/build-data.cjs` 合并内容，更新页面清单、材料、版本信息、入口 JS/CSS 哈希。需要 Node.js，不需要安装 npm 包。
- 构建还读取相邻 `v01-逐页内容规划/来源登记.json`；本工作区已包含该目录。

```sh
node "第01讲-LLM-Agents/v02-导入与LLM基础HTML/qa/build-data.cjs"
python3 scripts/build-pages.py
```

前者用于维护源课件，后者将最新播放文件复制到 `_site/`。不要手工修改生成数据后遗漏源文件，也不要只更新源码而不重建索引和资源版本。

## 检查与记录

修改后实际检查受影响页面的文字、图像、翻页、目录、完整材料和相关交互；核对本地资源加载和浏览器错误。检查记录写明当前版本、实际范围、问题与复查结果，保存到本轮独立目录。历史 QA 只说明对应历史版本。

本次迁移另提供 `node scripts/verify-independence.cjs`：在所有工作区外资料不可用的条件下进行内存重建，并检查本地资源引用，不改写课件文件。

浏览器检查运行 `node scripts/verify-playback.cjs`，需要 Playwright 和 Chromium/Chrome；可通过 `PLAYWRIGHT_MODULE`、`CHROME_PATH`、`COURSE_URL` 指定环境。播放和内容构建本身不依赖 Playwright。独立性检查写入迁移验证目录，浏览器检查默认写入当前课件的 `qa/` 下，也可通过 `--output` 指定本轮目录，避免覆盖历史结果。

`qa/` 中的旧检查、模型采样、裁图和来源打包脚本保留历史原样，部分含原机器路径、旧页码断言，个别脚本会写旧工作目录。它们不是当前课件的运行入口；再次使用前检查输入、输出目录并按本项目适配。现行构建与预览只使用上述入口。

## 保存和协作

保留源码、播放文件、必要素材、来源快照、规范、QA 记录。`_site/` 是可重建产物，`交付/` 的 MBA 旧 ZIP 是历史版本，不是本课程最新版。原 MBA 和更早课程工作区保持只读。

开始工作前运行 `git pull --ff-only`，以独立分支制作修改，例如 `git switch -c content/prompting-examples`。提交前检查 `git diff` 和待提交文件，重建生成数据并记录验证结果；推送分支后通过 Pull Request 合入 `main`。教师也可以直接在 `main` 提交已确认的修改。

`main` 的课件目录、发布脚本或工作流更新会触发 GitHub Actions 自动发布。完成同步后检查 Actions 的 build/deploy 均成功，并打开公网课件核对版本。站点不会在讲课中途自动切页，已打开页面需要刷新。具体设置和故障处理见 [DEPLOYMENT.md](DEPLOYMENT.md)。
