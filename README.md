# Smart Path Copy

Copies a command depending on the type of file that is active.

![gif](/docs/vscode-smart-path-copy.gif)

Trigger it with a shortcut. For example:

```json
{
  "key": "shift+cmd+3",
  "command": "smartPathCopy.run",
  "when": "editorTextFocus"
}
```

The rules for what command is copied in what files is a configuration. You may change this configuration via something like this:

```json
"smartPathCopy.rules": [
  {
    "pattern": "_spec\\.rb$",
    "command": "rspec $ruby_filepath:$line_number"
  },
  {
    "pattern": "db/migrate/(\\d{14})_\\w+\\.rb$",
    "command": "rake db:migrate:down VERSION=$1"
  },
  {
    "pattern": "\\btests/.*/(\\w+\\.py)$",
    "command": "pytest -k $1"
  },
  {
    "pattern": "",
    "command": "$rel_filepath"
  }
]
```

The patterns are checked in order, from top to bottom, and the first match is the only one used.

Install it via the [marketplace](https://marketplace.visualstudio.com/items?itemName=santi-h.vscode-smart-path-copy).
