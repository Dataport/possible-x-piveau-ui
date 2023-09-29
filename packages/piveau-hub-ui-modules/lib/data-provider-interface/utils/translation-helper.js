import { has } from 'lodash-es';

/**
 * Translation of each translatable parameter within the given structure if a translation is available
 * @param {*} propertyDefnition Object containing parameters defining the form and their content
 * @param {String} property String defining which property translation should be used
 */
function translateProperty(propertyDefinition, property) {
    
    if (has(propertyDefinition, 'identifier')) { // hidden fields don't need a label and have no identifier 
        const translatableParameters = ['label', 'info', 'help', 'placeholder', 'add-label'];
        const propertyName = propertyDefinition.identifier;

        for (let valueIndex = 0; valueIndex < translatableParameters.length; valueIndex += 1) {
            let translation = propertyName;
            const parameter = translatableParameters[valueIndex];
            const translationExsists = this.i18n.global.te(`message.dataupload.${property}.${propertyName}.${parameter}`);
            
            // Check if translation exists
            if (!has(property, parameter) ) {
                if (translationExsists) {
                    translation = this.i18n.global.t(`message.dataupload.${property}.${propertyName}.${parameter}`);
                } else {
                    // if no translation is available, provide english label
                    translation = this.i18n.global.t(`message.dataupload.${property}.${propertyName}.${parameter}`, 'en');
                }
            propertyDefinition[parameter] = translation;
            }

            // Highlight mandatory fields
            if (propertyDefinition.mandatory && parameter=="label") propertyDefinition[parameter] = `${translation}*`
        }
    }
}

/**
 * Recursive translation of propertie parameters including recursive translation of nested properties
 * @param {Object} schema Object containing the forms schema
 * @param {String} property String defining which property translation should be used (datasets/ distribution/ catalogues)
 */
function translate(schema, property) {
    for (let index = 0; index < schema.length; index += 1) {
        const schemaPropertyValues = schema[index];

        // translation of group forms and their nested properties
        if (has(schemaPropertyValues, 'children')) {
        // group attributes should be translated too
        translateProperty(schemaPropertyValues, property);
        // translated nested properties
        translate(schemaPropertyValues.children, property);
        // translation of conditional forms and their nested properties
        } else if (has(schemaPropertyValues, 'data')) {
        // group attributes should be translated too
        translateProperty(schemaPropertyValues, property);
        // translate nested data
        const dataKeys = Object.keys(schemaPropertyValues.data);
        for (let keyIndex = 0; keyIndex < dataKeys.length; keyIndex += 1) {
            const currentKey = dataKeys[keyIndex];
            translate(schemaPropertyValues.data[currentKey], property);
        }
        // translation of 'normal' singular form properties
        } else {
        translateProperty(schemaPropertyValues, property);
        }
    }
}

export default translate;
