export async function fetchCountry(country) {
    const res = await fetch('https://api.api-ninjas.com/v1/country?name=' + country, {
        headers: { 'X-Api-Key': 'LDrmtmv60gdW6rHuo6noaw==FKIOnp9yPsacdBdT' },
        contentType: 'application/json',
        success: function (result) {
            console.log(result);
        },
    })
    return res.json()
}

export async function fetchCity(city) {
    const res = await fetch('https://api.api-ninjas.com/v1/city?name=' + city, {
        headers: { 'X-Api-Key': 'LDrmtmv60gdW6rHuo6noaw==FKIOnp9yPsacdBdT' },
        contentType: 'application/json',
        success: function (result) {
            console.log(result);
        },
    })

    return res.json()
}