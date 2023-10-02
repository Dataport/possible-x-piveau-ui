<template>
    <div>
        <a @click="showModal">More Info</a>
        <div class="modal" v-bind:class="{ showDisModal: showThis }">
            <div class="DisModalWrap">
                <div @click="showModal" class="closeIcon" role="button"><svg xmlns="http://www.w3.org/2000/svg" width="16"
                        height="16" fill="currentColor" class="bi bi-x-circle" viewBox="0 0 16 16">
                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                        <path
                            d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
                    </svg></div>
                <table class="w-70 h-50">
                    <tr v-for=" (data, index) in distributionData" :key="index">
                        <td class="p-1">{{ getTitle(index) }}:</td>
                        <td class="p-1">{{ getData(data) }}</td>
                    </tr>
                </table>
            </div>

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
            if (typeof (data) === 'object') {
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