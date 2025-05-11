const countryList = {
  "USD": "US",
  "INR": "IN",
  "EUR": "EU",
  "GBP": "GB",
  "AUD": "AU",
  "CAD": "CA",
  "JPY": "JP",
  "CNY": "CN",
  "BRL": "BR",
  "CHF": "CH",
  "RUB": "RU",
  "ZAR": "ZA",
  "SAR": "SA",
  "SGD": "SG",
  "NZD": "NZ",
  "MXN": "MX",
  "KRW": "KR"
};

const fromDrop = document.getElementById("from");
const toDrop = document.getElementById("to");
const fromImg = document.getElementById("from-img");
const toImg = document.getElementById("to-img");
const msg = document.getElementById("msg");
const form = document.getElementById("converter-form");
const amountInput = document.getElementById("amount");

// Populate dropdowns
for (let code in countryList) {
  const option1 = document.createElement("option");
  option1.value = code;
  option1.textContent = code;
  fromDrop.appendChild(option1);

  const option2 = document.createElement("option");
  option2.value = code;
  option2.textContent = code;
  toDrop.appendChild(option2);
}

// Set default values
fromDrop.value = "USD";
toDrop.value = "INR";

// Update flag images
function updateFlag(select, img) {
  const countryCode = countryList[select.value];
  img.src = `https://flagsapi.com/${countryCode}/flat/64.png`;
}

fromDrop.addEventListener("change", () => updateFlag(fromDrop, fromImg));
toDrop.addEventListener("change", () => updateFlag(toDrop, toImg));

// Clear previous message on input change
amountInput.addEventListener("input", () => {
  msg.textContent = "";
});

fromDrop.addEventListener("change", () => {
  msg.textContent = ""; // Clear previous message on dropdown change
});
toDrop.addEventListener("change", () => {
  msg.textContent = ""; // Clear previous message on dropdown change
});

// Handle conversion
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const amount = amountInput.value;
  const fromCurr = fromDrop.value;
  const toCurr = toDrop.value;

  // Input validation for numeric values
  if (isNaN(amount) || amount <= 0) {
    msg.textContent = "Please enter a valid positive number for the amount.";
    return;
  }

  const apiKey = '5f497e650a2f270d0e2e0234'; // Your API key

  try {
    // Fetch conversion rate from the API (with the access key)
    const url = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/${fromCurr}`;
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error("Failed to fetch data from the API");
    }

    const data = await res.json();

    if (!data.conversion_rates || !data.conversion_rates[toCurr]) {
      throw new Error("Invalid API response: conversion rates missing");
    }

    // Calculate the result
    const result = (amount * data.conversion_rates[toCurr]).toFixed(2);

    // Display the result
    msg.textContent = `${amount} ${fromCurr} = ${result} ${toCurr}`;
  } catch (error) {
    // Handle errors gracefully
    msg.textContent = "Error fetching exchange rate. Try again later.";
    console.error("Conversion error:", error);
  }
});
