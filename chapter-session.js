import {SAVE_KEY} from './chapter-model.js';
export const BRIDGE_REVIEW_KEY='the-fading-kingdom:bridge-review:v1';
export const sessionSaveKey=search=>new URLSearchParams(search).get('review')==='bridge'?BRIDGE_REVIEW_KEY:SAVE_KEY;
