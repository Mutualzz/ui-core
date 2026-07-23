export type UiDensityScale = "compact" | "default" | "spacious";

export const UI_DENSITY_SPACING_SCALE: Record<UiDensityScale, number> = {
    compact: 0.88,
    default: 1,
    spacious: 1.12,
};

export const UI_DENSITY_RADIUS_SCALE: Record<UiDensityScale, number> = {
    compact: 0.92,
    default: 1,
    spacious: 1.08,
};

export const UI_DENSITY_SPACING_VAR = "--ui-density-spacing";
export const UI_DENSITY_RADIUS_VAR = "--ui-density-radius";

const SPACING_UNIT_REM = 0.25;

let spacingScale = UI_DENSITY_SPACING_SCALE.default;
let radiusScale = UI_DENSITY_RADIUS_SCALE.default;
const listeners = new Set<() => void>();

export function getUiDensitySpacingScale() {
    return spacingScale;
}

export function getUiDensityRadiusScale() {
    return radiusScale;
}

export function applyUiDensity(density: UiDensityScale) {
    spacingScale = UI_DENSITY_SPACING_SCALE[density];
    radiusScale = UI_DENSITY_RADIUS_SCALE[density];

    if (typeof document !== "undefined") {
        document.documentElement.dataset.uiDensity = density;
        document.documentElement.style.setProperty(
            UI_DENSITY_SPACING_VAR,
            String(spacingScale),
        );
        document.documentElement.style.setProperty(
            UI_DENSITY_RADIUS_VAR,
            String(radiusScale),
        );
    }

    for (const listener of listeners) {
        listener();
    }
}

export function subscribeUiDensity(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
}

export function themeSpacing(factor: number): string {
    if (typeof document !== "undefined") {
        return `calc(${SPACING_UNIT_REM * factor}rem * var(${UI_DENSITY_SPACING_VAR}, 1))`;
    }

    return `${SPACING_UNIT_REM * factor * spacingScale}rem`;
}
