# Contributing

## Authoring a Lab

1. Add a YAML file under `labs/` describing routes, checks, and a short quiz.
2. Create matching templates in `public/` for the insecure version and `secure/` for the patched version.
3. Update `terminal/commands.yaml` and `terminal/dispatcher.js` if new commands are required.
4. Verify with `npm test` and run the app in both demo and secure modes.

## Issue Template

Use the **New Lab** issue template when proposing a module.
Provide the module name, difficulty, and learning goal.
