import React from 'react';
import { cxx } from '../cxx';

export default function Toolbar() {
  return (
    <div className="Toolbar">
      <button type="button" className="toolbar">Save</button>
      <button type="button" className="toolbar">Load</button>
      <button type="button" className="toolbar" onClick={() => alert(cxx.greet('world'))}>Compile</button>
    </div>
  );
}
