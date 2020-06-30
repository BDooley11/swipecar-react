import React, { useState } from "react";
import { useSprings } from "react-spring/hooks";
import { useGesture } from "react-with-gesture";

import Card from "./Card";
import data from "../data.js";

const to = i => ({
  x: 0,
  scale: 1,
  delay: i * 100
});
const from = i => ({ scale: 1.5, y: -1000 });

function Deck() {
  const [gone] = useState(() => new Set());

  const [props, set] = useSprings(data.length, i => ({
    ...to(i),
    from: from(i)
  }));

  // this section lets me use left and right arrow keys 
  React.useEffect(() => {
    const swipe = e => {
      const dir = e.key === 'ArrowLeft' ? -1 : e.key === 'ArrowRight' ? 1 : null
      if (!dir) return
      const index = (Array.from(gone).pop() || data.length) - 1
      gone.add(index)
      set(i => {
        if (index !== i) return // We're only interested in changing spring-data for the current spring
        const x = (200 + window.innerWidth) * dir
        const scale = 1.1 // Active cards lift up a bit
        return { x, scale, delay: undefined, config: { friction: 50, tension: 200 } }
      })
      if (gone.size === data.length) setTimeout(() => gone.clear() || set(i => to(i)), 600)
    }
    window.addEventListener('keydown', swipe)

    return () => window.removeEventListener('keydown', swipe)
  })

  const bind = useGesture(
    ({
      args: [index],
      down,
      delta: [xDelta],
      distance,
      direction: [xDir],
      velocity
    }) => {
      const trigger = velocity > 0.1 ;
      
      // problem here. Sometimes when going left dir is still 1 when should be -1.
      const dir = xDir < 0 ? -1 : 1;
      console.log(dir)

      if (!down && trigger) gone.add(index);

      set(i => {
        if (index !== i) return;
        const isGone = gone.has(index);
        
        // When a card is gone it flys out left or right, otherwise goes back to zero
        const x = isGone ? (300 + window.innerWidth) * dir : down ? xDelta : 0;

        const scale = down ? 1.1 : 1;
        return {
          x,
          scale,
          delay: undefined,
          config: { friction: 50, tension: down ? 800 : isGone ? 200 : 500 }
        };
      });

      // this is the code the repleneshes the stack
      if (!down && gone.size === data.length)
        setTimeout(() => gone.clear() || set(i => to(i)), 600);
    }
  );

  return props.map(({ x}, i) => (
    <Card
      i={i}
      x={x}
      data={data}
      bind={bind}
    />
  ));
}

export default Deck;



