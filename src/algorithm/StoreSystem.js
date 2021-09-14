import { writable } from 'svelte/store'
import { tweened } from 'svelte/motion'
import { cubicOut } from 'svelte/easing'

export const artifact = {
  video: writable(),
  images: writable(),
  setting: {
    x: writable(),
    y: writable(),
    width: writable(),
    height: writable()
  }
}

export const json = writable()
export const fixindex = writable()
export const myprogress = tweened(0, { duration: 1000, easing: cubicOut })