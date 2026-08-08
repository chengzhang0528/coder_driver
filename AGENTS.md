# coder_driver 工作空间智能体入口

Status: Active
Scope: coder_driver-template
Owner: 项目维护者
Updated: 2026-08-08
Depends On:
- none

本模板提供文档驱动代码协同的控制面。产品契约、当前技术设计、运行操作和已有行为分别由项目正式文档、源码、类型与测试拥有；模板不预设产品、技术栈、服务、端口或源码根。

## 交互与安全

- 不发送可选过程播报；只在需要用户决定、出现阻断或最终收口时输出。
- 不写入或提交真实密钥、连接串、Token、密码、私钥、客户数据、日志或生成物。
- 不根据测试规模、CI、候选或 Git 状态替用户创建 SystemTest 或 Deployment；任务类型只由用户明确目标决定。

## 最短启动路径

1. 先读 `文档/TASK_CONTROL.md`。只有用户询问后续、剩余、下一步或路线图时，且文件存在时，才读 `文档/` 下的 `WORK_CANDIDATES.md`。
2. 命中已有项目时，再读 `文档/项目/项目_<id>/AGENTS.md`，按其触发表只加载一个必要 ProductContract、CurrentDesign、Runbook 或 skill。
3. 请求会改变工作空间、项目制品或项目交付环境时，读 `文档/工作流/WORKFLOW_CONTRACT.md`，选择唯一主 Workflow；结束前读 `WF-0004-任务收口.md`。
4. 涉及代码时，读目标源码根的 `AGENTS.md`、类型和测试；先用 `rg` 定位已有实现。项目入口不存在时，先根据已验证源码根建立项目 AgentEntry 及其所需正式文档位置，不预建产品目录。
5. 创建、移动、删除或无法判断文档位置时，读 `文档/WORKSPACE_STRUCTURE.md`。

## 事实优先级

- 待实现目标：当前用户要求；已登记可恢复任务再结合 `TASK_CONTROL.md` 与其活动计划。
- 已有行为：源码、类型、迁移和自动化测试。
- 产品与公共契约：唯一 ProductContract。
- 当前能力设计：唯一 CurrentDesign。
- 部署与操作：唯一 Runbook。
- 历史：Git 和 Archive，只用于追溯。

来源冲突时停止扩大范围，查明并更新唯一事实所有者；不得以历史任务、评审或报告推断当前规则。

## 工作流与方法

| 触发 | 必要入口 |
|---|---|
| 文档、入口、任务控制或治理变更 | `skills/document-governance/SKILL.md` |
| 未来智能体或协作流程的长期规则纠正 | `skills/evolve-document-driven-workflow/SKILL.md`；首次只提交方案和质疑结论，后续明确授权才实施 |
| 输出或实质调整解决方案、技术方案、实施、接入、迁移或重构方案 | 先读 `skills/align-solution-direction/SKILL.md`；需要技术方案时再读 `skills/technical-solution/SKILL.md` |
| 审查、质疑或反驳已有方案 | `skills/challenge-solution/SKILL.md`；只读审查，不执行方案 |
| 明确要求独立集成、系统、全量、候选或发布门禁验证 | `skills/system-testing/SKILL.md` |
| 正式包发布、目标环境迁移、上线、切换或回滚 | `skills/release-deployment/SKILL.md` |
| 面向开发者的人类文档或 README | `skills/human-documentation/SKILL.md` |
| 初始化、复制或修复控制面 | `skills/replicate-workspace/SKILL.md` |
| 独立工作完成且必要验证通过 | `skills/git-closeout/SKILL.md` |

## 工程与文档门禁

- 调用函数、组件、脚本或 API 前先查源码、类型、AGENTS 或正式文档；不凭经验编造契约。
- 公共接口、DTO、数据库、权限与跨项目契约变更前识别消费者；保持最小改动，不夹带重构。
- Development 先完成范围匹配的白盒证据：源码或类型检查，以及必要的定向单元、组件、契约、局部集成或最小真实依赖验证。独立系统测试和部署只在用户明确建立对应任务时执行。
- 受控且需要跨会话恢复的 Development 在编码前绑定 Active ChangePlan；同回合可完成的受控变更不创建活动计划。能力边界、逻辑流、不变量、状态、安全或失败兼容策略变化时，同一任务更新唯一 CurrentDesign。
- 正式文档、治理入口、任务绑定或活动文档变化后运行 `npm run check:docs`。纯源码、测试或样式变更不运行此检查。
- 服务启动、停止、迁移、端口和恢复只由项目 Runbook 与经过验证的项目入口定义；模板不提供默认服务命令。

## 收口

任务完成前按 WF-0004 清理本任务活动入口，并按需更新唯一长期事实。最终汇报必须先给出 `通过` 或 `不通过`，说明本次任务类型、改动文件、受影响项目、范围匹配证据和 Git 状态；不得声明项目或会话的当前阶段。独立工作完成后，按 `skills/git-closeout/SKILL.md` 精确提交并推送可归属改动；Git 状态不反转功能结论。
