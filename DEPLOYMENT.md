# GitHub Pages 发布与本地运行

课件独立发布到：

- 公网课件：https://linjianghao.com/llm-agents-course/
- 远端仓库：https://github.com/CHIANGEL/llm-agents-course
- 部署记录：https://github.com/CHIANGEL/llm-agents-course/actions/workflows/pages.yml

学院师生无需登录即可访问课件。仓库采用公开可见性，包含课件源码、制作规范、来源资料和历史 QA；网页发布包只包含播放资源与材料。

## 自动部署

`.github/workflows/pages.yml` 在 `main` 中的课件目录、发布脚本或工作流发生变更时自动运行，也支持 Actions 中手动 Run workflow。构建打包完成后直接部署到 GitHub Pages，网址保持不变。已打开的页面刷新后显示新版，不会在讲课中途自动切换内容。

维护时先在本地重建：

```sh
node "第01讲-LLM-Agents/v02-导入与LLM基础HTML/qa/build-data.cjs"
python3 scripts/build-pages.py
```

然后提交、推送或将 Pull Request 合入 `main`。部署使用已提交的生成数据；打包前核对页数和入口 JS/CSS 哈希。构建不需要访问其他课程目录或作者机器上的绝对路径。

仓库 Settings → Pages 的 Source 使用 **GitHub Actions**。`CHIANGEL.github.io` 已绑定 `linjianghao.com`，项目站点继承这个域名并使用独立仓库路径。此仓库的 **Custom domain 留空**，发布包不添加 CNAME，无需修改现有个人站和其他课程站点。域名继承规则见 [GitHub 官方说明](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/about-custom-domains-and-github-pages#using-a-custom-domain-across-multiple-repositories)。

完成发布以 Actions 的 build/deploy 成功和公网课件实测为准。若失败，先查看失败步骤日志，修正并重新推送；没有文件变化时也可手动重跑工作流。

## 本机播放

在根目录运行 `python3 scripts/preview-course.py`，打开 `http://127.0.0.1:8876/`；或双击 `启动课件.command`。服务只监听本机，支持视频拖动所需的 HTTP Range。播放资源不依赖 MBA 原目录；新闻和公开聊天等外链仍需联网。

## 独立播放包

`scripts/build-pages.py` 生成 `_site/`，包含 `index.html`、`src/`、`assets/`、`sources/`、页面和材料数据、版本清单及 `preview.py`。规划和 QA 历史不进入网页发布包，`_site/` 不纳入 Git。工作流自行打 tar 包后交给 `actions/upload-artifact`，保留教学案例中的 `.agents` 目录；默认的 Pages 打包动作会过滤这类隐藏目录。

整个 `_site/` 可以单独复制给学员。双击其中的 `index.html`，或在其中运行 `python3 preview.py --port 8876`。完整制作项目需要保留根目录、`00-课程规划/` 和 `第01讲-LLM-Agents/` 下的两个版本目录，以便继续编辑和重建。
