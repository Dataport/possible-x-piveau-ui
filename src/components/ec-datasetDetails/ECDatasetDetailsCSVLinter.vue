<template>
    <!-- CSV Linter -->
    <div class="dsd-distribution-quality-csv row">
        <h4 class="col-12 mt-5 mb-3 font-weight-bold">{{ csvLinter.title }}</h4>
        <div class="col-8">
            <div 
                class="p-3 ecl-u-bg-white ecl-u-border-all ecl-u-border-width-2" 
                :class="`ecl-u-border-color-${getValidationResultStyle(csvLinter.validation.status)}`">
                <div class="row mt-2">  
                    <div class="col-1 mt-4">
                        <i class="material-icons" :class="`ecl-u-type-color-${getValidationResultStyle(csvLinter.validation.status)}`">
                            {{ getValidationResultIcon(csvLinter.validation.status) }}
                        </i>
                    </div>
                    <div class="col-11">
                        <h5 class="font-weight-bold">{{ csvLinter.validation.title }}</h5>
                        <p>{{ csvLinter.validation.description }}</p>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-4">
            <table class="row mt-4">
                <tbody class="col-4">
                    <tr>
                        <td class="col-12 text-center ecl-u-type-heading-1 ecl-u-type-color-red">{{ csvLinter.validation.count.errors }}</td>
                        <td class="col-12 text-center ecl-u-type-heading-1 ecl-u-type-color-orange">{{ csvLinter.validation.count.warnings }}</td>
                        <td class="col-12 text-center ecl-u-type-heading-1 ecl-u-type-color-blue-50">{{ csvLinter.validation.count.messages }}</td>
                    </tr>
                    <tr>
                        <td class="col-12 text-center ecl-u-type-heading-4 ecl-u-type-color-red">Errors</td>
                        <td class="col-12 text-center ecl-u-type-heading-4 ecl-u-type-color-orange">Warnings</td>
                        <td class="col-12 text-center ecl-u-type-heading-4 ecl-u-type-color-blue-50">Messages</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <span class="col-12 mt-3">Total Rows Processed: <strong>{{ csvLinter.validation.rows }}</strong></span>
        <div class="col-12 csv-result-details" :class="getBorderStyle(index)" v-for="(csvResult, index) in csvLinter.validation.results" :key="index">
            <div class="my-4 px-5 ecl-tag ecl-tag--display ecl-u-type-color-white" :class="getBadgeStyle(csvResult.type)">{{ csvResult.type }}</div>
            <h5 class="font-weight-bold">{{ csvResult.title }}</h5>
            <p>{{ csvResult.description }}</p>
        </div>
    </div>
</template>
  
<script>
export default {
    name: 'datasetDetailsCSVLinter',
    dependencies: 'DatasetService',
    data() {
        return {
            // Dummy data -> replace with CSV Linter results
            csvLinter: {
                title: 'CSV Validation Results',
                validation: {
                    status: 'success',
                    title: 'Valid CSV',
                    description: 'However, there are some issues that can be adressed to make it as easy as possible to reuse the data.',
                    results: [
                        {
                            type: 'Error',
                            title: 'Error',
                            description: 'Your CSV appears to ...',
                        },
                        {
                            type: 'Warning',
                            title: 'Incorrect Encoding',
                            description: 'Your CSV appears to ...',
                        },
                        {
                            type: 'Message',
                            title: 'Assumed Header',
                            description: 'Your CSV appears to ...',
                        },
                        {
                            type: 'Message',
                            title: 'Non-standard Line Breaks on row 1',
                            description: 'Your CSV appears to ...',
                        }
                    ],
                    count: {
                        errors: 1,
                        warnings: 1,
                        messages: 2,
                    },
                    rows: 4049,
                },
            },
        };
    },
    computed: {},
    methods: {
        getValidationResultStyle(status) {
            return status === 'success' ? 'green'
                : status === 'error' ? 'red'
                : 'black'
        },
        getValidationResultIcon(status) {
            return status === 'success' ? 'check_circle'
                : status === 'error' ? 'disabled_by_default'
                : 'info'
        },
        getBorderStyle(index) {
            return index > 0
                ? 'ecl-u-border-top ecl-u-border-color-grey-25'
                : '';
        },
        getBadgeStyle(type) {
            return type === 'Error' ? 'ecl-u-bg-red'
                : type === 'Warning' ? 'ecl-u-bg-orange'
                : type === 'Message' ? 'ecl-u-bg-blue-50'
                : 'ecl-u-bg-white';
        },
    },
    created() {},
    mounted() {},
};
</script>

<style lang="scss" scoped>
</style>
