// Wait for the DOM to load before  running the script
document.addEventListener('DOMContentLoaded', function() {
    loadDailyContent(); // Load the content when the page ios ready
    });

function getTodayDate() {
    const today = new  Date();
    const monthNames =  ["January", "February", "March", "April", "May", "June",  "July", "August", "September", "October", "November", "December"];

    const currentMonth = monthNames[today.getMonth()]; //Get the current month name (0 = January, 11 = December)
    const  currentDay = today.getDate(); //Get the current day of the month (1-31)

    return { today, currentMonth, currentDay};
    }

function getYearOfPlan(today) {
    const startYear = 2024; // Adjust to church's start year
    const currentYear =  today.getFullYear();
    const yearsSinceStart = currentYear - startYear;

    //use modulus to cycle through the 4-year plan
    return (yearsSinceStart % 4) + 1;
}

function loadDailyContent() {
    const { today, dayOfYear } = getTodayDate();
    const  yearOfPlan = getYearOfPlan(today);

fetch('worship-guide.json')
.then(response => response.json())
.then(data => {
    //Access content for the current month and day.
    const content = data['year${yearOfPlan}'][currentMonth][currentDay];

    //If conent  is found, display it on the page
    if (content) {
        // Create Bible Gateway link URLs
        const privateReadingLink = 'https://www.biblegateway.com/passage/?search=${encodeURIComponent(content.privateReading)}&version=ESV'
        const familyReadingLink =  'https://www.biblegateway.com/passage/?search=${encodeURIComponent(content.familyReading)}&version=ESV'

        //Display the private and family readings as clickable links
        document.getElementById('private-reading').innerHTML = `private Reading: <a href="${privateReadingLink}" target="_blank">${content.privateReading}</a>`;
        document.getElementById('family-reading').innerHTML =  `Family Reading: <a href="${familyReadingLink}" target="_blank">${content.familyReading}</a>`;

        // Display other content as normal text
        document.getElementById('catechism-question'),textContent = 'Catechism: ${content.catechism}';
        document.getElementById('memory-verses'),textContent = 'Memory Verse: ${content.memoryVerse}';
        document.getElementById('hymn'),textContent = 'Hymn:: ${content.hymn}';
    } else {
        document.getElementById('private-reading').textContent = 'No content available for today';
        document.getElementById('family-reading').textContent = '';
        document.getElementById('catechism-question').textContent = '';
        document.getElementById('memory-verses').textContent = '';
        document.getElementById('hymn').textContent = '';
    }
})
.catch(error => console.error('Error:', error));
}
