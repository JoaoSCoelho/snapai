import { useEffect, useRef } from "react";

function useRenderCount(name: string) {
  const count = useRef(1);
  useEffect(() => {
    console.debug(`${name} render #${count.current++}`);
  });
}
