// convertODRLPolicies.js
export function convertODRLPolicies(policyArray) {
    return policyArray.map(element => {
      // Attempt to parse JSON
      let parsed;
      try {
        parsed = JSON.parse(element);
      } catch {
        // Not a JSON string, return as is
        return element;
      }
  
      // Check if this parsed object looks like an ODRL policy
      if (parsed && (parsed["odrl:permission"] || parsed["odrl:prohibition"] || parsed["odrl:obligation"])) {
        // Extract permissions array
        const permissions = parsed["odrl:permission"] || [];
  
        // Extract DIDs from the permissions
        const dids = permissions
          .map(permission => {
            const constraint = permission["odrl:constraint"];
            return constraint ? constraint["odrl:rightOperand"] : null;
          })
          .filter(Boolean);
  
        // Remove duplicates if any
        const uniqueDids = [...new Set(dids)];
  
        // Construct a human-readable sentence
        if (uniqueDids.length > 0) {
          return `The contracting is restricted to the following organization(s): ${uniqueDids.join(", ")}`;
        } else {
          return "No specific organizations restricted.";
        }
      } else {
        // Not an ODRL policy, return the original element as is
        return element;
      }
    });
  }
  