<template>
  <div>
    <!-- CREATOR -->
    <div v-if="property === 'dct:creator'">
        <td class="w-25 font-weight-bold">{{ $t(`${value.label}`)}}:</td>
        <div v-if="showValue(data, 'rdf:type')">{{ $t('message.metadata.type') }}: {{ data['rdf:type'].split(':')[1] }}</div>
        <div v-if="showValue(data, 'foaf:name')">{{ $t('message.metadata.name') }}: {{ data['foaf:name'] }}</div>
        <div v-if="showValue(data, 'foaf:mbox')">{{ $t('message.metadata.email') }}: <app-link :to="`mailto:${data['foaf:mbox']}`">{{ data['foaf:mbox'] }}</app-link></div>
        <div v-if="showValue(data, 'foaf:homepage')">{{ $t('message.metadata.homepage') }}: <app-link :to="data['foaf:homepage']">{{ data['foaf:homepage'] }}</app-link>
        </div>
    </div>

    <!-- CONTACT POINT -->
    <div v-if="property === 'dcat:contactPoint'">
        <td class="w-25 font-weight-bold">{{ $t(`${value.label}`)}}:</td>
        <div v-if="showValue(data, 'rdf:type')">{{ $t('message.metadata.type') }}: {{ data['rdf:type'].split(':')[1] }}</div>
        <div v-if="showValue(data, 'vcard:fn')">{{ $t('message.metadata.name') }}: {{ data['vcard:fn'] }}</div>
        <div v-if="showValue(data, 'vcard:hasEmail')">{{ $t('message.metadata.email') }}: <app-link :to="`mailto:${data['vcard:hasEmail']}`">{{ data['vcard:hasEmail'] }}</app-link></div>
        <div v-if="showValue(data, 'vcard:hasOrganizationName')">{{ $t('message.metadata.organizationName') }}: {{ data['vcard:hasOrganizationName'] }}</div>
        <div v-if="showValue(data, 'vcard:hasTelephone')">{{ $t('message.metadata.telephone') }}: {{ data['vcard:hasTelephone'] }}</div>
        <div v-if="showValue(data, 'vcard:hasURL')">{{ $t('message.metadata.url') }}: <app-link :to="data['vcard:hasURL']">{{ data['vcard:hasURL'] }}</app-link></div>
        <div v-if="showValue(data, 'vcard:hasAddress')">{{ $t('message.metadata.address') }}: 
            <span v-if="showValue(data['vcard:hasAddress'][0], 'vcard:street_address')">{{ data['vcard:hasAddress'][0]['vcard:street_address'] }}</span>,
            <span v-if="showValue(data['vcard:hasAddress'][0], 'vcard:postal_code')">{{ data['vcard:hasAddress'][0]['vcard:postal_code'] }}</span>
            <span v-if="showValue(data['vcard:hasAddress'][0], 'vcard:locality')">{{ data['vcard:hasAddress'][0]['vcard:locality'] }}</span>,
            <span v-if="showValue(data['vcard:hasAddress'][0], 'vcard:country_name')">{{ data['vcard:hasAddress'][0]['vcard:country_name'] }}</span>
        </div>
    </div>

    <!-- ADMS IDENTIEFIER -->
    <div v-if="property === 'adms:identifier' && Object.keys(data).length > 1">
        <td class="w-25 font-weight-bold">{{ $t(`${value.label}`)}}:</td>
        <div v-if="showValue(data, '@id') && property === 'adms:identifier'">{{ $t('message.metadata.url') }}: <app-link :to="data['@id']">{{ data['@id'] }}</app-link></div>
        <div v-if="showValue(data, 'skos:notation') && showValue(data['skos:notation'][0], '@value')">{{ $t('message.metadata.identifier') }}: {{ data['skos:notation'][0]['@value'] }}</div>
        <div v-if="showValue(data, 'skos:notation') && showValue(data['skos:notation'][0], '@type')">{{ $t('message.metadata.type') }}: {{ data['skos:notation'][0]['@type'] }}</div>
    </div>
    
    <!-- TEMPORAL -->
    <div v-if="property === 'dct:temporal'">
        <td class="w-25 font-weight-bold">{{ $t(`${value.label}`)}}:</td>
        <div v-if="showValue(data, 'dcat:startDate')">{{ filterDateFormatEU(data['dcat:startDate']) }}</div>
        <div v-if="showValue(data, 'dcat:endDate')">{{ filterDateFormatEU(data['dcat:endDate']) }}</div>
    </div>


    <!-- CHECKSUM -->
    <div v-if="property === 'spdx:checksum'">
        <td class="w-25 font-weight-bold">{{ $t(`${value.label}`)}}:</td>
        <div v-if="showValue(data, 'spdx:checksumValue')">{{ data['spdx:checksumValue']}}</div>
        <div v-if="showValue(data, 'spdx:algorithm')">{{ data['spdx:algorithm']}}</div>        
    </div>
    

    <!-- PAGE -->
    <div v-if="property === 'foaf:page'">
        <td class="w-25 font-weight-bold">{{ $t(`${value.label}`)}}:</td>
        <div v-if="showValue(data, 'dct:title')">{{ $t('message.metadata.title') }}: {{ data['dct:title'].filter(el=>el['@language'] === dpiLocale).map(el=>el['@value'])[0] }}</div>
        <div v-if="showValue(data, 'dct:description')">{{ $t('message.metadata.description') }}: {{ data['dct:description'].filter(el=>el['@language'] === dpiLocale).map(el=>el['@value'])[0] }}</div>
        <div v-if="showValue(data, 'dct:format')">{{ $t('message.metadata.format') }}:{{ data['dct:format'] }}</div>
        <div v-if="showValue(data, '@id')">{{ $t('message.metadata.url') }}: <app-link :to="data['@id']">{{ data['@id'] }}</app-link></div>
    </div>

    <!-- CONFORMS TO -->
    <div v-if="property === 'dct:conformsTo'">
        <td class="w-25 font-weight-bold">{{ $t(`${value.label}`)}}:</td>
        <div v-if="showValue(data, 'rdfs:label')">{{ data['rdfs:label'] }}</div>
        <app-link v-if="showValue(data, '@id')" :to="data['@id']">{{ data['@id'] }}</app-link>
    </div>

    <!-- TEMPORAL RESOLUTION -->
    <div v-if="property === 'dcat:temporalResolution'">
        <td class="w-25 font-weight-bold">{{ $t(`${value.label}`)}}:</td>
        <div>{{ convertTemporalResolution(data) }}</div>
    </div>

    <!-- DATA SERVICE -->
    <div v-if="property === 'dcat:accessService'">
        <td class="w-25 font-weight-bold">{{ $t(`${value.label}`)}}:</td>
        <div v-if="showValue(data, 'dct:title')">
            <span class="font-weight-bold">{{ $t('message.dataupload.distributions.accessServiceTitle.label') }}:</span>
            {{ data['dct:title'].filter(el => el['@language'] === dpiLocale).map(el => el['@value'])[0] }}
        </div>
        <div v-if="showValue(data, 'dct:description')">
            <span class="font-weight-bold">{{ $t('message.dataupload.distributions.accessServiceDescription.label') }}:</span>
            {{ data['dct:description'].filter(el => el['@language'] === dpiLocale).map(el => el['@value'])[0] }}
        </div>
        <div v-if="showValue(data, 'dcat:endpointURL')" class="pr-1">
            <span class="font-weight-bold">{{ $t('message.dataupload.distributions.accessServiceEndpointURL.label') }}:</span>
            <app-link :to="data['dcat:endpointURL']">{{ data['dcat:endpointURL'] }}</app-link>
        </div>
    </div>
            
  </div>
