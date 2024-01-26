<script setup>

const props = defineProps({
    context: Object
}
)

console.log(props.context.attrs.formValues);
function handleInput(e) {

}

</script>

<template >
    <div class="d-flex flex-column">
        <div v-for="items, index in props.context.attrs.formValues " :key="items">
            <div v-for="properties,propTitle in props.context.attrs.formValues[index] " :key="properties" class="d-flex flex-row">
              
                <p class="mr-1">{{ propTitle }}:  </p>
                <!-- Single String Value -->
                <div v-if="typeof properties != 'object'"> 
                    <p>{{ properties }}</p>
                </div>
                <!-- if its not a single string value && has Objects inside of Objects-->
                <div v-else >
                    
                    <div class="d-flex flex-column">
                        <div v-for="listofProperties  in Object.values(properties)[0]" :key="listofProperties">
                            <p v-if="typeof listofProperties != 'object'" class="mr-1">{{ listofProperties }}</p>
                            <div v-else>
                                <p v-for="innerProperties in Object.values(listofProperties)" :key="innerProperties">{{
                                    innerProperties }}</p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </div>
</template>