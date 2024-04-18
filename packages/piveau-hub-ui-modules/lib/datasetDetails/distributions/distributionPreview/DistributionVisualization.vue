<template>
    <div class="dsd-item preview-container">
        <h2 class=" mb-lg-4 mt-lg-4"
            data-toggle="tooltip"
            data-placement="top"
            data-cy="dataset-distribution-preview"
        >
        <!-- TODO: translate! -->
            Preview 
        </h2>
        <!-- <h2>Visual box - {{ distributionTitle }}</h2> -->
        <!-- Card -->
        <div v-if="this.jsonData" class="dv-card card text-center">
            <div class="dv-card-header card-header">
                <ul class="dv-nav-tabs nav nav-tabs card-header-tabs">
                    <li class="nav-item" role="tab" :aria-controls="'numerical-chart'"
                    :aria-selected="activeTab === 'numerical'" aria-label="Numerical chart tab">
                        <a class="nav-link" :class="{active: activeTab === 'numerical'}" href="#" @click.prevent="showTab('numerical')">Numerical Data</a>
                    </li>
                    <li class="nav-item" role="tab" :aria-controls="'categorical-chart'"
                    :aria-selected="activeTab === 'categorical'" aria-label="Categorical chart tab">
                        <a class="nav-link" :class="{active: activeTab === 'categorical'}" href="#" @click.prevent="showTab('categorical')">Categorical Data</a>
                    </li>
                    <li class="nav-item" role="tab" :aria-controls="'table-view'"
                    :aria-selected="activeTab === 'table-view'" aria-label="Table view tab">
                        <a class="nav-link" :class="{active: activeTab === 'table-view'}" href="#" @click.prevent="showTab('table-view')">Table View</a>
                    </li>
                </ul>
            </div>
            <div class="card-body">
                {{ addData() }}
                <!-- Tab for Numerical Charts -->
                <div v-if="activeTab == 'numerical'" role="tabpanel" id="numerical-chart">
                    <div v-if="showNumTabContent">
                        <div> 
                            <div class="d-flex justify-content-between">
                                <div class="mb-2 d-flex">

                                    <div class="mr-3 d-flex flex-column align-items-start">                                        
                                        <distribution-preview-select-header title="Labels" :tooltip-text="' '" :labels="categoricalLabels" :defaultLabel="xPicked" @updatePicked="(label) => this.xPicked = label"></distribution-preview-select-header>
                                    </div>
                                    <div class="d-flex flex-column align-items-start">
                                        <distribution-preview-select-header title="Values" :tooltip-text="' '" :labels="numericalLabels" :multiSelect="true" :defaultLabel="yPicked" @updatePicked="updateYPicked"></distribution-preview-select-header>
                                    </div>
                                    <!-- <button class="btn dv-add-btn" type="button" @click="toggleDropdown">+ add multiple values</button> -->

                                </div>                            
                                <div class="d-flex flex-column align-items-start">
                                    <distribution-preview-select-header title="Chart type" :tooltip-text="' '" :labels="viewOptions.map(e => e.label)" :defaultLabel="viewType" @updatePicked="(label) => {this.viewType = label}"></distribution-preview-select-header>
                                </div>
                            </div>
                            <div class="d-flex justify-content-start">
                                <!-- <span>
                                    <small>Add chart: </small>
                                    <select v-model="yNewPicked" ref="yNewPicked" class="form-select" aria-label="select Y coerdinator">
                                        <option disabled value="">select chart to add</option>
                                        <option v-for="(value, index) in numericalLabels" :key="index" :value="value">{{ value }}</option>
                                    </select>
                                </span>
                                <button :disabled="!yNewPicked"
                                        :class="{disabled: !yNewPicked}"
                                        class="btn btn-light btn-sm"
                                        @click="addSelectedChart" 
                                        >
                                        add chart
                                </button> -->
                                <!-- <button v-if="this.datasets.length > 1"
                                        class="btn btn-light btn-sm"
                                        @click="removeLastChart" 
                                        >
                                        remove chart
                                </button> -->
                                <!-- <button
                                    class="btn btn-light btn-sm"
                                    @click="hideXLabels = !hideXLabels" 
                                    >
                                    {{  hideXLabels ? 'show labels' : 'hide labels' }}
                                </button> --> 
                            </div>
                        </div>
                        <!-- <bar-chart v-if="viewType.toLowerCase() === 'bar'" :chartData="this.datacollection" :chartOptions="this.options"></bar-chart>
                        <line-chart v-else-if="viewType.toLowerCase() === 'line'" :chartData="this.datacollection" :chartOptions="this.options" @remove-chart="removeChart"></line-chart>
                        <pie-chart v-else-if="viewType.toLowerCase() === 'pie'" :chartData="this.datacollection" :chartOptions="this.options"></pie-chart>
                        <doughnut-chart v-else-if="viewType.toLowerCase() === 'doughnut'" :chartData="this.datacollection" :chartOptions="this.options"></doughnut-chart> -->
                    </div>
                    <div v-else class="m-5">No numerical data to show.</div>
                </div>
                <!-- Tab for Categorical Charts -->
                <div v-else-if="activeTab == 'categorical'" role="tabpanel" id="categorical-chart">
                    <div v-if="showCatTabContent">
                        <div > 
                            <div class="d-flex justify-content-between mb-2">
                                <distribution-preview-select-header title="Labels" :tooltip-text="' '" :labels="categoricalLabels" :defaultLabel="catYPicked" @updatePicked="(label) => this.catYPicked = label"></distribution-preview-select-header>
                                <distribution-preview-select-header title="Chart type" :tooltip-text="' '" :labels="catViewOptions.map(e => e.label)" :defaultLabel="catViewType" @updatePicked="(label) => {this.catViewType = label}"></distribution-preview-select-header>
                            </div>

                            <!-- <span>Chart type: </span>
                            <select v-model="catViewType" class="form-select" aria-label="Default select example">
                                <option v-for="viewOption in catViewOptions" :value="viewOption.value" :key="viewOption.value">{{ viewOption.label }} </option>
                            </select>
                            <br>
                            <small>Labels: </small>
                            <select v-model="catYPicked" class="" aria-label="select a view option">
                                <option v-for="(value, index) in categoricalLabels" :key="index" :value="value">{{ value }}</option>
                            </select> -->
                            
                        </div>
                        <!-- <bar-chart v-if="catViewType.toLowerCase() === 'bar'" :chartData="this.catDatacollection" :chartOptions="this.options"></bar-chart>
                        <line-chart v-else-if="catViewType.toLowerCase() === 'line'" :chartData="this.catDatacollection" :chartOptions="this.options" @remove-chart="removeChart"></line-chart>
                        <pie-chart v-else-if="catViewType.toLowerCase() === 'pie'" :chartData="this.catDatacollection" :chartOptions="this.options"></pie-chart>
                        <doughnut-chart v-else-if="catViewType.toLowerCase() === 'doughnut'" :chartData="this.catDatacollection" :chartOptions="this.options"></doughnut-chart> -->
                    </div>
                    <div v-else>
                        No categorical data to show.
                    </div>
                </div>
                <!-- Tab for Table View -->
                <div v-show="activeTab == 'table-view'" role="tabpanel" id="table-view">
                    <!-- <div class="table-wrapper">
                        <v-table 
                                class="dist-table"
                                :data="dataRows"
                                :currentPage.sync="currentPage"
                                :pageSize="11"
                                @totalPagesChanged="totalPages = $event">
                            <thead slot="head">
                                <v-th v-for="(label, index) in allLabels" :key="index" :sortKey="label">{{ label }}</v-th>
                            </thead>
                            <tbody slot="body" slot-scope="{displayData}">
                                <tr v-for="row in displayData" :key="row.id">
                                <td v-for="(rowValue, index) in Object.values(row)" :key="row.id + '-' + index" > {{ rowValue }} </td>
                                </tr>
                            </tbody>
                        </v-table>
                    </div>
                    <smart-pagination
                        :currentPage.sync="currentPage"
                        :totalPages="totalPages"
                        :maxPageLinks="10"
                        :boundaryLinks="true"
                    /> -->
                </div>  
            </div>
        </div>
        
        <!-- Feedback Tool -->
        <br> 
        <div class="d-flex justify-content-between align-items-center">
            <small class="text-muted">
                Don't like the default view? suggest a better one <span @click="showFeedbackTool = !showFeedbackTool" class="text-primary pointer" type="button">here</span> 
            </small>
            
            <!-- Records range bar -->
            <div class="dv-records-range-container text-center">
                <small class="dv-records-range-container-record-number mr-1">{{ this.dataRows.length }} Records</small>
                <small v-if="activeTab === 'numerical'">
                    <label for="from">show records from</label>
                    <input @change="updateRange" type="number" id="from" v-model.number="fromIndex" min="1">
                    <label for="to">-</label>
                    <input @change="updateRange" type="number" id="to" v-model.number="toIndex" :min="fromIndex" :max="this.dataRows.length">
                </small>
            </div>
        </div>

        <div v-if="showFeedbackTool" class="feedback-tool-wrapper">
            <form v-if="showFeedbackForm" action="" class="feedback-tool-form" @submit.prevent>
                <span>Suggest a Chart type and/or Labels and Values to be set as default: </span>

                <div class="d-flex dv-fb-options py-3">
                    <distribution-preview-select-header title="Chart type" :labels="allChartOptions"  :updatePicked="() => {console.log('todo')}"></distribution-preview-select-header>
                    <distribution-preview-select-header title="Labels" :labels="allLabels" :updatePicked="() => {console.log('todo')}"></distribution-preview-select-header>
                    <distribution-preview-select-header title="Values" :labels="allLabels" :updatePicked="() => {console.log('todo')}"></distribution-preview-select-header>
                </div>
                <!-- <br><br>
                <label for="view-type">View type:</label>
                <select id="view-type" class="form-select" v-model="suggestedViewType" aria-label="select a view option" required>
                    <option disabled value="">Please select type</option>
                    <option value="num-view">Numerical View</option>
                    <option value="cat-view">Categorical View</option>
                    <option value="tabular-view">Tabular View</option>
                </select>
                <br>
                <div v-if="suggestedViewType == 'num-view'">
                    <label for="x-label">Label for X-axis:</label>
                    <select id="x-label" v-model="suggestedX" aria-label="select X coerdinator">
                        <option disabled value="">select default X-axis</option>
                        <option v-for="(value, index) in allLabels" :key="index" :value="value">{{ value }}</option>
                    </select>
                    <br>
                    <label for="y-label">Label for Y-axis:</label>
                    <select id="y-label" v-model="suggestedY" aria-label="select Y coerdinator">
                        <option disabled value="">select default Y-axis</option>
                        <option v-for="(value, index) in allLabels" :key="index" :value="value">{{ value }}</option>
                    </select>
                </div>
                <div v-else-if="suggestedViewType == 'cat-view'">
                    <label for="cat-label">Label for Categorical View:</label>
                    <select id="cat-label" v-model="suggestedX" aria-label="select X coerdinator">
                        <option disabled value="">select default categorical label</option>
                        <option v-for="(value, index) in categoricalLabels" :key="index" :value="value">{{ value }}</option>
                    </select>
                </div> -->
                <br>
                <input @click="showFeedbackTool = false" class="btn btn-outline-dark mr-2 mb-1" type="button" value="Cancel">
                <input @click="submitFeedbackInput" class="btn btn-primary mb-1" type="button" value="Submit">
            </form>
            <div v-else class="text-center m-5">
                Thank you for your feedback!
            </div>
        </div>
    </div>
