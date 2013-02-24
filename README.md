# speaking-code

Makes your code tell you what the intermediate results are when executing a script.

## Status

Not very functional at this point. A terminal-only prototype is implemented, but lots of work remains.

Please move along for now even if you need this tool as much as I do ;).

## In the Terminal

When run from the terminal, it will print the syntax highlighted script along with comments outlining what values were
returned/changed when the particular line was executed.

## In the Browser

When run with the browser flag, it will serve a page that shows the script that was run along with tree view
representations of objects returned/changed by each line. 

These objects can then be inspected via an interactive tree control (similar to chrome dev tools).

