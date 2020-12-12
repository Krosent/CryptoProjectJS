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
    bin1Block.style.display = "none";
    unsubscribeOnUpdates();
}