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
        <div v-if="this.jsonData" class="card text-center">
            <div class="card-header">
                <ul class="nav nav-tabs card-header-tabs">
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
                            <span>Chart type: </span>
                            <select v-model="viewType" class="form-select" aria-label="Default select example">
                                <!-- <option selected>Select the Y axe</option> -->
                                <option v-for="viewOption in viewOptions" :value="viewOption.value" :key="viewOption.value">{{ viewOption.label }} </option>
                            </select>
                            <div class="data-range-container">
                                (#Records: {{ this.dataRows.length }}) Show records
                                <label for="from">from:</label>
                                <input @change="updateRange" type="number" id="from" v-model.number="fromIndex" min="1">
                                <label for="to">to:</label>
                                <input @change="updateRange" type="number" id="to" v-model.number="toIndex" :min="fromIndex" :max="this.dataRows.length">
                            </div>
                            <small>Labels: </small>
                            <select v-model="xPicked" class="" aria-label="select a view option">
                                <!-- <option selected>Select the X axe</option> -->
                                <option v-for="(value, index) in categoricalLabels" :key="index" :value="value">{{ value }}</option>
                            </select>
                            <small>Values: </small>
                            <select v-model="yPicked" class="form-select" aria-label="select X coerdinator">
                                <!-- <option selected>Select the Y axe</option> -->
                                <option v-for="(value, index) in numericalLabels" :key="index" :value="value">{{ value }}</option>
                            </select>
                            <span>
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
                            </button>
                            <button v-if="this.datasets.length > 1"
                                    class="btn btn-light btn-sm"
                                    @click="removeLastChart" 
                                    >
                                    remove chart
                            </button>
                            <button
                                    class="btn btn-light btn-sm"
                                    @click="hideXLabels = !hideXLabels" 
                                    >
                                    {{  hideXLabels ? 'show labels' : 'hide labels' }}
                            </button>
                        </div>
                        <bar-chart v-if="viewType === 'bar'" :chartData="this.datacollection" :chartOptions="this.options"></bar-chart>
                        <line-chart v-else-if="viewType === 'line'" :chartData="this.datacollection" :chartOptions="this.options"></line-chart>
                        <pie-chart v-else-if="viewType === 'pie'" :chartData="this.datacollection" :chartOptions="this.options"></pie-chart>
                        <doughnut-chart v-else-if="viewType === 'doughnut'" :chartData="this.datacollection" :chartOptions="this.options"></doughnut-chart>
                    </div>
                    <div v-else><emp>No numerical data to show.</emp></div>
                </div>
                <!-- Tab for Categorical Charts -->
                <div v-else-if="activeTab == 'categorical'" role="tabpanel" id="categorical-chart">
                    <div v-if="showCatTabContent">
                        <div > 
                            <span>Chart type: </span>
                            <select v-model="catViewType" class="form-select" aria-label="Default select example">
                                <!-- <option selected>Select the Y axe</option> -->
                                <option v-for="viewOption in catViewOptions" :value="viewOption.value" :key="viewOption.value">{{ viewOption.label }} </option>
                            </select>
                            <br>
                            <small>Labels: </small>
                            <select v-model="catYPicked" class="" aria-label="select a view option">
                                <!-- <option selected>Select the X axe</option> -->
                                <option v-for="(value, index) in categoricalLabels" :key="index" :value="value">{{ value }}</option>
                            </select>
                        </div>
                        <bar-chart v-if="catViewType === 'bar'" :chartData="this.catDatacollection" :chartOptions="this.options"></bar-chart>
                        <line-chart v-else-if="catViewType === 'line'" :chartData="this.catDatacollection" :chartOptions="this.options"></line-chart>
                        <pie-chart v-else-if="catViewType === 'pie'" :chartData="this.catDatacollection" :chartOptions="this.options"></pie-chart>
                        <doughnut-chart v-else-if="catViewType === 'doughnut'" :chartData="this.catDatacollection" :chartOptions="this.options"></doughnut-chart>
                    </div>
                    <div v-else>
                        No categorical data to show.
                    </div>
                </div>
                <!-- Tab for Table View -->
                <div v-show="activeTab == 'table-view'" role="tabpanel" id="table-view">
                    <div class="table-wrapper">
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
                    />
                </div>
                
            </div>
        </div>
        
        <!-- Feedback Tool -->
        <br>
        <small class="text-muted">
            Don't like the default view? suggest a better one <span @click="showFeedbackTool = !showFeedbackTool" class="text-primary pointer" type="button">here</span> 
        </small>
        <div v-if="showFeedbackTool" class="feedback-tool-wrapper">
            <form action="" class="feedback-tool-form">
                <span>Suggest a view type and graph-indicators to be set as default: </span>
                <br><br>
                <label for="view-type">View type:</label>
                <select id="view-type" class="form-select" v-model="suggestedViewType" aria-label="select a view option" required>
                    <!-- <option selected disabled hidden>Choose here</option> -->
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
                    <label for="y-label">Label for X-axis:</label>
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
                </div>
                <br>
                <input @click="submitFeedbackInput" class="btn btn-primary btn-sm" type="button" value="Submit">
            </form>
        </div>
        <div v-if="showAlert" class="alert alert-success" role="alert">
            Your suggestions were submit successfully!
        </div>
    </div>
</template>

<script>

    import BarChart from "../../charts/barChart.vue";
    import LineChart from '../../charts/LineChart.vue';
    import DoughnutChart from '../../charts/DoughnutChart.vue'
    import PieChart from '../../charts/PieChart.vue'

    export default {
        name: "distributionPreview",
        components: {
            BarChart,
            LineChart,
            DoughnutChart,
            PieChart,
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
                    { value: "bar", label:"Bar Chart" },
                    { value: "line", label:"Line Chart" },
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
                // downsampledData: [],
                hideXLabels: false,

                catViewOptions: [
                    { value: "bar", label:"Bar Chart" },
                    // { value: "pie", label:"Pie Chart" },
                    // { value: "line", label:"Line Chart" },
                    { value: "doughnut", label:"Doughnut Chart" }
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
                showAlert: false,
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    scales: {
                        yAxes: {
                            beginAtZero: false
                        },
                    },
                },
                // Feedback tool
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
        fetch("/test_json_7.json")
        // fetch("/expanded_json_16.json")
        // fetch("/expanded_json_16_shorted.json")
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
                // this.downsampledData = this.downsampleData(this.dataRows, this.skipFactor);
                // this.downsampledData = this.dataRows;  // (testing) ignore downsampling and replace it with ranged data
                // TODO: replace downsampledData with dataRows
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
                console.log('firing updateRange()')
                this.datasets[0].data = this.yValues.slice(this.fromIndex-1, this.toIndex);
                // for (const dataset of this.datasets) {
                //     dataset.data = this.yValues.slice(this.fromIndex-1, this.toIndex);
                // }
                this.xLabels = this.chartLabels.slice(this.fromIndex-1, this.toIndex);
                console.log(this.chartLabels)
                this.fillNumPlotData();
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
            removeLastChart() {
                if (this.datasets.length > 1) {
                    this.datasets.pop();
                    this.fillNumPlotData();
                }
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
                this.showFeedbackTool = false;

                // TODO: only if successful
                this.showAlert = true;
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
                if (this.catViewType === 'pie') this.nCatToShow = 20;
                else if (this.catViewType === 'bar') this.nCatToShow = 50;
                else if (this.catViewType === 'line') this.nCatToShow = 100;
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

<style lang="css" scoped>

    .preview-container {
        /* padding: 3px; */
        /* border-bottom: 1px solid gray;
        border-top: 1px solid gray; */
        max-width: 100%;
        overflow: auto;
    }

    .data-range-container input {
        width: 75px;
    }

    select {
        margin: 5px 2px;
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