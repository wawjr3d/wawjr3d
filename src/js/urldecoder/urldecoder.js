'use strict';

const qs = require('qs');

const decodeFormEl = document.querySelectorAll('.decode-form')[0];
const encodedInputEl = document.querySelectorAll('.encoded')[0];
const outputEl = document.querySelectorAll('.output')[0];
const decodedEl = document.querySelectorAll('.decoded')[0];
const decodedParamsEl = document.querySelectorAll('.decoded-params')[0];
let hadSelected = false;

decodeFormEl.addEventListener('submit', function(e) {
  e.preventDefault();

  decode();
});

encodedInputEl.addEventListener('click', function() {
  const start = encodedInputEl.selectionStart;
  const end = encodedInputEl.selectionEnd;
  const length = encodedInputEl.textLength;

  if (start === 0 && end === length) {
    return;
  }

  if (end > start) {
    // assume making a selection intentionally
    hadSelected = true;
    return;
  }

  if (hadSelected) {
    hadSelected = false;
    return;
  }

  encodedInputEl.focus();
  encodedInputEl.select();
});

encodedInputEl.addEventListener('blur', function() {
  hadSelected = false;
});

encodedInputEl.addEventListener('keydown', function(e) {
  if (e.keyCode == 13 && e.metaKey) {
    decode();
  }
});

function decode() {
  const encodedInput = encodedInputEl.value || '';
  const decoded = decodeURIComponent(encodedInput);
  const urlParts = encodedInput.split('?');
  const uri = urlParts[0];
  let querystring = urlParts[1];

  if (!querystring && !/^https?:\/\//.test(uri)) {
    querystring = uri;
  }

  outputEl.classList.add('with-results');
  decodedEl.innerHTML = decoded;
  decodedParamsEl.innerHTML = '';

  if (querystring) {
    const decodedParams = qs.parse(querystring);
    const paramsFragment = document.createDocumentFragment();
    const sortedKeys = Object.keys(decodedParams).sort();

    sortedKeys.forEach(function(key) {
      const value = decodedParams[key];
      const termLineEl = buildTermLineEl();

      termLineEl.appendChild(termEl(key));
      termLineEl.appendChild(definitionEl(value));

      paramsFragment.appendChild(termLineEl);
    });

    decodedParamsEl.appendChild(paramsFragment);
  }
}

function buildTermLineEl() {
  const el = document.createElement('div');
  el.className = 'decoded-line';

  return el;
}

function termEl(key) {
  const el = document.createElement('span');
  el.className = 'decoded-key';
  el.innerHTML = key;

  return el;
}

function definitionEl(value) {
  const el = document.createElement('span');
  el.className = 'decoded-value';
  el.innerHTML = typeof value !== 'string' ? JSON.stringify(value) : value;

  return el;
}
