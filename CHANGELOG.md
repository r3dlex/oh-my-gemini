# Changelog

All notable changes to `oh-my-gemini` are documented in this file.

The format follows a conventional changelog style organized by release and change type, based on the repository's release commits, feature and fix history, and the code present in each release line.

## Release line summary

- `1.0.2` hardens the published package with auto-update, MCP transport fixes, verify guard corrections, hooks bridge parity, and OMG-first branding readiness for the next release.
- `1.0.0` establishes the canonical `oh-my-gemini` / `omg` release line, adds the packaged `extensions/oh-my-gemini/` scaffold, and hardens release readiness with coverage and workflow gates.
- `0.1.0` established the initial CLI, tmux runtime foundation, and persisted state model.
- `0.2.0` expanded OMP into an extension-first orchestration platform with setup, lifecycle, tools, MCP, HUD, providers, and control-plane hardening.
- `0.3.0` completed major lifecycle parity work for team orchestration and resumable state.
- `0.3.1` added interactive launch and relaxed Docker assumptions for everyday use.
- `0.4.0` introduced the hook pipeline, execution modes, learned-skill capture, ask/cost/session flows, and richer notifications.
- `0.5.x` exposed all skills as native Gemini CLI slash commands, fixed extension loading, and streamlined CI/CD.

## [1.2.0](https://github.com/r3dlex/oh-my-gemini/compare/oh-my-gemini-v1.1.0...oh-my-gemini-v1.2.0) (2026-04-21)


### Features

