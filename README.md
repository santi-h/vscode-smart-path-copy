# vscode-copy-github-link README

Copies a command depending on the type of file that is active.

## Packaging

Run the following to create the .vsix file:

```shell
vsce package
```

This command assumes that you installed `vsce`, which can be done with `npm install -g @vscode/vsce`

## Installing

Once packaged, go to "Extensions" in VSCode, then "Install from VSIX..." and load the packaged file.