</template>

<script>

    // import BarChart from "../../../charts/BarChart";
    // import LineChart from '../../../charts/LineChart.vue';
    // import DoughnutChart from '../../../charts/DoughnutChart.vue';
    // import PieChart from '../../../charts/PieChart.vue';
    import DistributionPreviewSelectHeader from './DistributionPreviewSelectHeader.vue';

    export default {
        name: "distributionVisualization",
        components: {
            // BarChart,
            // LineChart,
            // DoughnutChart,
            // PieChart,
            DistributionPreviewSelectHeader,
        },
        data() {
            return {
                // print: false,
                jsonData: null,
                activeTab: '',
                xLabel: null,
                allLabels: [],
                categoricalLabels: [],
                numericalLabels: [],
                xList: [],
                yList: [],
                fromIndex: 1,
                toIndex: null,
                viewOptions: [
                    { value: "Bar", label:"Bar" },
                    { value: "Line", label:"Line" },
                ],
                showNumTabContent: true,
                chartValues: [],
                chartLabels: [],
                viewType: '',
                xPicked: '',
                yPicked: '',
                yNewPicked: '',
                yNewValues: [],
                xLabels: [],
                yValues: [],
                datacollection: {},
                datasets: [],  // dataRows, label, backgroundColor
                dataRows: [],  // only the data arrays
                hideXLabels: false,

                catViewOptions: [
                    { value: "Bar", label:"Bar" },
                    // { value: "Pie", label:"Pie" },
                    // { value: "Line", label:"Line" },
                    { value: "Doughnut", label:"Doughnut" }
                ], 
                showCatTabContent: true,
                nCatToShow: 100, // 
                catChartValues: [],
                catYValues: [],
                catViewType: '',
                catYPicked: '', // only Y, because X will be automatically generated from the categories of Y
                catDatacollection: {},
                catDatasets: [],  // dataRows, label, backgroundColor

                categorizedData: [],
                skipFactor: 1,
                currentPage: 1,
                totalPages: 0,
                showFeedbackTool: false,
                showFeedbackForm: true,
                showAlert: false,
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    scales: {
                        yAxes: {
                            beginAtZero: false
                        },
                        x: {
                            ticks: {
                                maxTicksLimit: 20,
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            onClick: (e, legendItem) => {
                                // this.removeChart(legendItem.text)
                            },
                            display: true,
                            labels: {
                                borderRadius: 10,
                                useBorderRadius: true,
                                pointStyle: 'circle',
                                usePointStyle: true,
                                padding: 20,
                            }
                        }
                    }
                },
                // Feedback tool
                allChartOptions: ['Line', 'Bar', 'Pie', 'Doughnut'],
                suggestedViewType: '',
                suggestedX: '',
                suggestedY: '',
            }
        },
        props: {
            distributionTitle: String
        },
        mounted() {
        // Einlesen
        fetch("/test_json_6.json")
        .then(response => {
                const reader = response.body.getReader();
                return new ReadableStream({
                    start(controller) {
                        function push() {
                            reader.read().then(({ done, value }) => {
                                if (done) {
                                    controller.close();
                                    return;
                                }
                                controller.enqueue(value);
                                push();
                            });
                        }
                        push();
                    }
                });
            })
            .then(stream => new Response(stream))
            .then(res => res.json())
            .then(data => (this.jsonData = data))
            .catch(err => console.log(err.message));
        },
        methods: {
            showTab(tabName) {
                this.activeTab = tabName;
            },
            // Once the JSON record is fetched, this method is called to fill all the data() fields with the necessary data
            addData() {
                this.activeTab = this.activeTab ? this.activeTab : this.jsonData.default_view_options.default_view;
                this.allLabels = this.jsonData.labels.all_labels;
                this.numericalLabels = this.jsonData.labels.numerical_labels;
                if (this.numericalLabels.length == 0) this.showNumTabContent = false;
                this.categoricalLabels = this.jsonData.labels.categorical_labels;
                if (this.categoricalLabels.length == 0) {
                    this.showCatTabContent = false;
                    // this.showXLabels = false;
                }
                this.xList = this.jsonData.labels.categorical_labels;
                this.yList = this.jsonData.labels.numerical_labels;
                // this.xPicked = this.xPicked ? this.xPicked : ( localStorage.xPicked ? localStorage.xPicked : this.jsonData.default_axes.x );
                // this.yPicked = this.yPicked ? this.yPicked : ( localStorage.yPicked ? localStorage.yPicked : this.jsonData.default_axes.y );
                // this.viewType = this.viewType ? this.viewType : ( localStorage.viewType ? localStorage.viewType : this.jsonData.default_chart_type );
                this.viewType = this.viewType ? this.viewType : this.jsonData.default_view_options.default_numerical_view;
                this.xPicked = this.xPicked ? this.xPicked : this.jsonData.default_view_options.default_axes.numerical_chart.x;
                this.yPicked = this.yPicked ? this.yPicked : this.jsonData.default_view_options.default_axes.numerical_chart.y;

                this.catViewType = this.catViewType ? this.catViewType : this.jsonData.default_view_options.default_categorical_view;
                this.catYPicked = this.catYPicked ? this.catYPicked : this.jsonData.default_view_options.default_axes.categorical_chart;
                this.dataRows = this.jsonData.data; // this line can take time
                if (!this.toIndex) this.toIndex = this.dataRows.length < 100 ? this.dataRows.length : 100;
                this.categorizedData = this.jsonData.categorized;
                this.skipFactor = this.calculateSkipFactor(this.dataRows.length, this.desiredPoints);
            },
            fillNumPlotData() {
                // In case there are no assigned lables, create empty lables (chart.js needs an array of lables, otherwise empty chart will display)
                if (this.xLabels.length === 0 || this.hideXLabels) {
                    let emptyValues = Array(this.datasets[0].data.length).fill('');
                
                    this.datacollection = {
                        labels: emptyValues,
                        datasets: structuredClone(this.datasets),
                };
                }

                else {
                    this.datacollection = {
                            labels: this.xLabels,
                            datasets: structuredClone(this.datasets),
                    };
                }

            },
            fillCatPlotData() {
                this.catChartValues = Object.keys(this.categorizedData.find(e => e.column === this.catYPicked).categories).slice(0, this.nCatToShow) // get array of all category names of yPicked
                this.catYValues = Object.values(this.categorizedData.find(e => e.column === this.catYPicked).categories).slice(0, this.nCatToShow) // get array of all category counts of yPicked
                this.catDatasets[0] =
                    {
                        label: this.catYPicked,
                        data: this.catYValues,
                        backgroundColor: this.catYValues.map(() => this.randomColor()), 
                    },
                this.catDatacollection = {
                        labels: this.catChartValues,
                        datasets: structuredClone(this.catDatasets).slice(0, this.nCatToShow),
                };
            },
            updateRange() {
                // console.log('firing updateRange()')
                this.datasets[0].data = this.yValues.slice(this.fromIndex-1, this.toIndex);
                // for (const dataset of this.datasets) {
                //     dataset.data = this.yValues.slice(this.fromIndex-1, this.toIndex);
                // }
                this.xLabels = this.chartLabels.slice(this.fromIndex-1, this.toIndex);
                // console.log(this.chartLabels)
                this.fillNumPlotData();
            },
            updateYPicked(label){
                // this.yPicked = label
                console.log(this.datasets.map(e => e.label))
                if (this.datasets.map(e => e.label).includes(label)) {
                    console.log('label exists already')
                    this.removeChart(label)
                }
                else {
                    console.log('label doesnt exist')
                    this.yNewPicked = label
                    this.addSelectedChart()
                }
            },
            // TODO: fix bug: changing range after adding a new chart doesn't update data (.slice() will not be rendered)
            addSelectedChart() {
                // this.chartValues = this.dataRows.map(e => e[this.yNewPicked])
                this.chartValues = this.dataRows.map(e => e[this.yNewPicked])
                this.yNewValues = this.chartValues;
                const randomColor = this.randomColor();
                this.datasets.push(
                    {
                        label: this.yNewPicked,
                        data: this.yNewValues.slice(this.fromIndex-1, this.toIndex),
                        backgroundColor: randomColor, 
                        borderColor: randomColor,
                        borderWidth: 1,
                    },
                )
                this.fillNumPlotData();
            },
            removeChart(label){
                console.log(label)
                this.datasets = this.datasets.filter(o => o.label !== label)
                console.log('datasets after', this.datasets)
                this.fillNumPlotData();
            },
            randomColor() {
            const letters = '0123456789ABCDEF';
            let color = '#';
            for (let i = 0; i < 6; i++) {
                color += letters[Math.floor(Math.random() * 16)];
            }
            return color;
            },
            submitFeedbackInput() {
                // TODO implement feedback-tool logic
                // if(this.suggestedViewType) localStorage.viewType = this.suggestedViewType;
                // if(this.suggestedX) localStorage.xPicked = this.suggestedX;
                // if(this.suggestedY) localStorage.yPicked = this.suggestedY;
                localStorage.viewType = '';
                localStorage.xPicked = '';
                localStorage.yPicked = '';
                console.log('Selected View Type: ', this.suggestedViewType);
                this.showFeedbackForm = false;

                // TODO: only if successful
                // this.showAlert = true;
            },
            calculateSkipFactor(totalPoints) {
                const desiredPoints = 50;
                if (totalPoints <= desiredPoints) {
                    return 1; // No downsampling needed
                }

                const skipFactor = Math.ceil(totalPoints / desiredPoints);
                return skipFactor;
            },
            // downsampleData(data, skipFactor) {
            //     return data.filter((point, index) => index % skipFactor === 0);
            // },
            // testLogger(smth) {
            //     console.log("something: ", smth)
            // }
        },
        watch: {
            chartData() {
            this.$data._chart.update();
            },
            xPicked() {
                this.$emit("input", this.xPicked);
                this.chartLabels = this.dataRows.map(e => e[this.xPicked]).slice(this.fromIndex-1, this.toIndex)
                this.xLabels = this.chartLabels;
                this.fillNumPlotData();
            },
            yPicked() {
                this.$emit("input", this.yPicked);
                this.chartValues = this.dataRows.map(e => e[this.yPicked]).slice(this.fromIndex-1, this.toIndex)
                this.yValues = this.chartValues;
                const randomColor = this.randomColor();
                this.datasets[0] =
                    {
                        label: this.yPicked,
                        data: this.yValues,
                        backgroundColor: randomColor, 
                        borderColor: randomColor,
                        borderWidth: 1,
                    },
                
                this.fillNumPlotData();
            },
            hideXLabels() {
                this.fillNumPlotData();
            },
            catViewType() {
                if (this.catViewType === 'Pie') this.nCatToShow = 20;
                else if (this.catViewType === 'Bar') this.nCatToShow = 50;
                else if (this.catViewType === 'Line') this.nCatToShow = 100;
                // this.$emit("input", this.catYPicked);
                this.fillCatPlotData();
            },
            catYPicked() {
                this.$emit("input", this.catYPicked);
                this.fillCatPlotData();
            },
        }
    }

