# Client Lifecycle Reference

Use this state model as a compatibility checklist, then map it to the project's actual state store:

`current -> checking -> available -> downloading -> verifying -> staged -> waiting-for-drain -> activating -> health-check -> ready`

Failure may occur in any state. Preserve `current` until activation and health checks succeed. Keep `previous` while the new release is under observation. A pending candidate may be discarded without affecting the running release.

| Responsibility | Owner | Required property |
|---|---|---|
| First install, prerequisites, repair, uninstall | Installer/store/package manager | Explicit platform contract and reversible failure behavior |
| Update discovery and compatibility | Launcher/updater/client shell | Manifest-driven, bounded, observable |
| Download and staging | Updater | Temporary files, size/digest/signature checks, atomic move |
| Session protection | Running client/session manager | No forced interruption; explicit drain condition |
| Activation | Launcher/store/platform updater | User confirmation unless contract allows no-session activation |
| Health and rollback | Launcher/updater | Previous release retained and diagnosable |
| Release publication | CI/release workflow | Immutable artifacts and final pointer/index update |

Do not add a state merely to represent a command. Add one only when it changes ownership, user action, safety, or recovery behavior.
