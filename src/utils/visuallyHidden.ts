import type { CSSObject } from "@emotion/react";

const visuallyHidden: CSSObject = {
    border: 0,
    clip: "rect(0 0 0 0)",
    height: 1,
    margin: -1,
    overflow: "hidden",
    padding: 0,
    position: "absolute",
    whiteSpace: "nowrap",
    width: 1,
};

export default visuallyHidden;
