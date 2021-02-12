const searchBar = document.querySelector(".header__search-bar");
const searchFilters = document.querySelector(".header__filters");
const clearBtn = document.querySelector(".header__clear");
const spacing = document.querySelector(".spacing");
const jobContainer = document.querySelector(".container");
let selectedFilters = [];

renderSearchBar();
renderJobList();

clearBtn.addEventListener("click", () => {
    Array.from(searchFilters.children)
        .forEach(filter => filter.remove());

    selectedFilters = [];

    renderSearchBar();
    renderJobList();
});

function addFilter(filter) {
    const filterValue = filter.dataset.value;

    searchFilters.insertAdjacentHTML("beforeend", `
    <button class="button button--selected" data-value="${filterValue}" onclick="removeFilter(this)">
        ${filterValue}
    </button>
    `)

    selectedFilters.push(filterValue);
    renderSearchBar();
    renderJobList();
}

function removeFilter(filter) {
    const filterValue = filter.dataset.value;
    const filterIndex = selectedFilters.indexOf(filterValue)

    searchFilters.removeChild(filter);
    selectedFilters.splice(filterIndex, 1)

    renderSearchBar();
    renderJobList();
}

function renderSearchBar() {
    if (searchFilters.childElementCount > 0) {
        searchBar.style.display = "flex";
    } else {
        searchBar.style.display = "none";
    }

    adjustSpacing();
}

function checkFilters(list) {
    return list.map(jobList => {
        const filters = [jobList.role, jobList.level, ...jobList.languages, ...jobList.tools];

        if (selectedFilters.length === 0) {
            return jobList; //returns all list
        } else if (selectedFilters.every(el => filters.indexOf(el) != -1)) {
            return jobList; //returns lists that match the selected filters
        }
    })
}

async function getData() {
    const response = await fetch("js/data.json");

    if (response.status === 200) {
        const data = await response.json();
        return data;
    } else {
        console.log("Could not fetch data");
    }
}

async function renderJobList() {
    const jobList = await getData();
    const previousList = document.querySelectorAll(".card");
    let filteredJobs = checkFilters(jobList);

    if (previousList) {
        previousList.forEach(list => list.remove());
        render();
    } else {
        render();
    }

    function render() {
        filteredJobs.map(filtered => {
            if (filtered != undefined) {
                const jobFilters = [filtered.role, filtered.level, ...filtered.languages, ...filtered.tools];
        
                jobContainer.insertAdjacentHTML("beforeend", `
                <div class="card ${filtered.featured ? 'card--featured' : ''}">
                    <div class="card__details-wrapper">
                        <div class="card__logo-container">
                            <img class="card__logo" src="${filtered.logo}" alt="${filtered.company}">
                        </div>
                
                        <div class="card__details">
                            <div class="card__company">
                                <p class="card__company-name">${filtered.company}</p>
                                
                                <div class="card__job-types">
                                    ${filtered.new ? `<p class="card__job-type card__job-type--new">New!</p>` : ''}
                                    ${filtered.featured ? `<p class="card__job-type card__job-type--featured">Featured</p>` : ''}
                                </div>
                            </div>
                
                            <h2 class="card__position">${filtered.position}</h2>
                
                            <div class="card__overview">
                                <p class="card__overview-text card__overview-text--postedAt">${filtered.postedAt}</p>
                                <p class="card__overview-text card__overview-text--contract">${filtered.contract}</p>
                                <p class="card__overview-text card__overview-text--location">${filtered.location}</p>
                            </div>
                        </div>
                    </div>
                
                    <hr class="card__divider">
                
                    <div class="card__filters">
                        ${jobFilters.map(filter => {
                            return `
                            <button class="button button--primary" data-value="${filter}" onclick="addFilter(this)">
                                ${filter}
                            </button>
                            `
                        }).join("")}
                    </div>
                </div>                     
                `)
            }
        })
    }
}

function adjustSpacing() {
    //spacing between the container and search bar
    if (searchBar.offsetHeight > 0 && searchBar.offsetHeight < 100) {
        spacing.style.height = "3.125rem"
    } else if (searchBar.offsetHeight > 100) {
        spacing.style.height = "5rem"
    } else {
        spacing.style.height = "0rem"
    }
}