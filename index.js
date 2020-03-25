const apiKey = 'Oyr4VwOuUH1wIQTner8u3i8AxCXaz4L0UH41BCmd';

const baseUrl = 'https://developer.nps.gov/api/v1/parks';

//use header X-Api-Key OR parameter api_key=

function displayResults(responseJson) {
//if responseJson.total===0
        for(let i = 0; i < responseJson.data.length; i++) {
            $('#results-list').append(
                `<li><h3><a href="${responseJson.data[i].url}">
                ${responseJson.data[i].fullName}</a></h3>
                <p>${responseJson.data[i].description}</p>`
            )};
        $('#results').removeClass('hidden');
        
    }

function formatQueryParams(params) {
    const queryItems = Object.keys(params)
    .map(key => `${key}=${params[key]}`);
    return queryItems.join('&');
}

function getStateParks(states, maxResults) {
    const params = {
        api_key: apiKey,
        stateCode: states,
        limit: maxResults
    };

    const queryString = formatQueryParams(params);
    const url = baseUrl + '?' + queryString;

    console.log(url);

    fetch(url)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJson => displayResults(responseJson))
        .catch(err => {
            $('#js-error-message').text(`Something went wrong: ${err.message}`);
        });
}

function watchForm() {
    $('form').submit(event => {
        event.preventDefault();
        $('#js-error-message').empty();
        $('#results').addClass('hidden');
        $('#results-list').empty();
        const states = inputIds();
        const maxResults = $('#js-max-results').val();
        getStateParks(states, maxResults);
    });
}

function newForm() {
    $('#add-state').on('click', function(event) {
        $('.states-form').append(`
            <label class="hidden" for="state-search">Enter a State:</label>
            <input class="js-state-value" type="text" name="state-search" id="js-state-search" placeholder="2 letter abbreviation" required>
        `)
    });
}

function inputIds() {
    $('label[for="state-search"]').each(function(index) {
        $(this).attr("for", `state-search-${index}`);
    });

    $('input[name="state-search"]').each(function(index) {
        $(this).attr("name", `state-search-${index}`);
    });

    $('input[id="js-state-search"]').each(function(index) {
        $(this).attr("id", `js-state-search-${index}`);
    });    

    let stateValue = [];

    const array = $('.js-state-value').each(function() {
        stateValue.push(this.value);
    });

    return stateValue;
}

function runApp() {
    watchForm();
    newForm();
}

$(runApp);

