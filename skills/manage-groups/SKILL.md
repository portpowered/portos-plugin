---
name: manage-groups
description: Use this guide when the customer wants to create a group, change its members or control devices by group.
metadata:
  title: Manage groups and membership
  guide-id: managing-groups
  content-authorship: HUMAN_MIXED_WITH_AI
  author: Port OS Team
  last modified: 2026, october, 25
---

# Manage groups and membership

Read with `group_query` (`group:read`); change with `group_manage` (`group:manage`
plus resource permission). Keep full IDs and account; clarify ambiguous names.

1. Inspect nested membership, preserve relationships and deduplicate endpoints.
2. Use declared rename, merge and membership operations, current etags and documented
   idempotency. After conflicts, reread and resolve; never overwrite.
3. Before any `group_manage` change, read
   [Provider synchronization and outcomes](https://portoperatingsystem.com/docs/for-ai/guides/provider-group-sync.md)
   including its move example.

Native media groups and spatial cleaning targets differ; see
[vacuum guidance](https://portoperatingsystem.com/docs/for-ai/guides/vacuums.md).
