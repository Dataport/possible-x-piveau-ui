<template>
    <!-- CSV Linter -->
    <div class="dsd-distribution-quality-csv row">
        <h4 class="col-12 mt-5 mb-3 font-weight-bold">{{ csvLinter.title }}</h4>
        <div class="col-8">
            <div class="p-3 csv-validation-box" 
                :class="csvLinter.validation.passed">
                <div class="row mt-2">  
                    <div class="col-1 mt-4">
                        <i class="material-icons" :class="csvLinter.validation.passed">
                            {{ getValidationResultIcon(csvLinter.validation.passed) }}
                        </i>
                    </div>
                    <div class="col-11">
                        <h5 class="font-weight-bold">{{ csvLinter.validationTitle[csvLinter.validation.passed] }}</h5>
                        <p>{{ csvLinter.validationDescription[csvLinter.validation.passed] }}</p>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-4">
            <table class="row mt-4">
                <tbody class="col-4">
                    <tr>
                        <td class="col-12 text-center heading-1 color-red">{{ csvLinter.validation.errors.count }}</td>
                        <td class="col-12 text-center heading-1 color-orange">{{ csvLinter.validation.warnings.count }}</td>
                        <td class="col-12 text-center heading-1 color-blue">{{ csvLinter.validation.info.count }}</td>
                    </tr>
                    <tr>
                        <td class="col-12 text-center heading-4 color-red">Errors</td>
                        <td class="col-12 text-center heading-4 color-orange">Warnings</td>
                        <td class="col-12 text-center heading-4 color-blue">Messages</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <span class="col-12 mt-3">Total Rows Processed: <strong>{{ csvLinter.validation.rowCount }}</strong></span>
        <div class="col-12 csv-result-details" :class="getBorderStyle(index)" v-for="(csvResult, index) in validationResults" :key="index">
            <div class="my-4 px-5 tag" :class="getBGStyle(csvResult.type)">{{ csvResult.type }}</div>
            <h5 class="font-weight-bold">{{ csvResult.message_header }}</h5>
            <p>{{ csvResult.message }}</p>
        </div>
    </div>
</template>
  
<script>
import { mapGetters } from 'vuex';

export default {
    name: 'datasetDetailsCSVLinter',
    dependencies: 'DatasetService',
    data() {
        return {
            // Dummy data -> replace with CSV Linter results
            csvLinter: {
                endpoint: '/distributions/{id}/validations/csv',
                title: 'CSV Validation Results',
                validationTitle: {
                    true: 'Valid CSV',
                    false: 'CSV not valid',
                },
                validationDescription: {
                    true: 'However, there are some issues that can be adressed to make it as easy as possible to reuse the data.',
                    false: 'Your CSV file is not valid ...',
                },
                validation: {
                    passed: 'true',
                    rowCount: 4049,
                    errors: {
                        count: 1,
                        items: [
                            {
                                type: 'Error',
                                indicator: 'error',
                                message_header: 'Error',
                                message: 'Your CSV appears to ...',
                                row: -1,
                                column: -1,
                                columnName: '',
                            },
                        ],
                    },
                    warnings: {
                        count: 1,
                        items: [
                            {
                                type: 'Warning',
                                indicator: 'incorrect_encoding',
                                message_header: 'Incorrect Encoding',
                                message: 'Your CSV appears to ...',
                                row: -1,
                                column: -1,
                                columnName: '',
                            },
                        ],
                    },
                    info: {
                        count: 2,
                        items: [
                            {
                                type: 'Info',
                                indicator: 'assumed_header',
                                message_header: 'Assumed Header',
                                message: 'Your CSV appears to ...',
                                row: -1,
                                column: -1,
                                columnName: '',
                            },
                            {
                                type: 'Info',
                                indicator: 'line_breaks',
                                message_header: 'Non-standard Line Breaks on row 1',
                                message: 'Your CSV appears to ...',
                                row: -1,
                                column: -1,
                                columnName: '',
                            },
                        ],
                    },   
                },
            },
        };
    },
    computed: {
        ...mapGetters('datasetDetails', [
            'getDistributions',
        ]),
        distributionIDs() {
            return this.getDistributions.map(d => d.id);
        },
        validationResults() {
            this.csvLinter.validation.errors.items.forEach(i => i.type = 'Error');
            this.csvLinter.validation.warnings.items.forEach(i => i.type = 'Warning');
            this.csvLinter.validation.info.items.forEach(i => i.type = 'Message');

            return this.csvLinter.validation.errors.items
                .concat(this.csvLinter.validation.warnings.items)
                .concat(this.csvLinter.validation.info.items);
        }
    },
    methods: {
        getValidationResultIcon(status) {
            return status === 'true' ? 'check_circle'
                : status === 'false' ? 'disabled_by_default'
                : 'info'
        },
        getBorderStyle(index) {
            return index > 0
                ? 'border-top'
                : '';
        },
        getBGStyle(type) {
            return type === 'Error' ? 'bg-red'
                : type === 'Warning' ? 'bg-orange'
                : type === 'Message' ? 'bg-blue'
                : 'bg-white';
        },
    },
    created() {
        // TODO: API call on MQA cache
    },
    mounted() {},
};
</script>

<style lang="scss" scoped>
.dsd-distribution-quality-csv {
    .heading {
        &-1 {
            font-size: 2rem;
            font-weight: 700;
        }

        &-4 {
            font-size: 1.25rem;
            font-weight: 700;
        }
    }

    .color {
        &-red {
            color: red;
        }

        &-orange {
            color: orange;
        }

        &-blue {
            color: lightblue;
        } 
    }

    .bg {
        &-red {
            background-color: red;
        }

        &-orange {
            background-color: orange;
        }

        &-blue {
            background-color: lightblue;
        } 
    }

    .csv-validation-box {
        color: black; 
        background-color: white;
        border: 2px solid black;
        
        &.true {
            border-color: green;
        }
        &.false {
            border-color: red;
        }

        .material-icons {
            &.true {
                color: green;
            }
            &.false {
                color: red;
            }
        }
    }

    .csv-result-details {  

        &.border {
            &-top {
                border-top: 1px solid grey;
            }
        }

        .tag {
            display: inline-flex;
            align-items: center;
            color: white;
            font-size: 1rem;
            padding: 0.5rem 0.75rem;
            border-radius: 1rem;
            border-width: 0;
            text-decoration: none;
            box-sizing: border-box;
            white-space: nowrap;
        }
    }
}
</style>
