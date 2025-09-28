import type {
    ColorLike,
    ColorType,
    Hex,
    HSL,
    HSLA,
    RGB,
    RGBA,
} from "@ui-types";
import { isValidColorInput, isValidGradient } from "@utils/colorRegex";
import { randomColor } from "@utils/randomColor";
import { formatHex, formatHex8, formatHsl, formatRgb, parse } from "culori";
import { useState } from "react";

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
    initialColor = randomColor(),
    alpha = 100,
    type: ColorType = "hex",
    allowGradient = false,
) => {
    const [inputValue, setInputValue] = useState<ColorLike>(initialColor);
    const [color, setColor] = useState<ColorLike>(initialColor);
    const [isInvalid, setIsInvalid] = useState<boolean>(false);

    const handleChange = (input: ColorLike) => {
        setInputValue(input);
    };

    const validate = () => {
        const trimmed = inputValue.trim();

        if (isValidColorInput(trimmed)) {
            if (allowGradient && isValidGradient(trimmed)) {
                setColor(trimmed as ColorLike);
                setIsInvalid(false);
                return;
            }

            const parsed = parse(trimmed);

            if (parsed) {
                switch (type) {
                    case "hex":
                        if (alpha === 100) setColor(formatHex(parsed) as Hex);
                        else setColor(formatHex8(parsed) as Hex);
                        break;
                    case "rgb":
                        setColor(formatRgb(parsed) as RGB | RGBA);
                        break;
                    case "hsl":
                        setColor(formatHsl(parsed) as HSL | HSLA);
                }
                setIsInvalid(false);

                return;
            }
        }

        setIsInvalid(true);
    };

    const setColorDirectly = (color: ColorLike) => {
        setInputValue(color);

        const trimmed = String(color).trim();

        if (isValidGradient(trimmed)) {
            setColor(trimmed as ColorLike);
            setIsInvalid(false);
            return;
        }

        const parsed = parse(trimmed);
        if (parsed) {
            switch (type) {
                case "hex":
                    if (alpha === 100) setColor(formatHex(parsed) as Hex);
                    else setColor(formatHex8(parsed) as Hex);
                    break;
                case "rgb":
                    setColor(formatRgb(parsed) as RGB | RGBA);
                    break;
                case "hsl":
                    setColor(formatHsl(parsed) as HSL | HSLA);
            }
            setIsInvalid(false);
        } else {
            setIsInvalid(true);
        }
    };

    return {
        inputValue: inputValue as T,
        color: color as T,
        isInvalid,
        handleChange,
        validate,
        setColorDirectly,
    };
};
