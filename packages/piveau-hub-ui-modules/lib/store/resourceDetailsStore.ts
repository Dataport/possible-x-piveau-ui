import { useRuntimeEnv } from '../composables/useRuntimeEnv';
import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

export const useResourceDetailsStore = defineStore('resourceDetailsStore', () => {

  const ENV = useRuntimeEnv();

  const resourceDetailsData = ref(null)
  const error = ref(null)

  const fetchResourceDetails = async (type: string, id: string) => {
        console.log("*** Inside fetchResourceDetails");
   
        const endpoint = `resources/${type}/${id}`;
        console.log("Endpoint: ", endpoint);
        const reqStr = `${ENV.api.baseUrl}${endpoint}`;
        
            try {
                const response = await axios.get(reqStr, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    }
                });    
                resourceDetailsData.value = await response.data?.result;
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