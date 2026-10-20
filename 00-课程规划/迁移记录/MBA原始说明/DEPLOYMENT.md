# GitHub Pages 发布

课件以独立项目站点发布，目标地址：

https://linjianghao.com/mba-llm-agents-course/

`CHIANGEL.github.io` 已使用 `linjianghao.com`。GitHub Pages 的项目站点默认继承同一账号个人站点的自定义域名，在仓库名对应的路径提供内容。本项目的 Pages **Custom domain 留空**，发布目录不添加 CNAME；无需修改现有域名解析。

## 首次启用

在仓库 Settings → Pages 中，将 Build and deployment 的 Source 设为 **GitHub Actions**。推送 `.github/workflows/pages.yml` 后，工作流打包并部署。也可在 Actions → Publish course slides → Run workflow 手动发布。

## 后续更新

按现有协作流程修改课件，运行 `qa/build-data.cjs` 更新生成数据和资源版本，再将修改合入 `main`。只要课件目录、发布脚本或工作流有更新，就会自动重新发布；公网链接保持不变。

发布使用已提交的生成数据，不在 GitHub 服务器重新访问原作者机器上的资料路径。打包前会检查页数和入口 JS/CSS 的 SHA-256 版本值。

## 发布文件

`scripts/build-pages.py` 将当前课件的 `index.html`、播放所需 `src/`、`assets/`、`sources/` 和版本数据复制到根目录 `_site/`。QA 历史、制作备份、规划文档与旧交付 ZIP 不进入网页发布包。`_site/` 是本地生成目录，不纳入 Git。

```sh
python3 scripts/build-pages.py
python3 -m http.server 8875 --bind 127.0.0.1 --directory _site
```

网页保留现有翻页、目录、解码参数、消息查看、讲者备注和完整材料等功能。公开网页及其资源可由访问者读取；将仓库改为 public 后，仓库里的源码、来源资料、QA 历史与提交记录也会公开。

部署完成后，以 GitHub Actions 的部署结果和实际打开公网地址为准。发布失败时，查看 Actions 中的日志，修正后重新推送或手动运行。
