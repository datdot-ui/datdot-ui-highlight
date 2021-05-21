const bel = require('bel')
const csjs = require('csjs-inject')
const snippet = require('..')
const hljs = require('highlight.js')
const theme = require('./theme.json')
const main_highlight = require('./main_highlight.json')

function demoComponent() {
    const list = Object.keys(theme)
    const selector = bel`<select class=${css.select}></select>`
    list.forEach( name => {
        const option = bel`<option value=${name}>${name}</option>`
        selector.append(option)
    })
    selector.value = 'tomorrow-night-blue'
    selector.onchange = handleColorChange

    let style = theme['shades-of-purple']
    const html_code =  hljs.highlightAuto('<span>Hello World!</span>').value
    const js_code = hljs.highlightAuto(
`const name = 'John Doe'" +
function greeting(name) {" +
    return console.log(\`Hello \${name}\`)
}`).value
        
    const content = bel`
    <div class=${css.content}>
        <label>Color:</label> ${selector}
        <div>
            <h2>HTML</h2>
            ${snippet({content: html_code, type: 'xml'})}
            
            <h2>Javascript</h2>
            ${snippet({content: js_code, type: 'javascript'})}
        </div>
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
}

function handleColorChange(e) {
    return injectStyle(theme[e.target.value])
}

function injectStyle(style) {
    const head = document.head || document.getElementsByTagName('head')[0]
    head.insertAdjacentHTML("beforeend", `<style>${style}</style>`)
}

const css = csjs`
:root {
    --font-size-primary: 1.4rem;
    --font-light: 100;
    --font-normal: 300;
    --font-bold: 600;
    --highlight-font-family: ${main_highlight.fontFamily ? main_highlight.fontFamily : 'Arial, Helvetica, sans-serif'};
    --highlight-font-size: ${main_highlight.fontSize ? main_highlight.fontSize : 'var(--font-size-primary)'};
    --highlight-padding: ${main_highlight.padding ? main_highlight.padding : '1.2rem 1.6rem'};
    --highlight-radius: ${main_highlight.borderRadius ? main_highlight.borderRadius : '8px'};
    --highlight-border-width: ${main_highlight.borderWidth ? main_highlight.borderWidth : '2px'};
    --highlight-border-color: ${main_highlight.borderColor ? main_highlight.borderColor : 'hsl(0, 0%, 0%)'};
    --highlight-style: ${main_highlight.borderStyle ? main_highlight.borderStyle : 'solid'};
    --highlight-line-height: ${main_highlight.lineHeight ? main_highlight.lineHeight : '25px'};
    --highlight-font-weight: ${main_highlight.fontWeight ? main_highlight.fontWeight : 'var(--font-normal)'};
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
`

document.body.append( demoComponent() )