</script>

<style lang="scss" scoped>

    .preview-container {
        /* padding: 3px; */
        /* border-bottom: 1px solid gray;
        border-top: 1px solid gray; */
        max-width: 100%;
        overflow: auto;
    }

    .preview-container .card-header {
        background-color: transparent;
    }

    .preview-container .card {
        border: none;
    }

    .dv-nav-tabs li .nav-link{
        color: inherit;
        &.active {
            // background-color: oldlace;
            font-weight: bold;
            color: var(--primary-light);
            border-top: 4px solid var(--primary-light);
        }
        &:hover:not(.active) {
            border-color: transparent;
        }
    }

    .dv-add-btn {
        height: 48px;
        align-self: end;
        background-color: var(--primary-light);
        color: white;

        &:hover {
            color: white;
        }
    }

    .dv-records-range-container input {
        text-align: center;
        width: 50px;
    }

    .dv-records-range-container-record-number {
        background-color: #f0efed;
        border-radius: 5px;
        padding: 10px 15px;
        font-weight: 650;
    }

    .dv-records-range-container small label {
        padding: 0 5px;
    }

    select {
        margin: 5px 2px;
        width: 200px
    }

    .table-wrapper {
        overflow-x: auto;
    }

    .dist-table {
        margin: 15px 0;
        /* margin-right: 15px; */
    }

    td, th {
        border: 1px solid #dfe2e5;
        padding: 0.6em 1em;
    }

    tr:nth-child(2n) {
        background-color: #f6f8fa;
    }

    .vt-sort:before{
        font-family: FontAwesome;
        padding-right: 0.5em;
        width: 1.28571429em;
        display: inline-block;
        text-align: center;
    }

    .vt-sortable:before{
        content: "\f0dc";
    }

    .vt-asc:before{
        content: "\f160";
    }

    .vt-desc:before{
        content: "\f161";
    }

    .feedback-tool-wrapper {
        padding: 5px 15px;
        margin: 15px 0;
        background-color: #f6f8fa;
        border: 1px solid #f6f8fa;
        border-radius: 5px;
    }
</style>