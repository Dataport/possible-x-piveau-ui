export function convertODRLPolicies(policyArray) {
    let policyOutput = {
        didRestriction: new Set(),
        startDateRestriction: null,
        endDateRestriction: null,
        offsetRestriction: null,
        textRestriction: []
    };

    policyArray.forEach(policyJson => {
        let parsed;
        try {
            parsed = JSON.parse(policyJson);
        } catch {
            policyOutput.textRestriction.push(policyJson);
            return;
        }

        if (parsed && parsed["odrl:permission"]) {
            const permissions = parsed["odrl:permission"];

            permissions.forEach(permission => {
                const action = permission["odrl:action"]?.["odrl:type"];
                // Process permissions with action "use" or "transfer"
                if (action !== "http://www.w3.org/ns/odrl/2/use" && action !== "http://www.w3.org/ns/odrl/2/transfer") {
                    return;
                }

                // Ensure odrl:constraint is always an array.
                const constraintField = permission["odrl:constraint"];
                const constraints = Array.isArray(constraintField)
                    ? constraintField
                    : (constraintField ? [constraintField] : []);

                constraints.forEach(constraint => {
                    const leftOperand = constraint["odrl:leftOperand"];
                    const operator = constraint["odrl:operator"]?.["@id"];
                    const rightOperand = constraint["odrl:rightOperand"];

                    if (leftOperand === "did" && operator === "odrl:isPartOf") {
                        if (Array.isArray(rightOperand)) {
                            rightOperand.forEach(did => policyOutput.didRestriction.add(did));
                        } else {
                            policyOutput.didRestriction.add(rightOperand);
                        }
                    } else if (leftOperand === "https://w3id.org/edc/v0.0.1/ns/inForceDate") {
                        if (operator === "odrl:gteq") {
                            policyOutput.startDateRestriction = formatDate(rightOperand);
                        } else if (operator === "odrl:lteq") {
                            if (rightOperand.includes("contractAgreement")) {
                                policyOutput.offsetRestriction = parseOffset(rightOperand);
                            } else {
                                policyOutput.endDateRestriction = formatDate(rightOperand);
                            }
                        }
                    }
                });
            });
        } else {
            policyOutput.textRestriction.push(policyJson);
        }
    });

    // Convert the didRestriction set back to an array and sort it.
    policyOutput.didRestriction = Array.from(policyOutput.didRestriction).sort((a, b) => a.localeCompare(b));
    return policyOutput;
}

function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleString("en-US", { 
        weekday: "long", 
        year: "numeric", 
        month: "long", 
        day: "numeric", 
        hour: "2-digit", 
        minute: "2-digit", 
        second: "2-digit", 
        timeZone: "Europe/Berlin", 
        timeZoneName: "short" 
    });
}

function parseOffset(offsetStr) {
    const match = offsetStr.match(/\+(\d+)([hmsd])/);
    if (match) {
        const [_, value, unit] = match;
        if (unit === 'h') return `${value} hour(s)`;
        if (unit === 'm') return `${value} minute(s)`;
        if (unit === 's') return `${value} second(s)`;
        if (unit === 'd') return `${value} day(s)`;
    }
    return "Unknown offset";
}
