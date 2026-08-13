---
name: develop-managed-client-capability
description: Develop, extend, maintain, debug, upgrade, or review trusted application-managed client capabilities, including managed programs, narrow client built-ins, lifecycle/state, function-style tool declarations, Artifact output, doctor checks, release packaging, and tests. Use for internal client plugins or capability extensions whose executable, version, health, resources, or user experience the application must guarantee. Do not use for ordinary application features, arbitrary third-party drop-in plugins, manager-only UI, or installer work unrelated to a capability.
---

# Develop Managed Client Capability

Treat a request called "plugin" as a managed capability only when the current product owns its distribution and lifecycle. Never imply that a public plugin SDK, dynamic loader, or stable third-party ABI exists without source and contract evidence.

## Establish Facts

1. Read the workspace and matched project/source `AGENTS.md`, task control, source, types, tests, ProductContract, CurrentDesign, and Runbook routed by those entries.
2. Search the current executor, tool declaration, Artifact, lifecycle, doctor, updater, release, and test owners before designing. Load [extension-point discovery](references/extension-point-discovery.md) completely for a code change.
3. Use `align-solution-direction` before proposing a solution and `technical-solution` for controlled coding work. Preserve unrelated worktree changes.
4. Treat source and tests as authority for current behavior. A reference or neighboring capability is a navigation aid, not an API promise.

## Classify The Form

| Form | Choose when | Action |
|---|---|---|
| Project CLI or Project Skill | Existing project-owned tooling solves the need | Improve that project workflow; do not add a managed capability |
| Managed capability program | The application must guarantee a cross-project executable, version, health, resource behavior, or stable UX | Add or maintain one focused program and only its real integration owners |
| Client built-in | The action must use client-owned state or handles and cannot be delegated | Add the smallest namespaced action; do not create an interpreter or plugin ABI |
| Public contract change | Existing command/progress/result/Artifact contracts cannot express the result | Stop and design the contract with every consumer |
| Third-party drop-in plugin | Independent install, discovery, permissions, or hot loading is required | Stop unless the product already owns a supported public plugin boundary |

Do not promote an executable found on project `PATH` into an application-managed capability without an explicit ownership decision.

## Define The Capability

Before implementation, record:

- stable identity, owner, user problem, and why an existing CLI or Skill is insufficient;
- profile: stateless command, Artifact producer, managed-process lease, logical resource/state, or a justified combination;
- argv/stdin/stdout/stderr, exit behavior, idempotency, deadline, cancellation, filesystem/process/network/device effects, and stable errors;
- state owner, absolute root, schema/version, limits, cleanup, restart, compatibility, and rollback behavior;
- platforms, dependencies, version/doctor behavior, release components, licenses, declarations, exact consumers, success criteria, and stop conditions.

Select common and conditional acceptance from [capability acceptance](references/capability-acceptance.md). Do not add state, processes, release wiring, public APIs, or UI merely because another capability has them.

## Separate Declarations From Enforcement

- Keep tool declarations function-style: availability/version, callable program or action, signature, inputs, outputs, effects, limits, and stable errors. Do not put orchestration, examples, retries, recovery, or cleanup workflows there.
- Put model-facing selection, composition, diagnostics timing, iteration, recovery, and cleanup in a concise native Skill only when needed.
- Keep identity/cwd routing, invocation shape, namespace protection, availability rejection, deadlines, cancellation, process-tree control, state/lease/Artifact ownership, validation, and limits enforced by code.
- Treat Tool and Skill text as guidance, never execution authority or a security boundary.
- Do not add HTTPS/TLS, certificate, scheme, Origin/Host, redirect, or network-source enforcement in the capability or host application. Transport policy belongs to deployment, the reverse proxy, OS/browser, or an explicitly named platform owner. Keep business authorization and input/output integrity separate.

## Preserve Narrow Ownership

- Let the capability own its business semantics, CLI, state schema, and lease behavior.
- Let the generic client executor own project cwd, deadline/cancel, process trees, project state partitioning, Artifact validation, and lifecycle hook invocation.
- Let document composition own deterministic tool declarations without running deep doctor checks in polling loops.
- Let the updater own configured-endpoint download, integrity/signature checks, immutable installation, activation, and rollback. The running application does not replace itself.
- Let the manager own registrations and worker lifecycle, not invocation execution.
- Keep Server/Web generic unless the public result contract truly cannot express the capability.

## Implement And Verify

1. Re-run the discovery searches and identify exact consumers.
2. Reuse the generic executor and Artifact path. Add narrow dispatch, state, error, declaration, or lifecycle behavior only when the selected profile requires it.
3. Separate package/release doctor, cheap cached runtime availability, and explicit deep diagnostics.
4. Make `version` bounded and machine-readable; reject unknown commands and arguments.
5. Add release integration only when stable delivery is in scope, updating the complete enumerated consumer set without creating another installer.
6. Run the common acceptance baseline and every triggered conditional row. Expand testing to other projects only when their contracts or behavior changed.
7. Update the unique CurrentDesign owner only for a real long-term capability boundary or invariant. Complete WF-0004 and do not close while required checks fail or capability resources remain live.

Stop when implementation would require server-side business parsing, model-selected project/client identity, arbitrary remote code installation, manager-side execution, unbounded resources, transport-security policy in application code, or unidentified public-contract consumers.
