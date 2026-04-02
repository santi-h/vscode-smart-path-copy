# Development notes

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
