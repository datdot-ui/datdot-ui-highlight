const bel = require('bel')
const csjs = require('csjs-inject')
const path = require('path')
const filename = path.basename(__filename)
const domlog = require('ui-domlog')
const snippet = require('..')
const title = require('datdot-ui-title')
const theme = require('./theme.json')
const main_highlight = require('./main_highlight.json')

function demoComponent() {
    let recipients = []
    const list = Object.keys(theme)
    const selector = bel`<select class=${css.select}></select>`
    list.forEach( name => {
        const option = bel`<option value=${name}>${name}</option>`
        selector.append(option)
    })
    selector.value = 'tomorrow-night-blue'
    selector.onchange = handleColorChange

    let style = theme['shades-of-purple']
    const htmlCode =  '<span>Hello World!</span>'
    const jsCode = `const name = "John Doe"
let age = "33"
function greeting (name) {
    return console.log(\`Hello \${name}\`)
}
function person (name, age, job) {
    return {id, name, age, job}
}`
    const cssCode = `body {
    font-family: Arial, sans-serif;
    height: 100%;
}`
        
    const content = bel`
    <div class=${css.content}>
        <header><label>Color:</label> ${selector}</header>
        <section>
            ${title({page: 'demo', name: 'html', content: 'XML'})}
            ${snippet( {content: htmlCode, lang: 'xml'}, protocol('html') )}
        </section>
        <section>
            ${title({page: 'demo', name: 'javascript', content: 'Javascript', theme: {color: 'hsl(212, 100%, 50%)'}})}
            ${snippet( {content: jsCode, lang: 'javascript', theme: main_highlight }, protocol('javascript') )}
        </section>
        <section>
            ${title( {page: 'demo', name: 'css', content: 'CSS', theme: {color: 'hsl(323,100%, 50%)'} })}
            ${snippet( {content: cssCode, lang: 'css', theme: main_highlight }, protocol('css') )}
        </section>
    </div>
    `
    injectStyle(style)
        
    // show logs
    let terminal = bel`<div class=${css.terminal}></div>`
    // container
    const container = wrap(content, terminal)
    return container

    function wrap (content) {
        const container = bel`
        <div class=${css.wrap}>
            <section class=${css.container}>
                ${content}
            </section>
            ${terminal}
        </div>
        `
        return container
    }

    /*************************
    * ------ Actions -------
    *************************/
    function handleColorChange(e) {
        return injectStyle(theme[e.target.value])
    }

    function injectStyle(style) {
        const head = document.head || document.getElementsByTagName('head')[0]
        head.insertAdjacentHTML("beforeend", `<style>${style}</style>`)
    }

    /*************************
    * ------ Receivers -------
    *************************/
    function receive (message) {
        const { page, from, flow, type, body } = message
        showLog(message)
        if (type === 'init') return showLog({page, from, flow, type: 'ready', body, filename, line: 92})
    }

    /*************************
    * ------ Protocols -------
    *************************/
    // original protocol for all use
    function protocol (name) {
        return send => {
            recipients[name] = send
            return receive
        }
    }

    /*********************************
    * ------ Promise() Element -------
    *********************************/
    // keep the scroll on bottom when the log displayed on the terminal
    function showLog (message) { 
        sendMessage(message)
        .then( log => {
            terminal.append(log)
            terminal.scrollTop = terminal.scrollHeight
        }
    )}

    async function sendMessage (message) {
        return await new Promise( (resolve, reject) => {
            if (message === undefined) reject('no message import')
            const log = domlog(message)
            return resolve(log)
        }).catch( err => { throw new Error(err) } )
    }
}

const css = csjs`
:root {
    --font-primary: 1.4rem;
    --font-light: 100;
    --font-normal: 300;
    --font-bold: 600;
    --highlight-font-family: Segoe UI Mono, Monospace, Cascadia Mono, Courier New, ui-monospace, Liberation Mono, Menlo, Monaco, Consolas;
    --highlight-font-size: var(--font-size-primary);
    --highlight-padding: 1.2rem 1.6rem;
    --highlight-radius: 12px;
    --highlight-border-width: 2px;
    --highlight-border-color: hsl(0, 0%, 0%);
    --highlight-border-style: solid;
    --highlight-line-height: 1.8;
    --highlight-font-weight: var(--font-normal);
}
html {
    box-sizing: border-box;
    height: 100%;
    font-size: 62.5%;
}
*, *:before, *:after {
    box-sizing: inherit;
}
body {
    margin: 0;
    padding: 0;
    font-family: Arial, Helvetica, sans-serif;
    font-size: var(--font-primary);
    background-color: rgba(0, 0, 0, .1);
    height: 100%;
}
.wrap {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 75vh 25vh;
}
.container {
    padding: 25px;
    overflow-y: auto;
}
.content > div {
    margin-bottom: 20px;
}
.terminal {
    background-color: #212121;
    color: #f2f2f2;
    font-size: 13px;
    overflow-y: auto;
}
.select {
    font-size: 1.6rem;
    padding: 4px 8px;
}
header {
    padding-bottom: 20px;
}
`

document.body.append( demoComponent() )