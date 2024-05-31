import { useState } from "react";
import * as text from '../../public/locales/i18n.json'


export function useLanguage() {
    const [ language, setLanguage ] = useState("eng")

    const acceptedLanguages = ["eng", "por"]

    function changeLanguage(lang) {
        if (acceptedLanguages.includes(lang)){
            setLanguage(lang)
        }
    }

    function t(path) {
        const l = language
        try {
            const levels = path.split(".");
            
            if (!levels) {
                const res = text[path][l];
                return res;
            }

            let sentence = text;
            levels.forEach(w => {
                sentence = sentence[w];
            });

            return sentence[l];
            // return l
        } catch (error) {
            return "[translation path error]";
        }
    }

    return { language, changeLanguage, t };
}