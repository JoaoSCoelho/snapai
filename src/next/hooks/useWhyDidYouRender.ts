import { useEffect, useRef } from "react";

function useWhyDidYouRender(name: string, props: Record<string, any>) {
  const prevProps = useRef<Record<string, any>>(props);

  useEffect(() => {
    const allKeys = Object.keys({ ...prevProps.current, ...props });
    const changes: Record<string, { from: any; to: any }> = {};

    allKeys.forEach((key) => {
      if (!Object.is(prevProps.current[key], props[key])) {
        changes[key] = {
          from: prevProps.current[key],
          to: props[key],
        };
      }
    });

    if (Object.keys(changes).length > 0) {
      console.debug(`[render] ${name}`, changes);
    }

    prevProps.current = props;
  });
}
