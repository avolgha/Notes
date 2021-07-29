# Notes

Notes is a Note Manager written with [TypeScript](https://www.typescriptlang.org/) and [Electron](https://www.electronjs.org/).

The goal is to manage your Notes. All notes are saved in the ``notes/`` directory as Markdown-Files

<details>
<summary>Dependencies</summary>

* [electron](https://github.com/electron/electron) (`^13.1.7`)
* [typescript](https://github.com/Microsoft/TypeScript) (`^4.3.5`)
* [express](https://github.com/expressjs/express) (`^4.17.1`) & [body-parser](https://github.com/expressjs/body-parser) (`^1.19.0`)
* [markdown-it](https://github.com/markdown-it/markdown-it) (`^12.1.0`)
</details>

## » The problem with the Markdown

Currently, there is a parsing problem with the Markdown. So it's highly recommended to not writing any HTML into the Markdown. I am trying to make the parser also render the HTML, but currently it's an issue

## » ToDo

* [X] display notes on the window
* [X] backend service
* [X] Actions Menu
  * [X] Home-Button
  * [X] Developer actions menu
    * [X] open dev tools
    * [X] reload
* [X] write Notes from the window
* [ ] render HTML with Markdown
* [ ] Beautify .ejs files in `views/`

## » Support

If there are any questions, please ask me on discord (`Marius#0686`) 
