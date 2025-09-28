import {
    ThemeProvider as EmotionThemeProvder,
    type Theme,
} from "@emotion/react";
import type { ThemeMode } from "@ui-types";
import {
    createContext,
    forwardRef,
    useEffect,
    useImperativeHandle,
    useMemo,
    useState,
    type PropsWithChildren,
} from "react";
import { baseDarkTheme, baseLightTheme, themes as baseThemes } from "./themes";

export const ThemeContext = createContext({
    theme: baseThemes.find((theme) => theme.id === "baseDark") ?? baseThemes[0],
    changeTheme: (_theme: Theme) => {
        return;
    },
    mode: "system" as ThemeMode,
    changeMode: (_mode: ThemeMode) => {
        return;
    },
});

export interface ThemeProviderRef {
    changeTheme: (theme: Theme) => void;
    changeMode: (mode: ThemeMode) => void;
}

const ThemeProvider = forwardRef<
    ThemeProviderRef,
    PropsWithChildren & {
        onThemeChange?: (theme: Theme) => void;
        onModeChange?: (mode: ThemeMode) => void;
        disableDefaultThemeOnModeChange?: boolean;
    }
>(
    (
        {
            children,
            onThemeChange,
            onModeChange,
            disableDefaultThemeOnModeChange = false,
        },
        ref,
    ) => {
        const [theme, setTheme] = useState<Theme | null>(null);
        const [mode, setMode] = useState<ThemeMode>("system");
        const [prefersDark, setPrefersDark] = useState<boolean | null>(null);
        const [mounted, setMounted] = useState(false);

        useEffect(() => {
            setMounted(true);
            if (typeof window === "undefined") return;

            const mediaQuery = window.matchMedia(
                "(prefers-color-scheme: dark)",
            );
            const updatePrefersDark = () => {
                const isDark = mediaQuery.matches;
                setPrefersDark(isDark);
                if (mode === "system") {
                    setTheme(isDark ? baseDarkTheme : baseLightTheme);
                }
            };

            updatePrefersDark(); // initialize on mount
            mediaQuery.addEventListener("change", updatePrefersDark);
            return () =>
                mediaQuery.removeEventListener("change", updatePrefersDark);
        }, [mode]);

        const changeMode = (mode: ThemeMode) => {
            setMode(mode);

            if (!disableDefaultThemeOnModeChange) {
                if (mode === "system" && prefersDark !== null)
                    setTheme(prefersDark ? baseDarkTheme : baseLightTheme);
                else if (mode === "dark") setTheme(baseDarkTheme);
                else setTheme(baseLightTheme);
            }

            onModeChange?.(mode);
        };

        const changeTheme = (theme: Theme) => {
            setTheme(theme);
            onThemeChange?.(theme);
        };

        useImperativeHandle(ref, () => ({
            changeTheme,
            changeMode,
        }));

        const themeObject =
            theme ??
            (prefersDark != null
                ? prefersDark
                    ? baseDarkTheme
                    : baseLightTheme
                : baseDarkTheme);

        const value = useMemo(
            () => ({
                theme: themeObject,
                changeTheme,
                mode,
                changeMode,
            }),
            [mode, themeObject],
        );

        if (!mounted) return null;

        return (
            <ThemeContext.Provider value={value}>
                <EmotionThemeProvder theme={themeObject}>
                    {children}
                </EmotionThemeProvder>
            </ThemeContext.Provider>
        );
    },
);

ThemeProvider.displayName = "ThemeProvider";

export { ThemeProvider };
