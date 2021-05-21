const bel = require('bel')
const csjs = require('csjs-inject')

module.exports = snippet

function snippet({content, type}) {
    const div = document.createElement('div')
    div.innerHTML = content

    const snippet = bel`<code class="language-${type} hljs ${css.snippet}"></code>`
    const element = bel`<div class=${css.code}><pre>${snippet}</pre></div>`
    snippet.append(div)

    return element
}

const css = csjs`
.code {}
.snippet {
    font-family: var(--highlight-font-family);
    font-size: var(--highlight-font-size);
    font-weight: var(--highlight-font-weight) !important;
    padding: var(--highlight-padding) !important;
    border-radius: var(--highlight-radius);
    line-height: var(--highlight-line-height);
    border-width: var(--highlight-border-width);
    border-color: var(--highlight-border-color);
    border-style: solid;
}
`

