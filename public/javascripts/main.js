function displayBidsOnClicked() {
    const mainBlock = document.getElementById("mainBlock");
    mainBlock.style.display = "none";
    const bin1Block = document.getElementById("currencyBidBlock");
    bin1Block.style.display = "block";
    subscribeOnUpdates();
}

function returnHome() {
    const mainBlock = document.getElementById("mainBlock");
    mainBlock.style.display = "block";
    const bin1Block = document.getElementById("currencyBidBlock");
    const evolutionBlock = document.getElementById("currencyPriceEvolutionBlock");

    if(bin1Block.style.display !== "none") {
        bin1Block.style.display = "none";
        unsubscribeOnUpdates();
    } else if(evolutionBlock.style.display !== "none") {
        evolutionBlock.style.display = "none";
        // implement  further.
    }
}

function priceEvolutionOnClicked() { 
    const mainBlock = document.getElementById("mainBlock");
    mainBlock.style.display = "none";
    const evolutionBlock = document.getElementById("currencyPriceEvolutionBlock");
    evolutionBlock.style.display = "block";
    initChart();
}