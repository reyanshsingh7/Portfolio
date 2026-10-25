
const tabButtons = document.querySelectorAll(".tab-btn");
const panels = document.querySelectorAll(".panel");
const contactMeButton = document.querySelector("#contact-me-btn");

function showTab(tabName) {

  if (document.getElementById(tabName) === null) {
    return;
  }

  
  panels.forEach(function (panel) {
    if (panel.id === tabName) {
      panel.hidden = false;
    } else {
      panel.hidden = true;
    }
  });


  tabButtons.forEach(function (button) {
    if (button.dataset.tab === tabName) {
      button.classList.add("is-active");
      button.setAttribute("aria-current", "page");
    } else {
      button.classList.remove("is-active");
      button.removeAttribute("aria-current");
    }
  });


  const activePanel = document.getElementById(tabName);
  const top = activePanel.getBoundingClientRect().top;
  if (top < 0 || top > window.innerHeight * 0.75) {
    activePanel.scrollIntoView();
  }


  const activeButton = document.querySelector('.tab-btn[data-tab="' + tabName + '"]');
  activeButton.scrollIntoView({ inline: "center", block: "nearest" });
}


tabButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    showTab(button.dataset.tab);   // dataset.tab reads the data-tab attribute
  });
});


if (contactMeButton !== null) {
  contactMeButton.addEventListener("click", function () {
    showTab("contact");
  });
}




const filterButtons = document.querySelectorAll(".filter-btn");
const projectCards = document.querySelectorAll(".project-card");
const projectStatus = document.querySelector("#project-status");
const projectEmpty = document.querySelector("#project-empty");

function filterProjects(category) {
  let visibleCount = 0;


  const wanted = category.toLowerCase();

  
  projectCards.forEach(function (card) {
    const cardCategories = card.dataset.category.toLowerCase().split(" ");   

    if (wanted === "all" || cardCategories.includes(wanted)) {
      card.hidden = false;
      visibleCount++;
    } else {
      card.hidden = true;
    }
  });


  filterButtons.forEach(function (button) {
    if (button.dataset.filter.toLowerCase() === wanted) {
      button.classList.add("is-active");
      button.setAttribute("aria-pressed", "true");
    } else {
      button.classList.remove("is-active");
      button.setAttribute("aria-pressed", "false");
    }
  });


  projectStatus.textContent = "Showing " + visibleCount + " of " + projectCards.length + " projects";
  projectEmpty.hidden = visibleCount !== 0;
}

filterButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    filterProjects(button.dataset.filter);
  });
});


filterButtons.forEach(function (button) {
  const name = button.dataset.filter.toLowerCase();
  if (name === "all") {
    return;
  }
  let foundMatch = false;
  projectCards.forEach(function (card) {
    if (card.dataset.category.toLowerCase().split(" ").includes(name)) {
      foundMatch = true;
    }
  });
  if (!foundMatch) {
    console.warn('The filter "' + button.dataset.filter + '" matches no project. Check data-category: each category must be one word, with no spaces.');
  }
});



const contactForm = document.querySelector("#contact-form");


if (contactForm !== null) {
  const formStatus = document.querySelector("#form-status");
  const formFields = contactForm.querySelectorAll("input, textarea");


  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


  function getErrorMessage(field) {
    const value = field.value.trim();          
    const label = field.dataset.label;         

    if (value === "") {
      return "Please enter your " + label + ".";
    }
    if (field.type === "email" && !emailPattern.test(value)) {
      return "Please enter a valid email address, such as name@example.com.";
    }
    if (field.minLength > 0 && value.length < field.minLength) {
      return "Your " + label + " must be at least " + field.minLength + " characters long.";
    }
    return "";
  }


  function validateField(field) {
    const errorBox = document.getElementById(field.id + "-error");
    const message = getErrorMessage(field);

    if (message !== "") {
      errorBox.textContent = message;
      field.classList.add("is-invalid");
      field.setAttribute("aria-invalid", "true");
      return false;
    }

    errorBox.textContent = "";
    field.classList.remove("is-invalid");
    field.removeAttribute("aria-invalid");
    return true;
  }


  contactForm.addEventListener("submit", function (event) {
    event.preventDefault();          


    formStatus.textContent = "";
    formStatus.classList.remove("is-success", "is-error");


    let firstInvalidField = null;
    formFields.forEach(function (field) {
      const isValid = validateField(field);
      if (!isValid && firstInvalidField === null) {
        firstInvalidField = field;
      }
    });

    if (firstInvalidField !== null) {

      formStatus.textContent = "Please fix the highlighted fields and try again.";
      formStatus.classList.add("is-error");
      firstInvalidField.focus();
    } else {

      const visitorName = document.querySelector("#name").value.trim();
      formStatus.textContent =
        "Form check passed, " + visitorName + ". This is a demo, so your message was not sent or saved. " +
        "Delivering real messages needs a backend or a form service.";
      formStatus.classList.add("is-success");
      contactForm.reset();         
    }
  });


  formFields.forEach(function (field) {
    field.addEventListener("input", function () {
      if (field.classList.contains("is-invalid")) {
        validateField(field);
      }
    });
  });
}




const sidebarToggle = document.querySelector("#sidebar-toggle");
const sidebarDetails = document.querySelector("#sidebar-details");

sidebarToggle.addEventListener("click", function () {
  const isOpen = sidebarDetails.classList.contains("is-open");

  if (isOpen) {
    sidebarDetails.classList.remove("is-open");
    sidebarToggle.setAttribute("aria-expanded", "false");
    sidebarToggle.textContent = "Show contact details";
  } else {
    sidebarDetails.classList.add("is-open");
    sidebarToggle.setAttribute("aria-expanded", "true");
    sidebarToggle.textContent = "Hide contact details";
  }
});




const certImages = document.querySelectorAll(".cert-img");
const placeholderSrc = "images/certificates/placeholder.svg";

function usePlaceholder(img) {

  if (img.getAttribute("src") === placeholderSrc) {
    return;
  }
  console.warn("Certificate image not found: " + img.getAttribute("src"));
  img.src = placeholderSrc;
}

certImages.forEach(function (img) {

  img.addEventListener("error", function () {
    usePlaceholder(img);
  });


  if (img.complete && img.naturalWidth === 0) {
    usePlaceholder(img);
  }
});
