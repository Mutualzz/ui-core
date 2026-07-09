import type {
    ColorFormat,
    ColorLike,
    Hex,
    HSL,
    HSLA,
    HSV,
    HSVA,
    RGB,
    RGBA,
} from "@ui-types";
import { isValidColorInput, isValidGradient } from "@utils/colorRegex";
import { randomColor } from "@utils/randomColor";
import Color from "color";
import { useState } from "react";

/** Manages a color input's raw text value alongside its parsed/validated color state. */
export const useColorInput = <T = ColorLike>(
    initialColor = randomColor(),
    alpha = 100,
    type: ColorFormat = "hex",
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

            let parsed = null;
            try {
                parsed = new Color(trimmed);
            } catch {
                setIsInvalid(true);
                return;
            }

            if (parsed) {
                switch (type) {
                    case "hex":
                        if (alpha === 100) setColor(parsed.hex() as Hex);
                        else setColor(parsed.hexa() as Hex);
                        break;
                    case "rgb":
                        setColor(parsed.rgb().string() as RGB | RGBA);
                        break;
                    case "hsl":
                        setColor(parsed.hsl().string() as HSL | HSLA);
                        break;
                    case "hsv":
                        setColor(parsed.hsv().string() as HSV | HSVA);
                        break;
                    default:
                        setColor(parsed.string() as ColorLike);
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

        let parsed = null;
        try {
            parsed = new Color(trimmed);
        } catch {
            // ignore invalid color input
        }
        if (parsed) {
            switch (type) {
                case "hex":
                    if (alpha === 100) setColor(parsed.hex() as Hex);
                    else setColor(parsed.hexa() as Hex);
                    break;
                case "rgb":
                    setColor(parsed.rgb().string() as RGB | RGBA);
                    break;
                case "hsl":
                    setColor(parsed.hsl().string() as HSL | HSLA);
                    break;
                case "hsv":
                    setColor(parsed.hsv().string() as HSV | HSVA);
                    break;
                default:
                    setColor(parsed.string() as ColorLike);
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
