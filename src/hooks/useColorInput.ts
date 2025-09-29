import type {
    ColorLike,
    ColorType,
    Hex,
    HSL,
    HSLA,
    RGB,
    RGBA,
} from "@ui-types";
import { isValidColorInput, isValidGradient, randomColor } from "@utils";
import Color, { type ColorInstance } from "color";
import { useCallback, useMemo, useState } from "react";

type Mode = "strict" | "loose";

export interface UseColorInputOptions {
    alpha?: number;
    type?: ColorType;
    allowGradient?: boolean;
    mode?: Mode;
}

export interface UseColorInputResult<T> {
    inputValue: T;
    color: T;
    isInvalid: boolean;
    error: string | null;
    handleChange: (input: ColorLike) => void;
    validate: () => void;
    setColorDirectly: (value: ColorLike) => void;
    normalizeColor: (value: ColorLike) => string | null;
}

const clean = (s: string) =>
    s
        .trim()
        .replace(/^['"]|['"]$/g, "")
        .replace(/;+$/, "")
        .replace(/\s+/g, " ");

const clamp = (n: number, lo: number, hi: number) =>
    Math.min(hi, Math.max(lo, n));

const pctToUnit = (p: number) => clamp(p, 0, 100) / 100;

const toTypeString = (
    color: ColorInstance,
    type: ColorType,
    alphaPct: number,
): string => {
    const a = pctToUnit(alphaPct);
    const withAlpha = color.alpha(a);
    switch (type) {
        case "hex": {
            return (a === 1 ? withAlpha.hex() : withAlpha.hexa()) as Hex;
        }
        case "rgb": {
            return withAlpha.rgb().string() as RGB | RGBA;
        }
        case "hsl": {
            return withAlpha.hsl().string() as HSL | HSLA;
        }
        default:
            return withAlpha.rgb().string();
    }
};

/**
 * Custom hook for managing color input.
 * It provides state management for the input value,
 * the parsed color, and validation.
 * It allows for setting the color directly and validating the input.
 * The color can be in hex format or with an alpha channel.
 * The hook returns the input value, color, validation state,
 * and functions to handle input changes, validation, and setting the color directly.
 */
export const useColorInput = <T = ColorLike>(
    initialColor: ColorLike = randomColor(),
    alpha = 100,
    type: ColorType = "hex",
    allowGradient = false,
    mode: Mode = "strict",
): UseColorInputResult<T> => {
    const [inputValue, setInputValue] = useState<ColorLike>(initialColor);
    const [color, setColor] = useState<ColorLike>(initialColor);
    const [isInvalid, setIsInvalid] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const normalizedInitial = useMemo(
        () => clean(String(initialColor)),
        [initialColor],
    );

    const tryParseColor = useCallback((value: string): ColorInstance | null => {
        try {
            return new Color(value);
        } catch {
            return null;
        }
    }, []);

    const normalizeColor = useCallback(
        (value: ColorLike): string | null => {
            const str = clean(String(value));

            if (allowGradient && isValidGradient(str)) return str;

            const color = tryParseColor(str);
            if (!color) return null;

            return toTypeString(color, type, alpha);
        },
        [alpha, allowGradient, type, tryParseColor],
    );

    const apply = useCallback(
        (raw: ColorLike) => {
            const str = clean(String(raw));

            if (allowGradient && isValidGradient(str)) {
                setColor(str as ColorLike);
                setIsInvalid(false);
                setError(null);
                return;
            }

            const okShape = isValidColorInput(str);
            const color = tryParseColor(str);

            if (okShape && color) {
                const out = toTypeString(color, type, alpha);
                setColor(out as ColorLike);
                setIsInvalid(false);
                setError(null);
                return;
            }

            setIsInvalid(true);
            setError("Invalid color");
        },
        [alpha, allowGradient, mode, tryParseColor, type],
    );

    const handleChange = useCallback((input: ColorLike) => {
        setInputValue(input);
    }, []);

    const validate = useCallback(() => {
        apply(inputValue);
    }, [apply, inputValue]);

    const setColorDirectly = useCallback(
        (next: ColorLike) => {
            setInputValue(next);
            apply(next);
        },
        [apply],
    );

    return {
        inputValue: inputValue as T,
        color: color as T,
        isInvalid,
        error,
        handleChange,
        validate,
        setColorDirectly,
        normalizeColor,
    };
};
