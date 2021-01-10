import React, { useEffect, useState } from 'react';

export default function RotaryControl({ value, onChange }) {
  const degreeRange = 260;
  const startAngle = (360 - degreeRange) / 2;
  const endAngle = startAngle + degreeRange;
  const min = 0;
  const max = 255;
  const numTicks = 255;
  const size = 50;
  const margin = size * 0.15;
  const tickMargin = 10;
  const [currentDeg, setCurrentDeg] = useState();

  useEffect(() => {
    setCurrentDeg(
      Math.floor(convertRange(min, max, startAngle, endAngle, value)),
    );
  }, []);

  const convertRange = (oldMin, oldMax, newMin, newMax, oldValue) => {
    return (
      ((oldValue - oldMin) * (newMax - newMin)) / (oldMax - oldMin) + newMin
    );
  };

  const startDrag = (e) => {
    e.preventDefault();
    const knob = e.target.getBoundingClientRect();
    const pts = {
      x: knob.left + knob.width / 2,
      y: knob.top + knob.height / 2,
    };
    const moveHandler = (e) => {
      let newDeg = getDeg(e.clientX, e.clientY, pts);
      if (newDeg === startAngle) newDeg--;
      let newValue = Math.floor(
        convertRange(startAngle, endAngle, min, max, newDeg),
      );
      setCurrentDeg(newDeg);
      //   this.setState(newDeg);
      onChange(newValue);
    };
    document.addEventListener('mousemove', moveHandler);
    document.addEventListener('mouseup', (e) => {
      document.removeEventListener('mousemove', moveHandler);
    });
  };

  const getDeg = (cX, cY, pts) => {
    const x = cX - pts.x;
    const y = cY - pts.y;
    let deg = (Math.atan(y / x) * 180) / Math.PI;
    if ((x < 0 && y >= 0) || (x < 0 && y < 0)) {
      deg += 90;
    } else {
      deg += 270;
    }
    let finalDeg = Math.min(Math.max(startAngle, deg), endAngle);
    return finalDeg;
  };

  const renderTicks = () => {
    let ticks = [];
    const incr = degreeRange / numTicks;
    const tickSize = tickMargin + size / 2; // TODO programatic size style
    for (let deg = startAngle; deg <= endAngle; deg += incr) {
      const tick = {
        deg: deg,
        tickStyle: {
          height: tickSize + 10,
          left: tickSize - 1,
          top: tickSize + 2,
          transform: 'rotate(' + deg + 'deg)',
          transformOrigin: 'top',
        },
      };
      ticks.push(tick);
    }
    return ticks;
  };

  const dcpy = (o) => {
    return JSON.parse(JSON.stringify(o));
  };

  //   Styles
  let kStyle = {
    width: size,
    height: size,
  };
  let iStyle = dcpy(kStyle);
  let oStyle = dcpy(kStyle);
  oStyle.margin = margin;

  iStyle.transform = 'rotate(' + currentDeg + 'deg)';

  return (
    <div className="knob" style={kStyle}>
      <div className="ticks">
        {numTicks
          ? renderTicks().map((tick, i) => (
              <div
                key={i}
                className={'tick' + (tick.deg <= currentDeg ? ' active' : '')}
                style={tick.tickStyle}
              />
            ))
          : null}
      </div>
      <div className="knob outer" style={oStyle} onMouseDown={startDrag}>
        <div className="knob inner" style={iStyle}>
          <div className="grip" />
        </div>
      </div>
    </div>
  );
}
