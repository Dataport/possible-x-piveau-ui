import { useRuntimeEnv } from '../composables/useRuntimeEnv';
import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'
import { useResourcesStore } from './resourcesStore';

export const useResourceDetailsStore = defineStore('resourceDetailsStore', () => {

    const resourceMapping:object = {
        'datasets': 'datasets',
        'catalogues': 'catalogues',
        'legal-person': 'legalPersons',
        'software-offering': 'softwareOfferings',
    };

   
  const resourceDetailsData = ref(null)
  const resourcesStore = useResourcesStore()


  const error = ref(null)

  const ENV = useRuntimeEnv();

  const fetchResourceDetails = async (id) => {
   
    const resource = Object.keys(resourceMapping).find(key => resourceMapping[key as keyof object] === resourcesStore.state.selectedResource);
        const endpoint = `resources/${resource}`;
        const reqStr = `${ENV.api.baseUrl}${endpoint}`;
        
            try {
                const response = await axios.get(`${reqStr}/${id}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    }
                })           
                resourceDetailsData.value = await response.data
            } catch (error) {
                console.error('API request failed:', error);
            }
  }

  const resetResourceDetails = () => {
    resourceDetailsData.value = null
    error.value = null
  }


  return {
    resourceDetailsData,
    fetchResourceDetails,
    resetResourceDetails
  }
})