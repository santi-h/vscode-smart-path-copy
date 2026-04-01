# vscode-smart-path-copy

Copies a command depending on the type of file that is active.

![gif](/docs/vscode-smart-path-copy.gif)

Trigger it with a shortcut. For example:

```json
{
  "key": "shift+cmd+3",
  "command": "vscode-smart-path-copy.run",
  "when": "editorTextFocus"
}
```

[Marketplace link](https://marketplace.visualstudio.com/items?itemName=santi-h.vscode-smart-path-copy)

## Packaging

Run the following to create the .vsix file:

```shell
nvm use `cat .node-version` && \
npm install && \
npm run compile && \
vsce package
```

This command assumes that you installed `vsce`, which can be done with `npm install -g @vscode/vsce`

## Installing

Once packaged, go to "Extensions" in VSCode, then "Install from VSIX..." and load the packaged file.