* add feature-wise readiness verification command ([1a6f135](https://github.com/r3dlex/oh-my-gemini/commit/1a6f135a997be398996b273cd4d2e0461067a6e1))
* add gemini-spawn headless runtime backend ([d8b0cf9](https://github.com/r3dlex/oh-my-gemini/commit/d8b0cf9df6223112688e7fe9a22ee8999335dd7e))
* add gemini-spawn headless runtime backend and MIT license ([9df6878](https://github.com/r3dlex/oh-my-gemini/commit/9df6878fe2ef03a75d19ed57ce182409703993a7))
* add interactive launch mode and optional docker check ([#47](https://github.com/r3dlex/oh-my-gemini/issues/47)) ([70cbe9a](https://github.com/r3dlex/oh-my-gemini/commit/70cbe9abd7a9b7f55c78cb0c565f7f5c733c8f95))
* add omg lifecycle parity and state hardening ([#43](https://github.com/r3dlex/oh-my-gemini/issues/43)) ([22dca9a](https://github.com/r3dlex/oh-my-gemini/commit/22dca9a2d224b7c7a72aaa6152d08f93b588f45f))
* add Slack/Discord/Telegram notification system ([e1c73a0](https://github.com/r3dlex/oh-my-gemini/commit/e1c73a0c2da0e3f45daa51a75d33e8da03fe2e5b))
* agent expansion, command surface, and context layer ([#91](https://github.com/r3dlex/oh-my-gemini/issues/91)) ([bcc77ce](https://github.com/r3dlex/oh-my-gemini/commit/bcc77ced1bdac0bdf42abd48ed5c9759b292aeef))
* **agents,openclaw,lib,shared:** port core OMC modules with Gemini adaptation ([#29](https://github.com/r3dlex/oh-my-gemini/issues/29)) ([e6fc539](https://github.com/r3dlex/oh-my-gemini/commit/e6fc539f9626c469ef2bb117fd40ac1e806fbb4a))
* **cli:** add built-in MCP tools command + extension registration ([7240da9](https://github.com/r3dlex/oh-my-gemini/commit/7240da9a8ccf5627489b5d82daf01e25bb89a20c))
* **cli:** add extension path command and symlink-safe entrypoint ([7fca079](https://github.com/r3dlex/oh-my-gemini/commit/7fca0794e59e4e3d004d28b6c68646ccec3d10fe))
* **cli:** add omg version command with json output ([#53](https://github.com/r3dlex/oh-my-gemini/issues/53)) ([172687b](https://github.com/r3dlex/oh-my-gemini/commit/172687b046f4a5208d1649b766ac68570ab8f901))
* close remaining todo parity gaps ([4d804c9](https://github.com/r3dlex/oh-my-gemini/commit/4d804c925a64e6e7a187ecb19387d78d50e560fa))
* complete OMG MVP Phase 2+3 gaps ([#44](https://github.com/r3dlex/oh-my-gemini/issues/44)) ([23d7c69](https://github.com/r3dlex/oh-my-gemini/commit/23d7c699a9dc627d16af1ece402e2efa0d1ba914))
* complete shared-memory cross-session sync manager ([402b54d](https://github.com/r3dlex/oh-my-gemini/commit/402b54d14f2385075fc0139b333d8d43b4e98b0f))
* **config:** add configurable retry/timeout to provider config ([#69](https://github.com/r3dlex/oh-my-gemini/issues/69)) ([47e0048](https://github.com/r3dlex/oh-my-gemini/commit/47e0048d301cc093b0e9d13650516880b52af9dd))
* **config:** centralize external model defaults with frontier fallback ([#32](https://github.com/r3dlex/oh-my-gemini/issues/32)) ([2f27de8](https://github.com/r3dlex/oh-my-gemini/commit/2f27de8c20c701a96fe71885f6ae55fb22146ee5))
* **contract:** enforce global-install setup gate and alias verification ([90b3416](https://github.com/r3dlex/oh-my-gemini/commit/90b34167f41fb40757b589866054d9f83b80d564))
* **core:** scaffold CLI, installer, and tmux runtime foundation ([7cd5254](https://github.com/r3dlex/oh-my-gemini/commit/7cd5254fe25b775fde0869f6c4c3964e10ca6511))
* deliver wave contracts/runtime hardening and docs sync ([fcc2ae2](https://github.com/r3dlex/oh-my-gemini/commit/fcc2ae2d19e1a9137f4909b42ea8b12ac81b0fea))
* **design:** add DESIGN.md-centric design system integration (Phase 1-3) ([6863b46](https://github.com/r3dlex/oh-my-gemini/commit/6863b463080b40108f78ad21db1d4b3af6df454f))
* **docker:** add full key-auth gemini live smoke path ([1160353](https://github.com/r3dlex/oh-my-gemini/commit/1160353d0dc75e50ea97f9b91e141ebfa240159d))
* expand agent catalog and command surface with context engineering layer ([#90](https://github.com/r3dlex/oh-my-gemini/issues/90)) ([8e75f39](https://github.com/r3dlex/oh-my-gemini/commit/8e75f3921de59f411d9fa8bca949150741a97f4d))
* expand hook system, execution modes, and skill learning ([#50](https://github.com/r3dlex/oh-my-gemini/issues/50)) ([87d61d4](https://github.com/r3dlex/oh-my-gemini/commit/87d61d4c5fe819aba32bcd9e8ee0a3e137a98d1f))
* expand skills, stop callbacks, cost tracking, ask command, rate limit wait ([#49](https://github.com/r3dlex/oh-my-gemini/issues/49)) ([5add577](https://github.com/r3dlex/oh-my-gemini/commit/5add577bf2c47bd42bc3bb202fa12bce759fcdf3))
* expose all skills as /omg: slash commands in Gemini CLI ([27be9ee](https://github.com/r3dlex/oh-my-gemini/commit/27be9ee6eb4e147e97f7d97cf361d569ca713c2d))
* expose canonical role-skill hints in worker context ([8bd55aa](https://github.com/r3dlex/oh-my-gemini/commit/8bd55aa2600579dfd322fb23986657eb9db257dc))
* **extension:** add gemini extension surface and architecture docs ([165c06a](https://github.com/r3dlex/oh-my-gemini/commit/165c06ad3b1c928a246c734fdab108a5db97223d))
* **features:** port OMC core features system ([0b0829a](https://github.com/r3dlex/oh-my-gemini/commit/0b0829a4bcd1df4abc91ce795288fce108723cef))
* finish todo parity runtime and skill hardening ([3a79ccd](https://github.com/r3dlex/oh-my-gemini/commit/3a79ccdd4a1b0dd30a77d137fec00e778179ca75))
* hoist extension to package root for native Gemini CLI install ([cdb1d9a](https://github.com/r3dlex/oh-my-gemini/commit/cdb1d9a4d1b4ce663d476bbcd99587dcbf87e9cc))
* **hooks:** add skill catalog section to GEMINI.md context injection ([dd0fc9d](https://github.com/r3dlex/oh-my-gemini/commit/dd0fc9d65435cddff520b4e03df2689fbb0998d9))
* **hud:** port OMC hud system with overlay and progress indicators ([d3fa520](https://github.com/r3dlex/oh-my-gemini/commit/d3fa520d8328d7f09a158427d0f7c5db01178908))
* **installer:** harden setup path conflicts ([#36](https://github.com/r3dlex/oh-my-gemini/issues/36)) ([4dcf474](https://github.com/r3dlex/oh-my-gemini/commit/4dcf4748cbe1758147c3ba2b974ab91970916754))
* integrate dev parity + latest providers/platform/tools catch-up into main ([81687bf](https://github.com/r3dlex/oh-my-gemini/commit/81687bffc8fde760827c8ca8fc4e3704d8a0e9d1))
* **interop:** port OMC interop system with API bridges ([1dfc88f](https://github.com/r3dlex/oh-my-gemini/commit/1dfc88fa60c65588259985683bd5d366abd707d7))
* **mcp:** add MCP server/client integration scaffold ([cbf5d0d](https://github.com/r3dlex/oh-my-gemini/commit/cbf5d0d79ed435421876821173662dafddab99ca))
* **mcp:** add omg mcp serve command and default surfaces ([6e6afbe](https://github.com/r3dlex/oh-my-gemini/commit/6e6afbecf9a945c0c713da84fba8daa80ce71bf0))
* **mcp:** add reusable MCP server and client module ([7d89498](https://github.com/r3dlex/oh-my-gemini/commit/7d8949876aa99de359bba03c1afdde354e36f498))
* **mcp:** register default file and exec tools ([d070c4f](https://github.com/r3dlex/oh-my-gemini/commit/d070c4f66a013bf8478213f2b12cd9196ea0a6f0))
* native Gemini CLI agent .md files and deprecate JSON catalog ([#83](https://github.com/r3dlex/oh-my-gemini/issues/83)) ([a93938b](https://github.com/r3dlex/oh-my-gemini/commit/a93938bee62ba6ead338facf196f0ec77ce87813))
* **notifications:** add slack discord telegram delivery modules ([bcceead](https://github.com/r3dlex/oh-my-gemini/commit/bcceead80cf0f585599e797b94cc9a1257866bf8))
* **platform:** add cross-platform OS detection helpers ([b03ff60](https://github.com/r3dlex/oh-my-gemini/commit/b03ff608e46c72b9b46ac345c0a36cb601e27a6d))
* **platform:** add Gemini-aware runtime environment handling ([2ac7ba6](https://github.com/r3dlex/oh-my-gemini/commit/2ac7ba6b8ef59cf7f6e99b429df11cc58b93117e))
* **platform:** add shell adapter abstraction ([c581660](https://github.com/r3dlex/oh-my-gemini/commit/c58166027a43087610f48ce3c23338d13e995524))
* **platform:** port OMC platform system with environment handling ([4693eef](https://github.com/r3dlex/oh-my-gemini/commit/4693eefb8dc4ebc3ef39e2b53a8acf40767332f2))
* **plugins:** add npm plugin system with loader and registry ([#20](https://github.com/r3dlex/oh-my-gemini/issues/20)) ([2a530dd](https://github.com/r3dlex/oh-my-gemini/commit/2a530ddeacc7a93515d1c9ef30dc3f78e2fea2fd))
* **prd:** add parser, validator, and workflow modules ([ed0f996](https://github.com/r3dlex/oh-my-gemini/commit/ed0f9966b0ed05735bf2f888f643d0274e233be8))
* **prd:** add PRD workflow system with acceptance-criteria validation ([#22](https://github.com/r3dlex/oh-my-gemini/issues/22)) ([cf51a9c](https://github.com/r3dlex/oh-my-gemini/commit/cf51a9cc45f9a0f534ea5366583be13864d07479))
* **providers:** add Gemini 3 model support ([#62](https://github.com/r3dlex/oh-my-gemini/issues/62)) ([b26b3dc](https://github.com/r3dlex/oh-my-gemini/commit/b26b3dc72020bea6e7dab7ecb833f9bc5db26e25))
* **providers:** add Gemini model configuration catalog ([a5ecebe](https://github.com/r3dlex/oh-my-gemini/commit/a5ecebeb70ac372243709d7fcd754b409eabad85))
* **providers:** add Gemini provider registry and detection ([8088b50](https://github.com/r3dlex/oh-my-gemini/commit/8088b50eee1164d4bbd361db1d8d7db35163cec5))
* **providers:** add Gemini REST API client abstraction ([3e5927b](https://github.com/r3dlex/oh-my-gemini/commit/3e5927b8ffdc35970862115c2658c94c51364e32))
* **providers:** port OMC provider system for Gemini API ([933c283](https://github.com/r3dlex/oh-my-gemini/commit/933c2838a8c68cdb0538827f6aaf2a4f3ef04e43))
* **reliability:** add worker heartbeat keepalive signal (30s interval) ([3a0619b](https://github.com/r3dlex/oh-my-gemini/commit/3a0619b1299a6b9cc1bd67386afd141056d757ff))
* **reliability:** implement orchestrator pre-assignment for atomic task claims ([35fbf84](https://github.com/r3dlex/oh-my-gemini/commit/35fbf8421b070cd4cd1129b21b077b478ef81411))
* **runtime:** add tmux worker session recovery ([#65](https://github.com/r3dlex/oh-my-gemini/issues/65)) ([88855e1](https://github.com/r3dlex/oh-my-gemini/commit/88855e1ecc1447de1c27a1f6a3242d8f60f6230b))
* **runtime:** expose configurable tmux recovery max restarts and policy ([#68](https://github.com/r3dlex/oh-my-gemini/issues/68)) ([477292f](https://github.com/r3dlex/oh-my-gemini/commit/477292f2094c68b4580e9bece946bec16f9f5c6b))
* **runtime:** harden team-run/verify contracts and tmux reliability ([85d0f7c](https://github.com/r3dlex/oh-my-gemini/commit/85d0f7cd453d6c334465c8156988a53ee2aaf020))
* **setup:** add action-status reporting and subagents catalog bootstrap ([d963066](https://github.com/r3dlex/oh-my-gemini/commit/d963066385614e6bc2680eb40d3d190bea854243))
* **skills:** expand loadable prompt catalog ([#14](https://github.com/r3dlex/oh-my-gemini/issues/14)) ([07a6f3d](https://github.com/r3dlex/oh-my-gemini/commit/07a6f3d881604b767f60e8795be7acbff2f8ad16))
* **skills:** expand runtime loadable skill catalog ([#21](https://github.com/r3dlex/oh-my-gemini/issues/21)) ([a24ecf3](https://github.com/r3dlex/oh-my-gemini/commit/a24ecf3f6b94d85d89ec68ce0429690bb92da1d6))
* **state:** add shared memory manager with locks and handoff ([a25fe2a](https://github.com/r3dlex/oh-my-gemini/commit/a25fe2a586c971da1c9056ef24371b8193199e0c))
* **state:** harden shared memory sync and handoff durability ([b7636b4](https://github.com/r3dlex/oh-my-gemini/commit/b7636b415cabeb32d02b7fb3da816df452620c17))
* **subagents:** add catalog-driven roles and keyword assignment flow ([a460c7f](https://github.com/r3dlex/oh-my-gemini/commit/a460c7ff1fb1f82674fb974942b96a08831e3fa5))
* **team-e2e:** add live OMX team runbook, command, and smoke script ([5ba3251](https://github.com/r3dlex/oh-my-gemini/commit/5ba3251ce28177f0077ce40705e1818126700178))
* **team:** add OMC-equivalent role management for Gemini ([e175d4f](https://github.com/r3dlex/oh-my-gemini/commit/e175d4f47d8f4f2bd75c4ba7d16d2878597515d9))
* **team:** add role-aware agent coordination plan ([ca77253](https://github.com/r3dlex/oh-my-gemini/commit/ca772537702ea4927f4c6550a418405d36c5896b))
* **team:** add subagent lifecycle tracking ([263d67e](https://github.com/r3dlex/oh-my-gemini/commit/263d67eb1bd17b7d7e43f705cde0f4fea6ba25f3))
* **team:** implement lifecycle commands, control-plane hardening, and parity gates ([db93297](https://github.com/r3dlex/oh-my-gemini/commit/db93297c931d67f7db23f22fe76ea85375dceb93))
* **team:** make same-worker task reclaim idempotent ([#33](https://github.com/r3dlex/oh-my-gemini/issues/33)) ([5ae5d60](https://github.com/r3dlex/oh-my-gemini/commit/5ae5d60bd1fca780b97b03a84590f63af4a5a93e))
* **tools:** add bounded exec tool ([fc62ad3](https://github.com/r3dlex/oh-my-gemini/commit/fc62ad34ae541318dcaa516b07703f9209edf34b))
* **tools:** add secure file tools ([d6a044e](https://github.com/r3dlex/oh-my-gemini/commit/d6a044e74247eae9b80940779f46965361f1a4af))
* **tools:** add tool registry and Gemini adapter ([4d25404](https://github.com/r3dlex/oh-my-gemini/commit/4d254047aac351128f078f845cefe11952e61020))
* **tools:** port OMC tools system with registry and adapters ([23fb6cf](https://github.com/r3dlex/oh-my-gemini/commit/23fb6cf8bcde6a0ca2249d57d60ead2074d28a54))
* **verification:** add tiered test runners and assertion helpers ([daf181c](https://github.com/r3dlex/oh-my-gemini/commit/daf181cdadb9ad6a1e1c6ff7f1ac00ac179603d9))
* **verification:** port OMC verification tier selector ([03cdd0d](https://github.com/r3dlex/oh-my-gemini/commit/03cdd0d6e44ef5be51504956e212b2ea0c1e9836))
* **verify:** include typecheck by default and harden live e2e preflight ([f0df5c7](https://github.com/r3dlex/oh-my-gemini/commit/f0df5c7a9477e001a22f6284530bef3c745ee6eb))


### Bug Fixes

* add mcpServe to CliDependencies and fix implicit any in tests ([03e49b7](https://github.com/r3dlex/oh-my-gemini/commit/03e49b7a8d69322fc46236ac54bd0d29c30b18de))
* **ci:** resolve rollup platform-specific dependency failure ([74e7c1a](https://github.com/r3dlex/oh-my-gemini/commit/74e7c1a28738b99c1202aaf8b401ea850fadaebd))
* **ci:** resolve rollup platform-specific dependency failure ([d76b9fe](https://github.com/r3dlex/oh-my-gemini/commit/d76b9fefe3b1101db95edc03fc37197136f25afe))
* clean legacy skill conflicts from ~/.agents/skills/ during omg setup ([#82](https://github.com/r3dlex/oh-my-gemini/issues/82)) ([3cd54e0](https://github.com/r3dlex/oh-my-gemini/commit/3cd54e03244074e68e4560ec58607e9251f528b1))
* clean up gemini-extension.json to match Gemini CLI spec ([8ff28f2](https://github.com/r3dlex/oh-my-gemini/commit/8ff28f2ec3b993479056a44f38c97c2213345e11))
* **cli:** standardize option parsing across launch, skill, and worker-run commands ([#54](https://github.com/r3dlex/oh-my-gemini/issues/54)) ([8c80830](https://github.com/r3dlex/oh-my-gemini/commit/8c80830e4d79282bc1f93ed041e482b38a25990c))
* **cli:** strictly validate --limit option in sessions command ([#57](https://github.com/r3dlex/oh-my-gemini/issues/57)) ([dc7cb46](https://github.com/r3dlex/oh-my-gemini/commit/dc7cb46511be9462be15796e0fd44b34990e6354))
* **config:** fail closed on invalid cross-provider order ([#37](https://github.com/r3dlex/oh-my-gemini/issues/37)) ([688869b](https://github.com/r3dlex/oh-my-gemini/commit/688869bc7757fa5c4253a19ed5d2d900a1dd5a75))
* **config:** fail closed on invalid numeric env overrides ([#39](https://github.com/r3dlex/oh-my-gemini/issues/39)) ([83e100a](https://github.com/r3dlex/oh-my-gemini/commit/83e100a2594e659d420ddf52dd244e589041661a))
* **docker:** make full smoke GEMINI_API_KEY-only ([e186c68](https://github.com/r3dlex/oh-my-gemini/commit/e186c68f5cbb7e4a8de80e2eb8c053b6c7ca74f6))
* extension disabled after omg setup due to suppressed enable prompt ([b5622ea](https://github.com/r3dlex/oh-my-gemini/commit/b5622ea4dff5c956297474ca26a457a32f86b40e))
* guard --scope user with explicit warning and force fallback to project scope ([e1e64a7](https://github.com/r3dlex/oh-my-gemini/commit/e1e64a73d915cf0db86b26b288627fd93cf2f964))
* guard omg verify to only run inside the oh-my-gemini dev repo ([6b35039](https://github.com/r3dlex/oh-my-gemini/commit/6b35039d4ebe0465d057e91c9241530823210033))
* harden cli and team runtime reliability paths ([d2cebb6](https://github.com/r3dlex/oh-my-gemini/commit/d2cebb682560db3933d9d359d2e6dcaf0ee7bb3b))
* **hud:** strictly validate --interval-ms option ([#55](https://github.com/r3dlex/oh-my-gemini/issues/55)) ([5d1be69](https://github.com/r3dlex/oh-my-gemini/commit/5d1be699c966f9a5072dceb4109e4075c64257c4))
* **notifications:** allow plain HTTP webhooks for localhost/loopback addresses ([#67](https://github.com/r3dlex/oh-my-gemini/issues/67)) ([a03b888](https://github.com/r3dlex/oh-my-gemini/commit/a03b8885d11cc5c79f0b20d16c44f4e698b95b19))
* **openclaw:** fail closed on unresolved command template vars ([#34](https://github.com/r3dlex/oh-my-gemini/issues/34)) ([8431130](https://github.com/r3dlex/oh-my-gemini/commit/84311300a80a1bae1510fbbc804487b1a9ffbed2))
* **openclaw:** make unresolved-template detection repeatable ([084a05a](https://github.com/r3dlex/oh-my-gemini/commit/084a05a16f7843fddd03683d3c0c3bb44b258a8c))
* **openclaw:** make unresolved-template detection repeatable ([fe5f1c9](https://github.com/r3dlex/oh-my-gemini/commit/fe5f1c95e8c3d28e61201079043cdbfa1c0c43b6))
* pass extension name to --extensions flag instead of path ([#80](https://github.com/r3dlex/oh-my-gemini/issues/80)) ([f668ee1](https://github.com/r3dlex/oh-my-gemini/commit/f668ee168fc8b8a76c525725bf7088e81078ff5e))
* platform-aware sandbox default (sandbox-exec on macOS, docker on Linux) ([#52](https://github.com/r3dlex/oh-my-gemini/issues/52)) ([7601161](https://github.com/r3dlex/oh-my-gemini/commit/76011616595cbe20ed3a744f6781359092965888))
* prioritize installed extension path over cwd to reduce resolution noise ([#86](https://github.com/r3dlex/oh-my-gemini/issues/86)) ([bbcd440](https://github.com/r3dlex/oh-my-gemini/commit/bbcd4403d5e1cc8ecb3c5cc04d50b4a6ea66c8e3))
* **providers:** add model-aware request timeouts ([#64](https://github.com/r3dlex/oh-my-gemini/issues/64)) ([b826ced](https://github.com/r3dlex/oh-my-gemini/commit/b826cedba0a1b081775c2cd675f62a5169d67346))
* **providers:** add retry with exponential backoff for API requests ([#61](https://github.com/r3dlex/oh-my-gemini/issues/61)) ([6d50dad](https://github.com/r3dlex/oh-my-gemini/commit/6d50dade6e1f1b1107f32f1e5b9da7be6565e176))
* redirect sync script output to stderr to avoid npm pack --json pollution ([2630d57](https://github.com/r3dlex/oh-my-gemini/commit/2630d5785b1ee5550fb527824478f76df4c5d6d3))
* remove transport key, add @r3dlex/oh-my-gemini verify guard, fix hooks bridge, update tests ([ef0869d](https://github.com/r3dlex/oh-my-gemini/commit/ef0869dcd51d28b8b78ae75a224a53a79502bfcc))
* remove unsupported transport/description keys from Gemini CLI MCP server config ([082ef2c](https://github.com/r3dlex/oh-my-gemini/commit/082ef2c1a77a8fd880df1a8a535fd6a04c1e989b))
* rename .omc state paths to .omg across docs and scripts ([496e1bf](https://github.com/r3dlex/oh-my-gemini/commit/496e1bf8cebfaa41b18feeb7024163f21a1f5e0d))
* rename .omc state paths to .omg in docs and scripts ([6c9a5c3](https://github.com/r3dlex/oh-my-gemini/commit/6c9a5c30af289f428b35b5db9e1ede630d03d17f))
* resolve duplicate exports, env var constants, and legacy path bugs; add GH Packages publish ([f4d4c31](https://github.com/r3dlex/oh-my-gemini/commit/f4d4c31f89539a044cd69058e3b1be47221c04e7))
* run legacy skill cleanup regardless of extension link result ([4ba476e](https://github.com/r3dlex/oh-my-gemini/commit/4ba476e595e9ca26709698d0811697fe68496774))
* run legacy skill cleanup regardless of extension link result ([4cf39b4](https://github.com/r3dlex/oh-my-gemini/commit/4cf39b4631a10dfaa5f9ff69afcfc5a8f299fab6))
* run omg verify --dry-run from ROOT_DIR in consumer contract smoke ([7780928](https://github.com/r3dlex/oh-my-gemini/commit/77809283cda81ef60a10f7c932cc6d674d3f09d4))
* **state:** add file locking for filesystem store ([#63](https://github.com/r3dlex/oh-my-gemini/issues/63)) ([bb39a7f](https://github.com/r3dlex/oh-my-gemini/commit/bb39a7ff580dfcfa6fbfb1e9e8c7ff4f21a6c52a))
* **tests:** resolve type errors in providers tests ([c5c7aaa](https://github.com/r3dlex/oh-my-gemini/commit/c5c7aaa603a4c4f3ee25deb403e3f46382e8b6a7))
* **test:** update orchestrator failure assertion for pre-claim behavior ([cd3ab5d](https://github.com/r3dlex/oh-my-gemini/commit/cd3ab5d42ad54e2f8db27569a615514e85a6e49c))
* use gemini extensions link in setup and correct README quickstart ([81c72c3](https://github.com/r3dlex/oh-my-gemini/commit/81c72c38f29e55d06bd977dcf7c716a3ddde3fe8))
* use PR-based auto-bump to respect branch protection rules ([#85](https://github.com/r3dlex/oh-my-gemini/issues/85)) ([0e83c31](https://github.com/r3dlex/oh-my-gemini/commit/0e83c31e13d1abd3744e8bdde51c23be75d4cb49))

## [Unreleased]

## [1.1.0] - 2026-04-21

### Features

- **GitHub Packages dual-registry publish** — stable and pre-release jobs now publish `@r3dlex/oh-my-gemini` to GitHub Packages (`npm.pkg.github.com`) in addition to npmjs.com; uses `GITHUB_TOKEN` with `packages: write` permission; `--provenance` omitted for GH Packages (unsupported)

### Fixes

- **Duplicate export in extension-path.ts** — removed duplicate `export const OMG_EXTENSION_PATH_ENV` declaration that caused all esbuild-compiled smoke/integration tests to fail with `TransformError: Multiple exports with the same name`
- **Duplicate compat env var constants** — `COMPAT_LEGACY_RUNNING_SUCCESS_ENV_FLAG` and `COMPAT_LEGACY_VERIFY_GATE_PASS_ENV_FLAG` were incorrectly set to the same string as the canonical `OMG_` flags; corrected to `OMX_LEGACY_RUNNING_SUCCESS` and `OMX_LEGACY_VERIFY_GATE_PASS` so canonical `=0` correctly overrides legacy `=1`
- **Duplicate env chain in team-state-store** — second `process.env.OMG_TEAM_STATE_ROOT` reference replaced with `OMP_TEAM_STATE_ROOT`; second `OMG_STATE_ROOT` replaced with `OMP_STATE_ROOT`
- **Duplicate env chain in context-writer** — second `input.env?.OMG_TEAM_STATE_ROOT` replaced with `OMP_TEAM_STATE_ROOT`
- **Legacy token log path** — `resolveLegacyTokenLogPath` was returning the same `.omg` path as the canonical function; corrected to `.omx`
- **Syntax error in interop-format-converters test** — `expect(mapped.annotation.originalSystem: 'omg')` corrected to `expect(mapped.annotation.originalSystem).toBe('omg')`
- **Duplicate key in hook-context-e2e test** — env object `{ OMG_TEAM_STATE_ROOT: ..., OMG_TEAM_STATE_ROOT: ... }` corrected to use `OMX_TEAM_STATE_ROOT` for the legacy slot

### Verification

- All 120 integration/smoke/reliability test files pass (9 skipped)
- Coverage: statements 87.63% / branches 93.61% / functions 96.15% — all above 80%
- Build and typecheck pass

## [1.0.2] - 2026-04-17

### Fixes
- **Fixed Gemini CLI 400 Bad Request from MCP `transport` key**: Removed `transport: "stdio"` from `GeminiExtensionMcpServerConfig` interface and both `omg_cli_tools` / `omp_cli_tools` server configs in `gemini-extension.json` and `src/cli/tools/index.ts`. Gemini CLI rejects the `transport` key in `settings.json`.
- **Fixed `omp verify` failing in published package**: Added `@r3dlex/oh-my-gemini` to the package-name guard in `src/cli/commands/verify.ts`.
- **Fixed `omp hooks bridge` missing case**: Added `bridge` subcommand case in `src/cli/commands/hooks.ts` with proper `readStdinFromContext` helper and injected `readStdin` mock.
- **Fixed reliability tests expecting `omp` in help text**: Updated regex assertions in `tests/reliability/team-shutdown-command.test.ts` and `tests/reliability/team-status-command.test.ts` to match `omg` CLI output.

### Verification
- PASS `npm run typecheck`
- PASS `npm run build`
- PASS `npm run test:coverage` (87.65% stmts, 93.61% branches, 96.15% funcs, 87.65% lines)

## [1.0.1] - 2026-04-17

### Features
- Added OMX-style launch-time auto-update checks/prompts for primary CLI invocation with TTY-only guardrails, non-fatal failure handling, 12h cache throttling, and disable env controls (`OMG_AUTO_UPDATE=0`, compatibility `OMP_AUTO_UPDATE=0`).
- Reused the canonical `omp update` npm installer path for prompted updates and refreshed setup artifacts after successful updates using persisted setup scope precedence (`.omp/setup-scope.json`).

### Verification
- PASS `npm run typecheck`
- PASS `npm run build`
- PASS `npm run test:coverage`

## [1.0.0] - 2026-04-13

### Features
- Rebranded the published package and primary extension metadata to `oh-my-gemini` with `omg` and `oh-my-gemini` bin aliases while preserving `omp` / `oh-my-product` compatibility aliases.
- Added and validated the canonical `extensions/oh-my-gemini/` scaffold for Gemini CLI packaging and extension-path resolution.
- Added preferred `OMG_*` environment/state-root alias handling in setup/context/team state flows while preserving legacy `OMP_*` compatibility.

### Fixes
- Updated setup/help/runtime surfaces to advertise the OMG-first install contract instead of the legacy `oh-my-product` wording.
- Reconciled Phase 1 foundation branding/state changes with the earlier documentation/scaffold lanes so package metadata, extension manifests, and setup/runtime helpers align on the next release target.

### CI / Quality
- Added an explicit `test:coverage` gate and enforced Vitest coverage thresholds of 80% for statements, branches, functions, and lines.
- Updated CI to run coverage as a dedicated combined gate instead of fragmented per-suite coverage runs.
- Enabled publish-semver automation with Release Please for stable releases and GitHub Actions pre-release publishing on every `main` push.

### Verification
- PASS `npm run typecheck`
- PASS `npm run build`
- PASS targeted smoke/integration/reliability suites for extension path, setup idempotency, team state root handling, and tmux backend behavior
- PASS `npx vitest run tests/reliability/gemini-spawn-backend.test.ts`

## [0.5.9] - 2026-03-12

### Fixes
- **Fixed "Skill conflict detected" warnings in Gemini CLI**: Legacy skill folders in `~/.agents/skills/` conflicted with the extension's built-in skills. `omp setup` now auto-detects and removes conflicting legacy skill folders after linking the extension (`src/cli/commands/setup.ts`).

## [0.5.7] - 2026-03-12

### Features
- Exposed all 18 skills as native `/omp:*` slash commands inside Gemini CLI via TOML command files (`commands/omp/*.toml`). Skills like `autopilot`, `plan`, `review`, `verify`, `deep-interview`, and more are now directly accessible without leaving the Gemini prompt.
- Added comprehensive "Slash Commands" section to `README.md` documenting all available `/omp:*` commands organized by category (Workflow, Operational, Utility, Team).

### Fixes
- **Fixed `/omp:*` commands not available in Gemini CLI**: `launch.ts` was passing a filesystem path to `--extensions`, but Gemini CLI expects an extension name. Now reads the `name` field from `gemini-extension.json` and passes `oh-my-product` instead (`src/cli/commands/launch.ts`).
- **Fixed extension showing as "disabled" after `omp setup`**: Changed `setup.ts` to use `stdio: 'inherit'` for the `gemini extensions link` call so the user can interact with Gemini CLI's enable prompt. Added explicit `gemini extensions enable` call after successful link (`src/cli/commands/setup.ts`).
- **Fixed `gemini-extension.json` version drift**: Version was stuck at `0.5.5` while `package.json` was `0.5.6`. Gemini CLI reads version from `gemini-extension.json`, not `package.json`. Added `scripts/sync-extension-version.sh` wired into `prepack` to prevent future drift.
- **Fixed CI failure from sync script stdout pollution**: `sync-extension-version.sh` echo output was corrupting `npm pack --json` parsing in `consumer-contract-smoke.sh`. Redirected output to stderr.
- Added `mcp.toml` to doctor `commandFiles` validation array (pre-existing gap).

### CI/CD
- Removed duplicated `pre_release_blocking` job from `release.yml` — release now triggers via `workflow_run` after CI succeeds instead of re-running all tests.
- Trimmed CI from 8 jobs to 5 essential jobs: Lint & Type Check, Global Install Contract, Test (Node 20), Security Audit, PR Validation.
- Added `main-protection` ruleset: PR required, force push blocked, CI checks enforced.

## [0.4.0] - 2026-03-08

### Features
- Expanded the hook system into a full execution pipeline with ordered hook registration, result merging, keyword-based routing, recovery handling, permission handling, pre-compact checkpoints, project-memory capture, learner integration, and subagent tracking (`src/hooks/index.ts`, `src/hooks/*`).
- Added first-class execution modes for `autopilot`, `ralph`, and `ultrawork`, each with persisted mode state, activation hooks, recovery-aware execution, verification gates, and learned-skill recording (`src/modes/autopilot.ts`, `src/modes/ralph.ts`, `src/modes/ultrawork.ts`, `src/lib/mode-state-io.ts`).
- Expanded the skill system and runtime prompt catalog with improved resolution, alias handling, frontmatter metadata parsing, and CLI dispatch through `omp skill` (`src/skills/resolver.ts`, `src/skills/dispatcher.ts`, `src/cli/commands/skill.ts`).
- Added `omp ask`, `omp cost`, `omp sessions`, and `omp wait` command surfaces to support prompting, token and cost visibility, session tracking, and rate-limit wait flows (`src/cli/index.ts`, `src/state/token-tracking.ts`, `src/state/session-registry.ts`).
- Added stop-callback and multi-platform notification delivery plumbing for Slack, Discord, Telegram, generic webhooks, and saved session summaries (`src/notifications/index.ts`, `src/notifications/summary.ts`, `src/notifications/webhook.ts`, `src/notifications/discord.ts`, `src/notifications/telegram.ts`).
- Added learned-skill persistence and project-memory coupling so successful mode runs can feed future worker context and reusable execution patterns (`src/hooks/learner/index.ts`, `src/hooks/project-memory/index.ts`, `src/hooks/context-writer.ts`).

### Fixes
- Hardened stop and recovery behavior around retry-aware flows through bounded recovery decisions and explicit wait-oriented command support (`src/hooks/recovery/index.ts`, `src/cli/commands/wait.ts`).
- Improved mode exclusivity handling so conflicting exclusive modes are skipped instead of overlapping (`src/hooks/mode-registry/index.ts`, `src/hooks/autopilot/index.ts`, `src/hooks/ralph/index.ts`, `src/hooks/ultrawork/index.ts`).

### Documentation
- Overhauled `README.md` to match the current OMP UX, including tmux-first launch, team orchestration, magic keywords, CLI reference, and updated positioning alongside OMC and OMX.

## [0.3.1] - 2026-03-08

### Features
- Added interactive launch as a first-class workflow: `omp` and `omp launch` now start Gemini CLI with the oh-my-product extension loaded either in the current tmux pane or in a fresh tmux session (`src/cli/commands/launch.ts`, `src/cli/index.ts`).
- Added `--madmax` launch expansion to map to `--yolo --sandbox=none` for opt-in aggressive interactive sessions (`src/cli/commands/launch.ts`).
- Made Docker checks optional for standard usage while keeping Docker- and sandbox-oriented contributor workflows available.

### Changes
- Reduced CI reliance on Docker-only signals by removing Docker tests from optional-signal gating while preserving the main validation path.

## [0.3.0] - 2026-03-08

### Features
- Added lifecycle parity for team orchestration with persisted `team status`, `team resume`, `team shutdown`, and `team cancel` flows built around durable run metadata and runtime handles (`src/cli/commands/team-status.ts`, `src/cli/commands/team-resume.ts`, `src/cli/commands/team-shutdown.ts`, `src/cli/commands/team-cancel.ts`).
- Hardened the orchestrator and state layer with canonical phase persistence, run-request snapshots, monitor snapshots, worker status/heartbeat/done signals, and task/mailbox artifacts under `.omp/state/team/<team>/` (`src/team/team-orchestrator.ts`, `src/state/team-state-store.ts`).
- Completed MVP phase 2 and phase 3 gaps by strengthening the tmux runtime, task auditing, worker monitoring, fix-loop handling, and success-checklist evaluation (`src/team/runtime/tmux-backend.ts`, `src/team/monitor.ts`, `src/team/team-orchestrator.ts`).
- Added richer worker lifecycle observability including deterministic task-lifecycle audit logs, control-plane mediated claim/transition/release operations, and improved health reporting (`src/team/control-plane/*`, `src/team/worker-signals.ts`).
- Added contributor-facing documentation for contribution flow and usage examples to support the more complete OMP operator workflow.

### Fixes
- Hardened state durability and lifecycle parity behavior so resume, shutdown, and cancel operate on canonical persisted run metadata instead of ad hoc runtime assumptions.
- Improved worker and task health handling around pre-claiming, fix-loop execution, and status normalization during long-running team runs.

### Documentation
- Added CONTRIBUTING guidance and richer usage examples to reflect the broader command surface and lifecycle model.

## [0.2.0] - 2026-03-08

### Features
- Added project setup management with scoped installation behavior, managed `.gemini` files, Docker sandbox baseline generation, and subagent catalog bootstrap (`src/installer/index.ts`, `src/installer/scopes.ts`).
- Added extension-first packaging as a canonical public surface via `extensions/oh-my-product/`, including `gemini-extension.json`, `GEMINI.md`, packaged commands, and packaged skills.
- Added team runtime hardening and a backend abstraction with tmux as the default runtime plus experimental subagents support (`src/team/runtime/*`, `src/team/subagents-catalog.ts`, `src/team/subagents-blueprint.ts`).
- Added lifecycle-oriented team control plane primitives for deterministic task claiming, task transitions, release semantics, mailbox delivery state, and canonical identifiers (`src/team/control-plane/*`).
- Added `omp doctor`, `omp verify`, `omp hud`, `omp mcp serve`, `omp tools`, `omp skill`, `omp prd`, and worker bootstrap command surfaces, expanding OMP from a team runner into a broader operator CLI (`src/cli/index.ts`, `src/cli/commands/*`).
- Added secure file and exec tool registries and built-in MCP tool serving for file, git, HTTP, and process operations (`src/tools/*`, `src/mcp/*`).
- Added shared-memory and state durability for cross-session handoff and resilient writes, including atomic JSON/NDJSON helpers, file locks, and session-aware state paths (`src/state/*`, `src/lib/atomic-write.ts`, `src/lib/file-lock.ts`, `src/lib/worktree-paths.ts`).
- Added provider, config, platform, and interop foundations for Gemini-aware model selection, API clients, shell abstraction, OS detection, and OMP↔OMC/OMX bridge formats (`src/providers/*`, `src/config/*`, `src/platform/*`, `src/interop/*`).
- Added HUD rendering and overlay support for inspecting persisted team state without reading raw state files (`src/hud/*`).
- Added notifications, PRD workflow support, plugin loading, feature-readiness verification, and OpenClaw/provider parity foundations (`src/notifications/*`, `src/prd/*`, `src/plugins/*`, `src/features/index.ts`, `src/openclaw/*`).

### Fixes
- Hardened setup-path conflict detection and fail-closed configuration parsing for invalid numeric overrides and cross-provider ordering.
- Hardened OpenClaw command-template resolution so unresolved template variables fail closed and repeatably.
- Improved same-worker task reclaim idempotency and worker heartbeat reliability during orchestrated runs.
- Fixed provider and test typing issues and CLI dependency wiring for MCP serving.

### Changes
- Migrated build, packaging, and verification flows from pnpm to npm and added consumer/global-install contract gates for publish safety.
- Expanded CI and release coverage with verification gates, OpenClaw smoke coverage, packaging checks, and npm publish automation.
- Refreshed the README, docs tree, AGENTS hierarchy, and operator runbooks to reflect the extension-first OMP workflow.

## [0.1.0] - 2026-02-25

### Features
- Initial public release of the TypeScript CLI package published as `oh-my-product` with `omp` and `oh-my-product` entrypoints.
- Established the core tmux-based team orchestration foundation for Gemini CLI workflows, including team run execution, worker bootstrapping, doctor/setup basics, and verify/test script wiring.
- Added the first durable state layer under `.omp/state` with JSON and NDJSON persistence helpers, task and worker state storage, and shared-memory handoff support (`src/state/*`).
- Added early MCP server/client support and reusable tool-serving foundations for Gemini-facing integrations (`src/mcp/*`).
- Added the first notification delivery integrations for Slack, Discord, and Telegram (`src/notifications/*`).
- Added initial feature-readiness and verification command support, plus smoke, integration, and reliability test scaffolding (`src/cli/index.ts`, `tests/*`).

### Changes
- Standardized on npm-based build and test flows and introduced the first packaging and install-contract automation around the CLI.
- Began documenting the repository structure, quickstart, and operator guidance that later became the extension-first OMP docs surface.
