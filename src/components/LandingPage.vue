<template>
    <div class="container">
       <div class="row">
        <div class="col">
            <h1 class="mb-4">Welcome to the POSSIBLE-X Catalogue!</h1>
        </div>
        </div>
    
        <div class="row">
        <div class="col">
            <div class="ps-main-tile ps-base-tile">
                <div class="ps-main-text">
                <h4>Discover a new way of sharing data in a secure and sovereign way!</h4>
                The POSSIBLE-X Catalogue lets you browse through a variety of Service Offerings and Data Service Offerings provided in the POSSIBLE Ecosystem.
        
            </div>
            </div>
        </div>
       </div>


        <div class="row">
            <div class="col-4">
                <div class="ps-tile ps-base-tile">
                        <h4>Service Offerings</h4>
                        Find digital services available for order under Service Offerings, including terms, conditions and detailed information. Providers of the POSSIBLE-X Ecosystem provide these offers.
                </div>
            </div>
            <div class="col-4 ">
                <div class="ps-tile ps-base-tile">
                        <h4>Data Service Offerings</h4>
                        Find services, that provide you with data products under Data Service Offerings. The offerings can be consumed via the Consumer/Provider Portal.

                </div>
            </div>
            <div class="col-4 ">
                <div class="ps-tile ps-base-tile">
                        <h4>Legal Participants</h4>
                        Browse through all official and approved participants of POSSIBLE-X under Legal Participants. This includes background information, such as address and legal registration number.
                </div>
            </div>
        
        </div>

        <div class="row">
        <div class="col">
            <div class="ps-compliance-tile ps-tile ps-base-tile">
                    <h4>Gaia-X Clearing House Integration</h4>
                    All hosted self-descriptions in the POSSIBLE-X Catalogue are digitally signed by a Gaia-X Clearing House. You can see and inspect the signed credential on each detail page by clicking on "Gaia-X Compliance".
                    In addition, the raw JSON-LD representations and signed Verifiable Credentials are accessible. 
              
            </div>
        </div>
       </div>

    </div>
</template>
<script>
export default {
    name: 'LandingPage',
    data() {
        return {};
    },
    methods: {},
};
</script>
<style lang="scss">
.container {
    background-color: red;
}

.ps-base-tile {
    padding: 10px;
    border-radius: 15px;
    margin-bottom: 30px;
}

.ps-tile {
    background-color: #1e2e4d;
    color: #ffffff;
    min-height: 300px;
    padding: 20px;
}
.ps-main-tile {
    background-color: #798190;
    padding: 10px;
    color: #ffffff;
    min-height: 300px;
    background: url('@/assets/img/possible_hero.jpg');
    background-color: rgba(0, 0, 0, 0.5); // Black with 50% opacity
    background-blend-mode: overlay; // Blend the image and the overlay color
}
.ps-main-text {
    width: 50%;
    color: #ffffff;
    padding: 20px;
}
.ps-compliance-tile {
    background-color: #525d74;
    min-height: 300px;
}

</style>
