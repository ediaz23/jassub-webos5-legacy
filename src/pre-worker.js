/* eslint-disable no-unused-vars */
/* global out err updateMemoryViews wasmMemory */

function assert(c, m) {
    if (!c) {
        throw m
    }
}

const read_ = (url, ab) => {
    const xhr = new XMLHttpRequest()
    xhr.open('GET', url, false)
    xhr.responseType = ab ? 'arraybuffer' : 'text'
    xhr.send(null)
    return xhr.response
}
const readAsync = (url, load, err) => {
    const xhr = new XMLHttpRequest()
    xhr.open('GET', url, true)
    xhr.responseType = 'arraybuffer'
    xhr.onload = () => {
        if ((xhr.status === 200 || xhr.status === 0) && xhr.response) {
            return load(xhr.response)
        }
    }
    xhr.onerror = err
    xhr.send(null)
}

let asm = null

out = text => {
    if (text === 'JASSUB: No usable fontconfig configuration file found, using fallback.') {
        console.debug(text)
    } else {
        console.log(text)
    }
}

err = text => {
    if (text === 'Fontconfig error: Cannot load default config file: No such file: (null)') {
        console.debug(text)
    } else {
        console.error(text)
    }
}

// patch EMS function to include Uint8Clamped, but call old function too
updateMemoryViews = (_super => {
    return () => {
        _super()
        self.wasmMemory = wasmMemory
        self.HEAPU8C = new Uint8ClampedArray(wasmMemory.buffer)
        self.HEAPU8 = new Uint8Array(wasmMemory.buffer)
    }
})(updateMemoryViews)

Module = Module || {};
const _preWorkerParams = new URL(self.location).searchParams;
const preWorkerWamsUrl = _preWorkerParams.get('wasm')
Module['wasm'] = new Uint8Array(read_(preWorkerWamsUrl, true))

