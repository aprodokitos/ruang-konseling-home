<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Counselor dashboard UI uses a browser-safe sample-data/decision module and component-local state; it remains a design prototype without real account or persistence behavior.
- Shell accepts optional role-specific navigation items so counselor menus cannot accidentally link to student pages; unimplemented counselor pages stay disabled.
- Counselor portal theme is scoped in global CSS to follow its PRD without changing the existing student portal design.
