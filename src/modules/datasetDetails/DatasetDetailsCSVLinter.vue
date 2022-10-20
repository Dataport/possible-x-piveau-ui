<template>
    <!-- CSV Linter -->
    <div class="dsd-distribution-quality-csv row" v-if="showValidation">
        <h4 class="col-12 mt-5 mb-3 font-weight-bold">{{ csvLinter.title }}</h4>
        <div class="col-7">
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
        <div class="col-5">
            <table class="row mt-4">
                <tbody>
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
import { has } from 'lodash';

export default {
    name: 'datasetDetailsCSVLinter',
    dependencies: 'DatasetService',
    props: ['validation'],
    data() {
        return {
            // Dummy data -> replace with CSV Linter results
            csvLinter: {
                title: 'CSV Validation Results',
                validationTitle: {
                    true: 'Valid CSV',
                    false: 'CSV not valid',
                },
                validationDescription: {
                    true: 'However, there are some issues that can be adressed to make it as easy as possible to reuse the data.',
                    false: 'Your CSV file is not valid!',
                },
                validation: {},
            },
        };
    },
    computed: {
        ...mapGetters('datasetDetails', [
            'getDistributions',
        ]),
        showValidation() {
            return has(this.csvLinter, 'validation') 
                && has(this.csvLinter.validation, 'passed') 
                && has(this.csvLinter.validation, 'errors') 
                && has(this.csvLinter.validation, 'warnings') 
                && has(this.csvLinter.validation, 'info');
        },
        distributionIDs() {
            return this.getDistributions.map(d => d.id);
        },
        validationResults() {
            let errors = has(this.csvLinter.validation.errors, 'items') ? this.csvLinter.validation.errors.items : [];
            let warnings = has(this.csvLinter.validation.warnings, 'items') ? this.csvLinter.validation.errors.items : [];
            let info = has(this.csvLinter.validation.info, 'items') ? this.csvLinter.validation.errors.items : [];
            
            errors.forEach(i => i.type = 'Error');
            warnings.forEach(i => i.type = 'Warning');
            info.forEach(i => i.type = 'Message');

            return errors.concat(warnings).concat(info);
        }
    },
    methods: {
        has,
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
        this.csvLinter.validation = this.validation;
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
            color: #DA2131;
        }

        &-orange {
            color: #F29527;
        }

        &-blue {
            color: #4073AF;
        } 
    }

    .bg {
        &-red {
            background-color: #DA2131;
        }

        &-orange {
            background-color: #F29527;
        }

        &-blue {
            background-color: #4073AF;
        } 
    }

    .csv-validation-box {
        color: black; 
        background-color: #FFFFFF;
        border: 2px solid #000000;
        
        &.true {
            border-color: #467A39;
        }
        &.false {
            border-color: #DA2131;
        }

        .material-icons {
            &.true {
                color: #467A39;
            }
            &.false {
                color: #DA2131;
            }
        }
    }

    .csv-result-details {  

        &.border {
            &-top {
                border-top: 1px solid #9F9F9F;
            }
        }

        .tag {
            display: inline-flex;
            align-items: center;
            color: #FFFFFF;
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
