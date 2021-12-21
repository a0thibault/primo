import { get, writable, derived } from 'svelte/store';
import { Page, DEFAULTS } from '../../const'
import {isEqual} from 'lodash-es'

export const id = writable('')
export const name = writable('')
export const pages = writable([ Page() ])
export const fields = writable([])
export const symbols = writable([])

export const html = writable(DEFAULTS.html)
export const css = writable(DEFAULTS.css)

export const content = writable(DEFAULTS.content)

// conveniently get the entire site
export const site = derived(
  [ id, name, pages, html, css, fields, symbols, content ], 
  ([ id, name, pages, html, css, fields, symbols, content]) => {
  return {
    id, 
    name,
    pages,
    html,
    css,
    fields, 
    symbols,
    content
  }
})

export default derived(
  [ id, name, pages, html, css, fields, symbols, content ], 
  ([ id, name, pages, html, css, fields, symbols, content]) => {
  return {
    id, 
    name,
    pages,
    html,
    css,
    fields, 
    symbols,
    content
  }
})

export const timeline = writable([ get(site) ])
export const undone = writable([])

site.subscribe(s => {
  const items = get(timeline)
  const latestUpdate = items[items.length-1]
  if (!isEqual(s, latestUpdate)) {
    timeline.update(t => ([ ...t, s ]))
  } 
})

let length = 0

timeline.subscribe(t => {
  if (t.length > length) { // timeline has grown (new change, not undo)
    undone.set([])
  } 
  length = t.length
})