</template>

<script>
import AppLink from "@/modules/widgets/AppLink";
import dateFilters from "@/modules/filters/dateFilters";
import { has, isNil, isEmpty } from 'lodash';

export default {
    props: {
        property: String,
        value: Object,
        data: Object,
        dpiLocale: String,
    },
    components: {
        AppLink,
    },
    methods: {
        showValue(property, value) {
            return has(property, value) && !isNil(property[value]) && !isEmpty(property[value]);
        },
        filterDateFormatEU(date) {
            return dateFilters.formatEU(date);
        },
        convertTemporalResolution(data) {
            const values = {
                "Year": "", 
                "Month": "", 
                "Day": "", 
                "Hour": "", 
                "Minute": "", 
                "Second": ""
            };

            for (let i = 0; i < Object.keys(values).length; i += 1) {
                const key = Object.keys(values)[i];

                if (has(data, key)) {
                    if (key !== 'Year' && data[key].length < 2) {
                        values[key] = `0${data[key]}`;
                    } else if (key === 'Year' && data[key].length < 4) {
                        if (data[key].length === 3) values[key] = `0${data[key]}`;
                        else if (data[key].length === 2) values[key] = `00${data[key]}`;
                        else if (data[key].length === 1) values[key] = `000${data[key]}`;
                    } else {
                        values[key] = data[key];
                    }
                } else {
                    if (key === "Year") values[key] = "0000";
                    else values[key] = "00";
                }
            }

            return `${values['Hour']}:${values['Minute']}:${values['Second']} - ${values['Day']}.${values['Month']}.${values['Year']}`
        }
    }
    
}
</script>