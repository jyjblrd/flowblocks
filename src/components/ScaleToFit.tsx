import React, {
  createRef, ReactElement, useLayoutEffect, useState,
} from 'react';

export default function ScaleToFit(
  { maxHeight, maxWidth, children }:
  { maxHeight: number, maxWidth: number, children: ReactElement },
) {
  const componentRef = createRef<HTMLDivElement>();

  const [scale, setScale] = useState(100);
  const [childWidth, setChildWidth] = useState('inherit');
  const [childHeight, setChildHeight] = useState('inherit');

  useLayoutEffect(() => {
    if (componentRef.current) {
      setChildWidth(`${componentRef.current.offsetWidth}px`);
      setChildHeight(`${componentRef.current.offsetHeight}px`);
      const xScale = (maxWidth / componentRef.current.offsetWidth) * 100;
      const yScale = (maxHeight / componentRef.current.offsetHeight) * 100;
      console.log(componentRef.current);
      setScale(Math.min(xScale, yScale, 100));
    }
  }, []);

  return (
    <div style={{ maxHeight: `calc(${childHeight} * ${scale / 100})` }}>
      <div style={{ transform: `translateY(-50%) scale(${scale}%) translateY(50%)` }}>
        <div ref={componentRef}>
          {children}
        </div>
      </div>
    </div>
  );
}
