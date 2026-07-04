export interface CanvasRect {
    width: number;
    height: number;
}

export interface PixelRect {
    left: number;
    top: number;
    width: number;
    height: number;
}

/** The fixed canvas width. Block positions are stored as % of this value. */
export const PROFILE_CANVAS_REF_WIDTH = 1600;

/** All block dimensions are expressed as % of canvas width so layout scales uniformly. */
export const canvasUnit = (canvas: CanvasRect) => canvas.width;

export const percentToPixels = (
    block: { x: number; y: number; width: number; height: number },
    canvas: CanvasRect,
): PixelRect => {
    const unit = canvasUnit(canvas);
    return {
        left: (block.x / 100) * unit,
        top: (block.y / 100) * unit,
        width: (block.width / 100) * unit,
        height: (block.height / 100) * unit,
    };
};

export const sortBlocksByZIndex = <T extends { zIndex: number }>(
    blocks: T[],
): T[] => [...blocks].sort((a, b) => a.zIndex - b.zIndex);
