import { inputRules, InputRule, emDash, smartQuotes, ellipsis } from "prosemirror-inputrules";

export const rules = (userRules?: InputRule[]) => {

    const customRules = userRules ? userRules : []

    return inputRules({
        rules: [
            ...smartQuotes,
            ellipsis,
            emDash,
            ...customRules
        ]
    })
}