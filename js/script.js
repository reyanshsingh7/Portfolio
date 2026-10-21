/* =====================================================================
   script.js - Interactions for the AKTU Web Development Lab portfolio

   Features:
     1. Tab navigation        (About / Resume / Projects / Achievements / Contact)
     2. Project filtering     (All / HTML-CSS / JavaScript / C)
     3. Contact form validation
     4. Sidebar toggle        (show/hide contact details on small screens)

   The script is loaded at the END of index.html, so all the HTML elements
   already exist by the time these lines run.
   ===================================================================== */


/* =====================================================================
   1. TAB NAVIGATION
   Idea: every tab button has data-tab="about" (for example), and every
   section has id="about". Clicking a button shows the section with the
   matching id and hides all the others.
   ===================================================================== */

// Collect the elements we need (querySelectorAll returns a list of all matches)
const tabButtons = document.querySelectorAll(".tab-btn");
const panels = document.querySelectorAll(".panel");
const contactMeButton = document.querySelector("#contact-me-btn");

function showTab(tabName) {
  // Safety check: if there is no section with this id, do nothing
  // (otherwise every section would be hidden).
  if (document.getElementById(tabName) === null) {
    return;
  }

  // Step 1: show the panel whose id matches, hide every other panel.
  // The "hidden" attribute also removes hidden content from keyboard tabbing.
  panels.forEach(function (panel) {
    if (panel.id === tabName) {
      panel.hidden = false;
    } else {
      panel.hidden = true;
    }
  });

  // Step 2: mark the matching button as active, and clear the others.
  // aria-current tells screen-reader users which tab is selected.
  tabButtons.forEach(function (button) {
    if (button.dataset.tab === tabName) {
      button.classList.add("is-active");
      button.setAttribute("aria-current", "page");
    } else {
      button.classList.remove("is-active");
      button.removeAttribute("aria-current");
    }
  });

  // Step 3 (comfort): if the new section's top edge is off-screen, scroll to it.
  const activePanel = document.getElementById(tabName);
  const top = activePanel.getBoundingClientRect().top;
  if (top < 0 || top > window.innerHeight * 0.75) {
    activePanel.scrollIntoView();
  }

  // On narrow phones the tab bar scrolls sideways; keep the active tab in view
  const activeButton = document.querySelector('.tab-btn[data-tab="' + tabName + '"]');
  activeButton.scrollIntoView({ inline: "center", block: "nearest" });
}

// Clicking any tab button opens its section.
tabButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    showTab(button.dataset.tab);   // dataset.tab reads the data-tab attribute
  });
});

// The "Contact me" button in the sidebar opens the Contact tab.
// (The "if" check means the script keeps working even if you delete this button from the HTML.)
if (contactMeButton !== null) {
  contactMeButton.addEventListener("click", function () {
    showTab("contact");
  });
}


/* =====================================================================
   2. PROJECT FILTERING
   Idea: every project card has data-category="html-css javascript" (words
   separated by spaces). A filter button has data-filter="javascript".
   If the card's category list contains the filter word, we show the card.
   Otherwise we hide it. The "all" filter shows every card.
   ===================================================================== */

const filterButtons = document.querySelectorAll(".filter-btn");
const projectCards = document.querySelectorAll(".project-card");
const projectStatus = document.querySelector("#project-status");
const projectEmpty = document.querySelector("#project-empty");

function filterProjects(category) {
  let visibleCount = 0;

  // Compare in lower case, so "Frontend" and "frontend" count as the same word
  const wanted = category.toLowerCase();

  // Show or hide each card
  projectCards.forEach(function (card) {
    const cardCategories = card.dataset.category.toLowerCase().split(" ");   // "a b" becomes ["a", "b"]

    if (wanted === "all" || cardCategories.includes(wanted)) {
      card.hidden = false;
      visibleCount++;
    } else {
      card.hidden = true;
    }
  });

  // Highlight the active filter button. aria-pressed tells screen readers its state.
  filterButtons.forEach(function (button) {
    if (button.dataset.filter.toLowerCase() === wanted) {
      button.classList.add("is-active");
      button.setAttribute("aria-pressed", "true");
    } else {
      button.classList.remove("is-active");
      button.setAttribute("aria-pressed", "false");
    }
  });

  // Update the "Showing X of Y projects" line and the empty-state message
  projectStatus.textContent = "Showing " + visibleCount + " of " + projectCards.length + " projects";
  projectEmpty.hidden = visibleCount !== 0;
}

filterButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    filterProjects(button.dataset.filter);
  });
});

// Safety check for you, the editor: if a filter button matches no project card,
// print a warning in the browser console (press F12). The usual cause is a
// category with a space in it. Spaces separate categories, so use a hyphen instead.
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


/* =====================================================================
   3. CONTACT FORM VALIDATION
   The rules come from the HTML attributes (required, type="email",
   minlength). JavaScript reads those rules, checks each field, and shows
   a friendly message under any field that fails.

   NOTE: nothing is sent anywhere. Sending a real message would need a
   backend server or a form service.
   ===================================================================== */

const contactForm = document.querySelector("#contact-form");

// Only set up the form if it exists on the page. If you delete the Contact section
// from index.html, this whole block is skipped and the other features still work.
if (contactForm !== null) {
  const formStatus = document.querySelector("#form-status");
  const formFields = contactForm.querySelectorAll("input, textarea");

  // A simple email pattern: some text, an @, some text, a dot, some text.
  // (The browser's type="email" alone accepts "a@b" with no dot, so we add this check.)
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Returns an error message for one field, or "" if the field is fine.
  function getErrorMessage(field) {
    const value = field.value.trim();          // trim() removes spaces at both ends
    const label = field.dataset.label;         // e.g. "email address", from data-label

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

  // Checks one field, shows or clears its error, and returns true (ok) or false (problem).
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

  // Runs when the user presses the Submit button
  contactForm.addEventListener("submit", function (event) {
    event.preventDefault();          // stop the browser from reloading the page

    // Clear the previous summary message
    formStatus.textContent = "";
    formStatus.classList.remove("is-success", "is-error");

    // Check every field. Remember the first one that fails.
    let firstInvalidField = null;
    formFields.forEach(function (field) {
      const isValid = validateField(field);
      if (!isValid && firstInvalidField === null) {
        firstInvalidField = field;
      }
    });

    if (firstInvalidField !== null) {
      // At least one problem: explain, and move the cursor to the first bad field
      formStatus.textContent = "Please fix the highlighted fields and try again.";
      formStatus.classList.add("is-error");
      firstInvalidField.focus();
    } else {
      // Everything passed. Be honest: the message is NOT sent anywhere.
      const visitorName = document.querySelector("#name").value.trim();
      formStatus.textContent =
        "Form check passed, " + visitorName + ". This is a demo, so your message was not sent or saved. " +
        "Delivering real messages needs a backend or a form service.";
      formStatus.classList.add("is-success");
      contactForm.reset();           // empty the fields
    }
  });

  // While typing, re-check a field that is currently showing an error,
  // so the error disappears as soon as the user fixes it.
  formFields.forEach(function (field) {
    field.addEventListener("input", function () {
      if (field.classList.contains("is-invalid")) {
        validateField(field);
      }
    });
  });
}


/* =====================================================================
   4. SIDEBAR TOGGLE (small screens only)
   The button opens and closes the contact details. CSS keeps the details
   always visible on large screens and hides the button there.
   ===================================================================== */

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


/* =====================================================================
   5. CERTIFICATE IMAGES
   If a certificate image file cannot be found (for example the file name
   is spelled differently), show the grey placeholder picture instead of a
   broken-image icon. The missing file name is printed in the browser
   console (press F12) so you can find the mistake.
   ===================================================================== */

const certImages = document.querySelectorAll(".cert-img");
const placeholderSrc = "images/certificates/placeholder.svg";

function usePlaceholder(img) {
  // If the placeholder itself is showing, stop (this avoids an endless loop)
  if (img.getAttribute("src") === placeholderSrc) {
    return;
  }
  console.warn("Certificate image not found: " + img.getAttribute("src"));
  img.src = placeholderSrc;
}

certImages.forEach(function (img) {
  // Case 1: the image fails to load after this script has started
  img.addEventListener("error", function () {
    usePlaceholder(img);
  });

  // Case 2: the image had already failed before this script ran
  if (img.complete && img.naturalWidth === 0) {
    usePlaceholder(img);
  }
});
