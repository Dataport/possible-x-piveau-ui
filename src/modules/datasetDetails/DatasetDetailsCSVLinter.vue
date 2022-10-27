<template>
    <!-- CSV Linter -->
    <div class="dsd-distribution-quality-csv row" v-if="showValidation">
        <h4 class="col-12 mt-5 mb-3 font-weight-bold">{{ csvLinter.title }}</h4>
        <div class="col-7">
            <div class="p-3 csv-validation-box" 
                :class="getValidationStatus(validation.passed)">
                <div class="row mt-2">  
                    <div class="col-1 mt-4">
                        <i class="material-icons" :class="getValidationStatus(validation.passed)">
                            {{ getValidationResultIcon(validation.passed) }}
                        </i>
                    </div>
                    <div class="col-11">
                        <h5 class="font-weight-bold">{{ csvLinter.validationTitle[validation.passed] }}</h5>
                        <p>{{ csvLinter.validationDescription[validation.passed] }}</p>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-5">
            <table class="row mt-4">
                <tbody>
                    <tr>
                        <td class="col-12 text-center heading-1 color-red">{{ validationCount['errors'] }}</td>
                        <td class="col-12 text-center heading-1 color-orange">{{ validationCount['warnings'] }}</td>
                        <td class="col-12 text-center heading-1 color-blue">{{ validationCount['infos'] }}</td>
                    </tr>
                    <tr>
                        <td class="col-12 text-center heading-4 color-red">Errors</td>
                        <td class="col-12 text-center heading-4 color-orange">Warnings</td>
                        <td class="col-12 text-center heading-4 color-blue">Messages</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <span class="col-12 mt-3">Total Rows Processed: <strong>{{ validation.rowCount }}</strong></span>
        <div class="col-12 csv-result-details" :class="getBorderStyle(index)" v-for="(csvResult, index) in validationResults" :key="index">
            <div class="my-4 px-5 tag" :class="getBGStyle(csvResult.type)">{{ csvResult.type }}</div>
            <h5 class="font-weight-bold">{{ csvResult.message_header }}</h5>
            <p>{{ csvResult.message }}</p>
        </div>
    </div>
</template>
  
<script>
import { has, isNil } from 'lodash';

export default {
    name: 'datasetDetailsCSVLinter',
    dependencies: 'DatasetService',
    props: ['validation'],
    data() {
        return {
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
            },
        };
    },
    computed: {
        showValidation() {
            return !isNil(this.validation) 
                && has(this.validation, 'passed') 
                && has(this.validation, 'errors') 
                && has(this.validation, 'warnings') 
                && has(this.validation, 'infos');
        },
        validationResults() {
            let errors = has(this.validation.errors, 'items') ? this.validation.errors.items : [];
            let warnings = has(this.validation.warnings, 'items') ? this.validation.warnings.items : [];
            let infos = has(this.validation.infos, 'items') ? this.validation.infos.items : [];
            
            errors.forEach(i => i.type = 'Error');
            warnings.forEach(i => i.type = 'Warning');
            infos.forEach(i => i.type = 'Message');

            return errors.concat(warnings).concat(infos);
        },
        validationCount() {
            let errors = has(this.validation.errors, 'count') ? this.validation.errors.count : 0;
            let warnings = has(this.validation.warnings, 'count') ? this.validation.warnings.count : 0;
            let infos = has(this.validation.infos, 'count') ? this.validation.infos.count : 0;

            return {
                errors,
                warnings,
                infos,
            };
        },
    },
    methods: {
        has,
        isNil,
        getValidationResultIcon(status) {
            return status === true ? 'check_circle'
                : status === false ? 'disabled_by_default'
                : 'info'
        },
        getValidationStatus(status) {
            return status === true ? 'success'
                : status === false ? 'error'
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
        
        &.success {
            border-color: #467A39;
        }
        &.error {
            border-color: #DA2131;
        }

        .material-icons {
            &.success {
                color: #467A39;
            }
            &.error {
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
