// Border shorthand maps
export const borderAliasMap = {
    border: ["border"],
    borderTop: ["borderTop"],
    borderRight: ["borderRight"],
    borderBottom: ["borderBottom"],
    borderLeft: ["borderLeft"],
    borderX: ["borderLeft", "borderRight"],
    borderY: ["borderTop", "borderBottom"],
} as const;

export const borderColorAliasMap = {
    borderColor: ["borderColor"],
    borderTopColor: ["borderTopColor"],
    borderRightColor: ["borderRightColor"],
    borderBottomColor: ["borderBottomColor"],
    borderLeftColor: ["borderLeftColor"],
    borderXColor: ["borderLeftColor", "borderRightColor"],
    borderYColor: ["borderTopColor", "borderBottomColor"],
} as const;

export const borderWidthAliasMap = {
    borderWidth: ["borderWidth"],
    borderTopWidth: ["borderTopWidth"],
    borderRightWidth: ["borderRightWidth"],
    borderBottomWidth: ["borderBottomWidth"],
    borderLeftWidth: ["borderLeftWidth"],
    borderXWidth: ["borderLeftWidth", "borderRightWidth"],
    borderYWidth: ["borderTopWidth", "borderBottomWidth"],
} as const;

export const borderStyleAliasMap = {
    borderStyle: ["borderStyle"],
    borderTopStyle: ["borderTopStyle"],
    borderRightStyle: ["borderRightStyle"],
    borderBottomStyle: ["borderBottomStyle"],
    borderLeftStyle: ["borderLeftStyle"],
    borderXStyle: ["borderLeftStyle", "borderRightStyle"],
    borderYStyle: ["borderTopStyle", "borderBottomStyle"],
} as const;

export const borderRadiusAliasMap = {
    borderRadius: ["borderRadius"],
    borderTopRadius: ["borderTopRadius"],
    borderRightRadius: ["borderRightRadius"],
    borderBottomRadius: ["borderBottomRadius"],
    borderLeftRadius: ["borderLeftRadius"],
    borderXRadius: ["borderLeftRadius", "borderRightRadius"],
    borderYRadius: ["borderTopRadius", "borderBottomRadius"],
} as const;

// Display shorthands
export const displayAliasMap = {
    display: ["display"],

    overflow: ["overflow"],
    overflowX: ["overflowX"],
    overflowY: ["overflowY"],

    whiteSpace: ["whiteSpace"],

    visibility: ["visibility"],
} as const;

// Flex shorthands
export const flexAliasMap = {
    flexDirection: ["flexDirection"],
    direction: ["flexDirection"],

    flexWrap: ["flexWrap"],
    wrap: ["flexWrap"],

    justifyContent: ["justifyContent"],
    alignItems: ["alignItems"],
    alignContent: ["alignContent"],

    order: ["order"],
    flex: ["flex"],

    flexGrow: ["flexGrow"],
    grow: ["flexGrow"],

    flexShrink: ["flexShrink"],
    shrink: ["flexShrink"],

    alignSelf: ["alignSelf"],
} as const;

// Palette shorthands
// NOTE - This causes issues with colors on components like CircularProgress for example.
/**
export const paletteAliasMap = {
    color: ["color"],

    backgroundColor: ["backgroundColor"],
    bgColor: ["backgroundColor"],
} as const; 
*/

// Position shorthands
export const positionAliasMap = {
    position: ["position"],
    top: ["top"],
    right: ["right"],
    bottom: ["bottom"],
    left: ["left"],
    zIndex: ["zIndex"],
} as const;

// Box shadow shorthands
export const boxShadowAliasMap = {
    boxShadow: ["boxShadow"],
};

// Sizing shorthands
export const sizingAliasMap = {
    width: ["width"],
    minWidth: ["minWidth"],
    maxWidth: ["maxWidth"],
    height: ["height"],
    minHeight: ["minHeight"],
    maxHeight: ["maxHeight"],
    boxSizing: ["boxSizing"],
} as const;

export const spacingAliasMap = {
    gap: ["gap"],
    spacing: ["gap"],

    rowGap: ["rowGap"],
    columnGap: ["columnGap"],

    m: ["margin"],
    mt: ["marginTop"],
    mr: ["marginRight"],
    mb: ["marginBottom"],
    ml: ["marginLeft"],
    mx: ["marginLeft", "marginRight"],
    my: ["marginTop", "marginBottom"],

    p: ["padding"],
    pt: ["paddingTop"],
    pr: ["paddingRight"],
    pb: ["paddingBottom"],
    pl: ["paddingLeft"],
    px: ["paddingLeft", "paddingRight"],
    py: ["paddingTop", "paddingBottom"],

    margin: ["margin"],
    marginTop: ["marginTop"],
    marginRight: ["marginRight"],
    marginBottom: ["marginBottom"],
    marginLeft: ["marginLeft"],
    marginX: ["marginLeft", "marginRight"],
    marginY: ["marginTop", "marginBottom"],

    padding: ["padding"],
    paddingTop: ["paddingTop"],
    paddingRight: ["paddingRight"],
    paddingBottom: ["paddingBottom"],
    paddingLeft: ["paddingLeft"],
    paddingX: ["paddingLeft", "paddingRight"],
    paddingY: ["paddingTop", "paddingBottom"],
} as const;

// Typography & display maps
export const typographyAliasMap = {
    fontFamily: ["fontFamily"],
    fontSize: ["fontSize"],
    fontStyle: ["fontStyle"],
    fontWeight: ["fontWeight"],
    letterSpacing: ["letterSpacing"],
    lineHeight: ["lineHeight"],
    textAlign: ["textAlign"],
    textTransform: ["textTransform"],

    textDecoration: ["textDecoration"],
    textDecorationLine: ["textDecorationLine"],
    textDecorationColor: ["textDecorationColor"],
    textDecorationStyle: ["textDecorationStyle"],

    textOverflow: ["textOverflow"],
} as const;

export const aliasMaps = {
    ...flexAliasMap,
    ...borderAliasMap,
    ...boxShadowAliasMap,
    ...borderColorAliasMap,
    ...borderWidthAliasMap,
    ...borderStyleAliasMap,
    ...borderRadiusAliasMap,
    ...displayAliasMap,
    //...paletteAliasMap,
    ...positionAliasMap,
    ...spacingAliasMap,
    ...sizingAliasMap,
    ...typographyAliasMap,
} as const;

export type AliasMap = typeof flexAliasMap &
    typeof borderAliasMap &
    typeof borderColorAliasMap &
    typeof borderWidthAliasMap &
    typeof borderStyleAliasMap &
    typeof borderRadiusAliasMap &
    typeof displayAliasMap &
    // typeof paletteAliasMap &
    typeof positionAliasMap &
    typeof spacingAliasMap &
    typeof sizingAliasMap &
    typeof typographyAliasMap &
    typeof boxShadowAliasMap;

export type AliasKey = keyof AliasMap;
