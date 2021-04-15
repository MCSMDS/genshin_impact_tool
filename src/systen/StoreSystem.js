import { writable } from "svelte/store";
import { tweened } from "svelte/motion";
import { cubicOut } from "svelte/easing";

export const video = writable();
export const thenum = writable();
export const images = writable();
export const json = writable();
export const fixindex = writable();
export const myprogress = tweened(0, { duration: 1000, easing: cubicOut });
