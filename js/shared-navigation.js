// Wait for the DOM to load before running the script
document.addEventListener("DOMContentLoaded", () => {
    // Load the shared navigation bar from nav.html
    fetch("nav.html")
        .then(response => response.text()) // Convert the response to plain text
        .then(data => {
            // Insert the loaded navigation bar into the #top__bar element
            document.getElementById("top__bar").innerHTML = data;

           // Smooth scroll helper with an offset
            const scrollWithOffset = (element, offset) => {
            const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
            const offsetPosition = elementPosition + offset;
              //Smoothly scroll to the calculated position
            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth",
            });
        };

        //Add functionality for the Work button
        const workLink = document.getElementById("work-link");
        workLink.addEventListener("click", (event) => {
            event.preventDefault(); //Stop default navigation behaivor
            if (window.location.pathname.includes("index.html") || window.location.pathname === "/") {
              //Scroll to the projects section if already on teh homepage
                const projectsSection = document.getElementById("projects");
                scrollWithOffset(projectsSection, -170); // Offsetted for ideal spot
            } else {
              //Redirect to the hompeage and targe the projects sectionw
                window.location.href = "index.html#projects";
            }
        });

// Scroll functionality for the About button
const aboutLink = document.getElementById("about-link");
aboutLink.addEventListener("click", (event) => {
    event.preventDefault(); //Prevents default navigation
    if (window.location.pathname.includes("index.html") || window.location.pathname === "/") {
      //Scroll to the about section
        const aboutSection = document.querySelector(".description_section");
        scrollWithOffset(aboutSection, -60); // Adjust this value as needed
    } else {
      //Redirect to the homepage and target the about section
        window.location.href = "index.html#description_section";
    }
});


            // Same process for the home button
            const homeLink = document.querySelector('a[href="index.html"]');
            homeLink.addEventListener("click", (event) => {
                event.preventDefault(); // Stops default navigation

                if (window.location.pathname.includes("index.html") || window.location.pathname === "/") {
                    // Smooth scroll to the top of the page
                    window.scrollTo({ top: 0, behavior: "smooth" });
                } else {
                    // Redirect to home
                    window.location.href = "index.html";
                }
            });
        })
        .catch(error => console.error("Error loading navigation:", error)); // Handle any errors

    // If the current URL contains a hash, scroll to the corresponding section
    if (window.location.hash) {
        const targetId = window.location.hash.substring(1); // Remove the '#' from the hash
        const targetElement = document.getElementById(targetId) || document.querySelector(`.${targetId}`);

        if (targetElement) {
            const offset = -120;  // Adjust scroll offset for best spot
            const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
            const offsetPosition = elementPosition + offset;
            //Smooth scroll to the targeted section
            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth",
            });
        }
    }
});

// Add fade-in effect for sections with the .description_collection class
document.addEventListener("DOMContentLoaded", () => {
    const sections = document.querySelectorAll(".descrption_collection");

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible"); //Make the section visible
                observer.unobserve(entry.target); // Stop observing once it's visible
            }
        });
    }, {
        threshold: 0.1 // Trigger the animation when 10% of the section is visible
    });

    sections.forEach(section => {
        observer.observe(section);
    });
});


// Add fade-in animations for elements with the .fade-in class
document.addEventListener("DOMContentLoaded", () => {
    // Select all elements with the fade-in class
    const fadeInSections = document.querySelectorAll(".fade-in");

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible"); //Trigger fade-in animation
                observer.unobserve(entry.target); // Stop observing once it's visible
            }
        });
    }, {
        threshold: 0.1 // Trigger when 10% of the section is visible 
    });

    fadeInSections.forEach(section => {
        observer.observe(section);
    });
});


//Add filtering functionality for project itmes
document.addEventListener("DOMContentLoaded", () => {
    const filterButtons = document.querySelectorAll(".filter__bar button");
    const projectItems = document.querySelectorAll("[data-year]");
  
    // Show only 2024 by default
    showProjects("2024");
  
    filterButtons.forEach((button) => {
      button.addEventListener("click", () => {
        // we read data-filter-year, not data-year
        const selectedYear = button.getAttribute("data-filter-year"); 
        showProjects(selectedYear);
      });
    });
  //Show projects that match the selected year
    function showProjects(year) {
      projectItems.forEach((item) => {
        if (item.dataset.year === year) {
          item.style.display = "flex"; //Show the project
          item.classList.remove("visible"); //Reset visibility
          item.classList.add("fade-in"); //Force reflow for animation
          void item.offsetWidth; // Trigger animation
          item.classList.add("visible"); // Re-add 'visible' so the CSS transition plays
        } else {
          item.style.display = "none"; // Hide the item
          item.classList.remove("visible"); //Reomve visibility
        }
      });
    }
  });
  

  // Define constants for the JokeAPI
const JOKE_API_URL = "https://v2.jokeapi.dev/joke/Any?type=twopart&safe-mode";

// Function to get a new joke
function fetchNewJoke() {
  return fetch(JOKE_API_URL)
    .then((response) => response.json())
    .then((data) => {
      const joke = {
        setup: data.setup || data.joke || "Here's a family-friendly joke!",
        punchline: data.delivery || "",
        date: new Date().toDateString(), // Save todays date
      };
      localStorage.setItem("dailyJoke", JSON.stringify(joke)); // Save the joke to local storage
      return joke;
    })
    .catch(() => ({
      setup: "Oops, couldn't fetch a joke. Try refreshing!",
      punchline: "",
    }));
}

// Function to get the joke from local storage or get a new one
function getDailyJoke() {
  const savedJoke = localStorage.getItem("dailyJoke");
  const today = new Date().toDateString();

  if (savedJoke) {
    const joke = JSON.parse(savedJoke);
    if (joke.date === today) {
      return Promise.resolve(joke);
    }
  }
  return fetchNewJoke(); // Get a new joke if outdated or not saved
}

// Update the joke on the page
function updateJoke() {
  getDailyJoke().then((joke) => {
    const setupElement = document.getElementById("joke-setup");
    const punchlineElement = document.getElementById("punchline");

    setupElement.textContent = joke.setup; //Set the joke up
    punchlineElement.textContent = joke.punchline; //Land the joke
  });
}
// Initialize the joke display on page load
document.addEventListener("DOMContentLoaded", () => {
  updateJoke();
});


