# coder_driver

用于新项目的最小智能体协作入口。模板只保留 [AGENTS.md](AGENTS.md) 和本说明，不预设产品、技术栈、源码根或运行环境。

## 使用模板

1. 将 `AGENTS.md` 放到目标仓库根目录。目标已有入口时，先核对差异并合并适用规则，保留原有项目约束。
2. 将目标项目的实际源码入口、已有产品或运行文档、必要检查命令写入该入口。只记录已经核实的路径和命令。
3. 按任务从 [skills-hub](https://github.com/xingshukeji/skills-hub) 选用方法。需要本地发现时，从其默认分支取得对应完整技能目录，安装到目标项目声明的消费位置；同时保留参考、脚本、资源和声明。
4. 根据实际内容改写目标项目的 README。只有产生长期事实或需要恢复的任务时，才在该项目已有规则指定的位置补充文档。

采用前先核对现有源码、文档、Git 状态和任务。模板不会自动安装技能、更新项目或创建任务。已有项目的初始化与修复方法见 [工作空间维护](https://github.com/xingshukeji/skills-hub/blob/main/skills/shzw-workspace-maintenance/SKILL.md)。

## 共同方法与工作流

共同方法由 skills-hub 唯一维护，Git 工具位于其 [support/shzw-git-closeout](https://github.com/xingshukeji/skills-hub/blob/main/support/shzw-git-closeout/GUIDE.md)。需要更新方法时修改该来源，再更新明确选中的完整消费目录；不在本模板维护副本。

通过 Workforce 统一入口发起的团队任务，沿用其 [共同工作流](https://github.com/xingshukeji/xrain-workforce/blob/main/文档/工作流/WORKFLOW_CONTRACT.md) 与中央任务总控。产品、源码和运行事实仍归目标项目。独立项目沿用自身已采用的工作流与任务入口，不因使用模板取得原维护者的账号、环境或操作授权。

## 检查接入结果

采用 Workforce 共同治理，且本模板与 `xrain-workforce` 的 Local checkout 位于同一父目录时，使用 Node.js 22.12 或以上版本，在本模板根目录运行：

```powershell
node ../xrain-workforce/文档/check-docs.mjs --root .
```

退出码为 `0` 表示共享检查器接受当前入口和引用。模板没有声明 StructureContract，检查器不会执行文档位置与元数据策略检查；该结果也不证明外部网页可访问或技能已被模型加载。

其他项目使用其实际采用的检查入口。接入后还须核对源码路由、命令和必要的业务验证，不为检查补建空任务总控、归档、结构文件或 Node 项目。
