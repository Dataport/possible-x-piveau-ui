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
    // try {
    //   const response = await axios.get('https://api.example.com/resource')
    //   resourceDetailsData.value = response.data
    // } catch (err) {
    //   error.value = err.response ? err.response.data.message : err.message
    // }

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
                console.log(response.data);
                    
               
    
            } catch (error) {
                console.error('API request failed:', error);
            }

    
  }

  return {
    resourceDetailsData,
    fetchResourceDetails,
  }
})




// fetchDatasetDetails:async function(id){
//     const resource = Object.keys(resourceMapping).find(key => resourceMapping[key as keyof object] === state.selectedResource.value);
//     const endpoint = `resources/${resource}`;
//     const reqStr = `${ENV.api.baseUrl}${endpoint}`;
    
    
//         try {
//             const response = await axios.get(`${reqStr}/${id}`, {
//                 headers: {
                    
//                     'Content-Type': 'application/json',
//                     'Accept': 'application/json'
//                 }
               
//             })
//             console.log(response.data);
                
           

//         } catch (error) {
//             console.error('API request failed:', error);
//         }
    
// }