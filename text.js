/* HORNFILLER text shim.
   All the words live in copy.js — edit that file, not this one.
   This only wires them onto HC and keeps the world-guidance graph. */

var HC = (typeof window !== 'undefined' ? window : globalThis).HC || ((typeof window !== 'undefined' ? window : globalThis).HC = {});

/* needs: which worlds the "after ..." line under a world title names. Not prose; the map reads it. */
HC.WorldNeeds = { 1: [], 2: [1], 3: [2], 4: [3], 5: [4], 6: [4], 7: [6], 8: [4], 9: [2], 10: [4, 6, 8, 9], 11: [6, 10], 12: [6, 10], 13: [12], 14: [13], 15: [2] };

(function (C) {
  if (!C) {
    // copy.js failed to load: say so loudly rather than show an empty game
    console.error('HORNFILLER: copy.js did not load, so there is no text. Check that copy.js sits next to text.js.');
    return;
  }
  HC.Worlds = C.worlds || [];
  HC.Intro = C.intro || {};
  HC.Text = C.text || {};
  HC.Reasons = C.reasons || {};
  HC.Notes = C.notes || [];
  HC.Glossary = C.glossary || [];
  HC.Epilogue = C.epilogue || {};
})(HC.Copy);
