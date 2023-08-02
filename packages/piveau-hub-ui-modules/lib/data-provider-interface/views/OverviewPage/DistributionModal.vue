<template>
    <div>
        <a @click="showModal">More Info</a>
        <div class="modal" v-bind:class="{ showDisModal: showThis }">
            <div @click="showModal" class="closeIcon" role="button">x</div>
            <table class="w-70 h-50">
                <tr v-for=" (data, index) in distributionData" :key="index">
                    <td class="p-1">{{ getTitle(index) }}:</td>
                    <td class="p-1">{{ getData(data) }}</td>
                </tr>
            </table>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            showThis: false
        }
    },
    props: {
        distributionData: {},
        locale: ""
    },
    methods: {
        showModal() {
            this.showThis = !this.showThis
        },
        getTitle(propertyName) {
            return propertyName.split(':')[1]

        },
        getData(data) {
            console.log(data);
            if(typeof(data) === 'object'){
                data = data[0]['@value']
            }
            
            return data
        }
    }
}
</script>
<style>
.showDisModal {
    display: flex !important;
    align-content: center;
    justify-content: center;
    background-color: rgba(255, 255, 255, 0.7);
    backdrop-filter: blur(5px);

}
</style>