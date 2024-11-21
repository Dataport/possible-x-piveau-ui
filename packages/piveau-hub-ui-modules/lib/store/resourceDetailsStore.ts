import { useRuntimeEnv } from '../composables/useRuntimeEnv';
import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

export const useResourceDetailsStore = defineStore('resourceDetailsStore', () => {

  // const datahard = {
  //   "name": "Data Offering Service",
  //   "description": "Data Offering Service provides data securely through the Possible Dataspace software solution. The Data Offering Service enables secure and sovereign data exchange between different organizations using the Eclipse Dataspace Connector (EDC). The service seamlessly integrates with IONOS S3 buckets to ensure reliable and scalable data storage and transfer.",
  //   "provided_by": "did:web:portal.dev.possible-x.de:participant:df15587a-0760-32b5-9c42-bb7be66e8076",
  //   "terms_and_conditions": [
  //   {
  //   "url": "test.eu/tnc",
  //   "hash": "hash123"
  //   },
  //   {
  //   "url": "test.eu2/tnc",
  //   "hash": "hash223"
  //   }
  //   ],
  //   "data_protection_regime": ["GDPR2016", "LGPD2019", "PDPA2012"],
  //   "data_account_export": [
  //   {
  //   "gx:requestType": "API",
  //   "gx:accessType": "digital",
  //   "gx:formatType": "application/json"
  //   },
  //   {
  //   "gx:requestType": "Download",
  //   "gx:accessType": "digital",
  //   "gx:formatType": "application/csv"
  //   }
  //   ]
  //  }


  const datahard =
  {
    "aggregation_of": [
      {
        "name": "Data Resource",
        "description": "Here is a data resource description. This will probably be a few sentences. This will probably be a few sentences. This will probably be a few sentences. ",
        "copyright_owned_by": "did:web:portal.dev.possible-x.de:participant:df15587a-0760-32b5-9c42-bb7be66e8076",
        "license": [
          "AGPL-1.0-only",
          "AGPL-2.0-only"
        ],
        "produced_by": "did:web:portal.dev.possible-x.de:participant:df15587a-0760-32b5-9c42-bb7be66e8076",
        "exposed_through": "urn:uuid:a29a5623-bcc8-4f08-a155-97e19e9f5a49",
        "policy": [
          "{\n  \"@type\": \"odrl:Set\",\n  \"odrl:permission\": [\n    {\n      \"odrl:action\": {\n        \"odrl:type\": \"http://www.w3.org/ns/odrl/2/use\"\n      }\n    },\n    {\n      \"odrl:action\": {\n        \"odrl:type\": \"http://www.w3.org/ns/odrl/2/transfer\"\n      }\n    }\n  ],\n  \"odrl:prohibition\": [],\n  \"odrl:obligation\": []\n}"
        ],
        "containsPII": true,
        "legitimate_interest": "legitimateInterest will only be here if containsPII is true. If contains PII is false, there will be no legitimateInterest attribute.",
        "legal_basis": "legalBasis will only be here if containsPII is true. If contains PII is false, there will be no legalBasis attribute.",
        "data_protection_contact": "Data Protection Contract"
      }
    ],
    "name": "Data Offering Service",
    "description": "Data Offering Service provides data securely through the Possible Dataspace software solution. The Data Offering Service enables secure and sovereign data exchange between different organizations using the Eclipse Dataspace Connector (EDC). The service seamlessly integrates with IONOS S3 buckets to ensure reliable and scalable data storage and transfer.",
    "provided_by": "did:web:portal.dev.possible-x.de:participant:df15587a-0760-32b5-9c42-bb7be66e8076",
    "terms_and_conditions": [
      {
        "url": "test.eu/tnc",
        "hash": "hash123"
      },
      {
        "url": "test.eu2/tnc",
        "hash": "hash223"
      }
    ],
    "policy": "{\n  \"@type\": \"odrl:Set\",\n  \"odrl:permission\": [\n    {\n      \"odrl:action\": {\n        \"odrl:type\": \"http://www.w3.org/ns/odrl/2/use\"\n      }\n    },\n    {\n      \"odrl:action\": {\n        \"odrl:type\": \"http://www.w3.org/ns/odrl/2/transfer\"\n      }\n    }\n  ],\n  \"odrl:prohibition\": [],\n  \"odrl:obligation\": []\n}",
    "data_protection_regime": ["GDPR2016", "LGPD2019", "PDPA2012"],
    "data_account_export": [
      {
        "requestType": "API",
        "accessType": "digital",
        "formatType": "application/json"
      },
      {
        "requestType": "Download",
        "accessType": "digital",
        "formatType": "application/csv"
      }
    ]
  }


  const ENV = useRuntimeEnv();

  const resourceDetailsData = ref(null)
  const error = ref(null)
  const popUp = ref(false)

  const fetchResourceDetails = async (type: string, id: string) => {

    const endpoint = `resources/${type}/${id}`;
    const reqStr = `${ENV.api.baseUrl}${endpoint}`;

    try {
      const response = await axios.get(reqStr, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      resourceDetailsData.value = await response.data?.result;
      // resourceDetailsData.value = datahard
      // console.log(resourceDetailsData.value);


    } catch (error) {
      console.error('API request failed:', error);
    }
  }

  const resetResourceDetails = () => {
    resourceDetailsData.value = null
    error.value = null
  }

  function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
      popUp.value = true
      setTimeout(() => {
        popUp.value = false
      }, 2000)
    }).catch(err => {
      console.error("Failed to copy ID: ", err);
    });
  }


  return {
    resourceDetailsData,
    fetchResourceDetails,
    resetResourceDetails,
    copyToClipboard,
    popUp
  }
})