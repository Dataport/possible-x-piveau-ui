<template>
    <div class="container">
       <div class="row">
        <div class="col">
            <h1 class="mb-4">Welcome to the POSSIBLE-X Catalogue!</h1>
        </div>
        </div>
    
        <div class="row">
        <div class="col">
            <div class="ps-main-tile">
                <div class="ps-main-text">
                Discover a new way of sharing data in a secure and sovereign way. Our innovative ecosystem enables organizations and their employees to effortlessly tap into data spaces from different areas while ensuring self-determined handling of their data.
                Take advantage of data space technology and accelerate the development of new solutions and services. 
            </div>
            </div>
        </div>
       </div>


        <div class="row">
            <div class="col-4">
                <div class="ps-tile">
                        <strong>Service Offerings</strong>
                </div>
            </div>
            <div class="col-4 ">
                <div class="ps-tile">
                        <strong>Data Service Offerings</strong>
                </div>
            </div>
            <div class="col-4 ">
                <div class="ps-tile">
                        <strong>Legal Participants</strong>
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
.ps-tile {
    background-color: #1e2e4d;
    padding: 10px;
    color: #ffffff;
    min-height: 300px;
    border-radius: 15px;
}
.ps-main-tile {
    background-color: #798190;
    padding: 10px;
    margin-bottom: 20px;
    color: #ffffff;
    min-height: 300px;
    border-radius: 15px;
    background: url('@/assets/img/possible_hero.jpg');
    background-color: rgba(0, 0, 0, 0.5); // Black with 50% opacity
    background-blend-mode: overlay; // Blend the image and the overlay color
}
.ps-main-text {
    width: 50%;
    color: #ffffff;
    padding: 20px;
}
</style>
