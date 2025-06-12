const box = document.getElementById('box');
const status = document.getElementById('status');
const form = document.getElementById('frustrating-form');
const fullnameInput = document.getElementById('fullname');
const referenceInput = document.getElementById('reference');
const emailInput = document.getElementById('email');
const doctypeSelect = document.getElementById('doctype');
const captchaInput = document.getElementById('captcha-input');
const captchaText = document.getElementById('captcha-text');
const securityCode = document.getElementById('security-code');

let attempts = 0;
let popups = [];
let popupCount = 0;

const frustrationTexts = [
  "Please complete all mandatory fields",
  "Invalid reference number format",
  "Your session will expire in 30 seconds",
  "Please disable your ad blocker to continue",
  "This service is only available Monday - Thursday",
  "Your browser is not supported, please update",
  "Verification in progress...",
  "Our systems are currently experiencing high volume",
  "You must enable cookies to continue",
  "Please rotate your device to landscape mode",
  "Error 422 — Unprocessable Entity",
  "This form requires Flash Player to submit"
];

function randInt(min, max) {
  // Ensure min and max are valid numbers
  min = Math.ceil(min);
  max = Math.floor(max);
  if (min > max) {
    [min, max] = [max, min]; // Swap if min is greater than max
  }
  if (min === max) return min; // Return if range is zero
  return Math.floor(Math.random() * (max - min + 1)) + min;
}


function moveBox() {
  const vw = document.documentElement.clientWidth;
  const vh = document.documentElement.clientHeight;
  const boxWidth = box.offsetWidth;
  const boxHeight = box.offsetHeight;
  const pad = Math.min(32, Math.min(vw, vh) * 0.05);

  // Ensure box dimensions are positive before calculating max coordinates
  if (boxWidth <= 0 || boxHeight <= 0) return;

  const maxX = Math.max(pad, vw - boxWidth - pad);
  const maxY = Math.max(pad, vh - boxHeight - pad);

  // Ensure randInt receives valid ranges
  const x = randInt(pad, maxX);
  const y = randInt(pad, maxY);

  box.style.left = x + 'px';
  box.style.top = y + 'px';

  // Randomly change button text
  if (Math.random() > 0.7) {
    const buttonTexts = ["SUBMIT", "CONTINUE", "PROCEED", "NEXT", "SEND", "OK"];
    box.textContent = buttonTexts[randInt(0, buttonTexts.length - 1)];
  }

  // Try to use vibration API on mobile
  if (navigator.vibrate) {
    navigator.vibrate(50);
  }
}

function showStatus(msg) {
  status.textContent = msg;
  status.style.opacity = 1;
  setTimeout(() => status.style.opacity = 0, 2200);
}

// Popup Management - Gradual Escalation
let popupEscalationLevel = 0;
let popupTimerId = null;

function createPopup() {
  // Remove popup count limit (was: if (popupCount > 15) return;)
  
  const popup = document.createElement('div');
  popup.className = 'popup';

  const popupTexts = [
    "Would you like to receive notifications?",
    "This site uses cookies",
    "Subscribe to our newsletter",
    "Take our quick survey", 
    "Your file is downloading...",
    "Please verify your identity",
    "Create an account to continue",
    "Unsaved changes will be lost",
    "System update required",
    "This action cannot be undone",
    "Please wait while we process your request",
    "Location access required"
  ];

  popup.innerHTML = `
    <div class="popup-content">${popupTexts[randInt(0, popupTexts.length - 1)]}</div>
    <button class="popup-button">Close</button>
  `;

  // Position with density awareness
  // Try to find space for popup, or overlap if screen is getting full
  const popupWidth = randInt(250, 380);
  const popupHeight = randInt(120, 180);
  
  // Get available screen space with some padding
  const screenPadding = 5;
  const availWidth = window.innerWidth - popupWidth - screenPadding * 2;
  const availHeight = window.innerHeight - popupHeight - screenPadding * 2;
  
  const x = randInt(screenPadding, Math.max(screenPadding, availWidth));
  const y = randInt(screenPadding, Math.max(screenPadding, availHeight));
  
  popup.style.left = x + 'px';
  popup.style.top = y + 'px';
  popup.style.width = popupWidth + 'px';
  
  // Add some randomization to appearance
  if (Math.random() > 0.7) {
    popup.style.transform = `rotate(${randInt(-3, 3)}deg)`;
  }
  
  document.body.appendChild(popup);
  popups.push(popup);
  popupCount++;

  // Add event listener to create more popups with gradual escalation
  popup.querySelector('.popup-button').addEventListener('click', function(e) {
    e.preventDefault();
    
    // Track user interactions to increase escalation
    popupEscalationLevel += 0.2;
    
    // Early stages (levels 0-3): Popups are dismissible
    if (popupEscalationLevel < 3) {
      // 80% chance of removing this popup when clicked
      if (Math.random() > 0.2) {
        if (popup.parentNode === document.body) {
          document.body.removeChild(popup);
          popups = popups.filter(p => p !== popup);
          popupCount--;
        }
      }
      
      // Create 1-3 new popups at early stages (increased from 1-2)
      const newPopups = 1 + Math.min(2, Math.floor(popupEscalationLevel * 1.5)); // More aggressive scaling
      for (let i = 0; i < newPopups; i++) {
        setTimeout(createPopup, i * 200); // Faster spawn time (was 300ms)
      }
      
      // Increase escalation level more aggressively
      popupEscalationLevel += 0.5; // Was 0.2
    }
    // Mid stages (levels 3-6): Popups multiply faster
    else if (popupEscalationLevel < 6) {
      // 40% chance of removing this popup when clicked (reduced from 50%)
      if (Math.random() > 0.6) {
        if (popup.parentNode === document.body) {
          document.body.removeChild(popup);
          popups = popups.filter(p => p !== popup);
          popupCount--;
        }
      }
      
      // Create 3-5 new popups at mid stages (increased from 2-3)
      const newPopups = 3 + Math.floor((popupEscalationLevel - 3) * 1.2); // More aggressive scaling
      for (let i = 0; i < newPopups; i++) {
        setTimeout(createPopup, i * 150); // Faster spawn time (was 200ms)
      }
      
      // Increase escalation level more aggressively
      popupEscalationLevel += 0.7; // Was 0.2
    }
    // Late stages (levels 6+): Popup hell
    else {
      // Only 10% chance of removal (reduced from 20%)
      if (Math.random() > 0.9) {
        if (popup.parentNode === document.body) {
          document.body.removeChild(popup);
          popups = popups.filter(p => p !== popup);
          popupCount--;
        }
      }
      
      // Create many popups (4-8) with very short delays (increased from 3-6)
      const newPopups = 4 + Math.min(4, Math.floor((popupEscalationLevel - 6) * 0.8));
      for (let i = 0; i < newPopups; i++) {
        setTimeout(createPopup, i * 80); // Faster spawn time (was 100ms)
      }
      
      // Increase escalation level more aggressively
      popupEscalationLevel += 0.9; // Was 0.2
    }
    
    // Start background popup generation if not already running
    startBackgroundPopups();
  });
}

// Background popup generation that increases over time
function startBackgroundPopups() {
  if (popupTimerId !== null) return; // Already running
  
  // Start with a long interval that shortens as escalation increases
  const baseInterval = Math.max(10000, 30000 - (popupEscalationLevel * 2000));
  
  popupTimerId = setInterval(() => {
    createPopup();
    
    // Increase escalation level naturally over time
    popupEscalationLevel += 0.1;
    
    // Adjust interval as escalation increases
    clearInterval(popupTimerId);
    startBackgroundPopups();
  }, baseInterval);
}

// Add an exponential popup generation function for when attempts reach certain threshold
function createPopupStorm() {
  // Create an initial batch of popups
  for (let i = 0; i < 5; i++) {
    setTimeout(createPopup, i * 200);
  }
  
  // Continue creating popups at decreasing intervals
  let interval = 1000;
  const popupGenerator = setInterval(() => {
    createPopup();
    
    interval *= 0.9; // Decrease interval by 10% each time
    if (interval < 200) {
      clearInterval(popupGenerator); // Stop when they're spawning too fast
    } else {
      clearInterval(popupGenerator);
      setInterval(createPopup, interval);
    }
  }, interval);
}

// Add loading animation logic to start of script
document.addEventListener('DOMContentLoaded', () => {
  // Loading animation logic
  const loadingOverlay = document.getElementById('loading-overlay');
  const mainContent = document.getElementById('main-content');
  const loadingProgress = document.getElementById('loading-progress');
  const loadingPercentage = document.getElementById('loading-percentage');
  const loadingMessage = document.getElementById('loading-message');
  const body = document.body;
  
  const loadingMessages = [
    "Checking system compatibility...",
    "Verifying network connection...",
    "Loading government database...",
    "Scanning for malicious software...",
    "Initializing form components...",
    "Connecting to secure server...",
    "Optimizing system resources...",
    "Verifying document protocols...",
    "Loading user interface...",
    "System ready in few moments..."
  ];
  
  let progress = 0;
  let messageIndex = 0;
  
  // Inconsistent progress increments to make loading feel more annoying
  const progressSteps = [1, 0.5, 2, 0.1, 0.2, 0.5, 0.8, 1, 3, 1.5, 0.3, 0.5, 7, 1, 0.1, 0.2, 0.1, 0.5, 5, 1];
  let currentStepIndex = 0;
  
  // Start with a forced delay for initial annoyance
  setTimeout(() => {
    // Show the first message
    loadingMessage.textContent = loadingMessages[messageIndex];
    
    // Start the loading animation
    const loadingInterval = setInterval(() => {
      // Get random progress increment
      const increment = progressSteps[currentStepIndex];
      currentStepIndex = (currentStepIndex + 1) % progressSteps.length;
      
      // Update progress
      progress += increment;
      
      // Artificially slow down at certain percentages
      if (progress > 40 && progress < 45) progress += 0.1;
      if (progress > 65 && progress < 70) progress += 0.05;
      if (progress > 90) progress += 0.01;
      
      // Cap progress at 100
      if (progress >= 100) {
        progress = 100;
        clearInterval(loadingInterval);
        
        // Fake completion delay
        setTimeout(() => {
          // Show main content
          mainContent.style.display = 'block';
          setTimeout(() => {
            mainContent.classList.add('visible');
          }, 100);
          
          // Remove loading overlay
          loadingOverlay.style.opacity = '0';
          body.classList.remove('loading');
          
          setTimeout(() => {
            loadingOverlay.style.display = 'none';
          }, 500);
          
          // Initialize the real app
          initializeApp();
        }, 2000); // Extra 2 seconds delay at the end for maximum annoyance
      }
      
      // Update UI
      loadingProgress.style.width = `${progress}%`;
      loadingPercentage.textContent = `${Math.floor(progress)}%`;
      
      // Change message occasionally
      if (Math.random() > 0.9) {
        messageIndex = (messageIndex + 1) % loadingMessages.length;
        loadingMessage.textContent = loadingMessages[messageIndex];
      }
      
      // Add occasional glitches
      if (Math.random() > 0.95) {
        loadingOverlay.style.filter = 'hue-rotate(180deg)';
        setTimeout(() => {
          loadingOverlay.style.filter = 'none';
        }, 100);
      }
      
    }, 150); // Update interval
  }, 1000); // Initial delay
  
  // Function to initialize the actual app
  function initializeApp() {
    // Existing initialization code
    moveBox();

    // Change captcha text every few seconds - reduced interval to 1.5 seconds
    setInterval(() => {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let newCaptcha = '';
      for (let i = 0; i < 6; i++) {
        newCaptcha += chars[randInt(0, chars.length - 1)];
      }
      // Add visual noise to make it harder to read
      captchaText.textContent = newCaptcha.split('').join(Math.random() > 0.5 ? ' ' : '');
      captchaText.style.textDecoration = Math.random() > 0.5 ? 'line-through' : 'none';
      captchaText.style.fontStyle = Math.random() > 0.5 ? 'italic' : 'normal';
      captchaText.style.fontWeight = randInt(300, 700);
    }, 1000); 
    
    // Force first popup to appear within 7 seconds if user hasn't triggered one yet
    const firstPopupDelay = randInt(3000, 7000); // Random time between 3-7 seconds
    setTimeout(() => {
      if (popupCount === 0) {
        showStatus("Important information required");
        createPopup();
      }
    }, firstPopupDelay);

    // For mobile - touch events instead of mouseenter
    box.addEventListener('touchstart', function(e) {
      e.preventDefault(); // Prevent default touch behavior like scrolling or zooming
      attempts++;
      moveBox();
      increaseFrustration();
    });

    // Still keep mouse events for desktop
    box.addEventListener('mouseenter', function() {
      attempts++;
      moveBox();
      increaseFrustration();
    });

    // Add frustrating form behaviors
    fullnameInput.addEventListener('input', function() {
      if (this.value.length > 5 && Math.random() > 0.7) {
        showStatus("Name contains invalid characters");
        this.classList.add('shake');
        setTimeout(() => this.classList.remove('shake'), 500);
      }
    });

    referenceInput.addEventListener('blur', function() {
      // Relaxed regex to allow more formats initially, frustrate later
      if (this.value && Math.random() > 0.6 && !this.value.match(/^[A-Z0-9-]+$/)) {
        showStatus("Invalid characters in reference number");
        this.value = this.value.replace(/[^A-Z0-9-]/g, ''); // Remove invalid chars
      } else if (this.value && !this.value.match(/^[A-Z]{2}-\d{3}-[A-Z]{4}$/)) {
         // Only show strict format error sometimes
         if (Math.random() > 0.5) showStatus("Format must be XX-999-XXXX");
      }
    });

    emailInput.addEventListener('focus', function() {
      if (Math.random() > 0.5) {
        doctypeSelect.value = ''; // Randomly reset dropdown
        showStatus("Please re-select document type");
      }
    });

    // Change the document type options randomly
    doctypeSelect.addEventListener('click', function() {
      if (Math.random() > 0.7) {
        const options = this.querySelectorAll('option');
        // Reset previous state first
        for (let i = 1; i < options.length; i++) {
           options[i].textContent = options[i].textContent.replace(" (Unavailable)", "");
           options[i].disabled = false;
        }
        // Then disable some randomly
        for (let i = 1; i < options.length; i++) {
          if (Math.random() > 0.5) {
             options[i].textContent = options[i].textContent + " (Unavailable)";
             options[i].disabled = true;
          }
        }
        if (this.value && this.options[this.selectedIndex].disabled) {
            this.value = ''; // Reset if selected option became unavailable
        }
        showStatus("Service availability updated");
      }
    });

    box.addEventListener('click', function(e) {
      e.preventDefault();
      showStatus("⚠️ Error 422 — Unprocessable Entity");

      // Create more popups
      for (let i = 0; i < 5; i++) {
        setTimeout(createPopup, i * 200);
      }
    });

    // Handle resize
    window.addEventListener('resize', () => {
      // Use throttling or debouncing if performance becomes an issue
      requestAnimationFrame(moveBox);
    });

    // Randomly focus on security code field
    setInterval(() => {
      if (Math.random() > 0.9 && document.activeElement !== securityCode) {
        securityCode.parentElement.classList.remove('hidden-field'); // Make it visible briefly
        securityCode.style.opacity = 1;
        securityCode.focus();
        showStatus("Security check required!");
        setTimeout(() => {
            securityCode.style.opacity = 0.05; // Hide again
            if (document.activeElement === securityCode) securityCode.blur(); // Unfocus if still focused
            // Don't add hidden-field class back immediately to avoid layout shifts
        }, 2500);
      }
    }, 5000);

  } // End initializeApp
}); // End DOMContentLoaded

function increaseFrustration() {
  // Show random frustration message
  showStatus(frustrationTexts[randInt(0, frustrationTexts.length - 1)]);

  // Different behavior based on attempts  
  if (attempts === 3) {
    // Clear a random field
    const inputs = [fullnameInput, referenceInput, emailInput, captchaInput];
    const randomInput = inputs[randInt(0, inputs.length - 1)];
    randomInput.value = '';
    randomInput.classList.add('shake');
    setTimeout(() => randomInput.classList.remove('shake'), 500);
    showStatus("Data validation error. Please re-enter.");
  }

  if (attempts === 5) {
    // Create first popup - this starts the escalation
    createPopup();
    popupEscalationLevel = 1; // Set initial escalation level
  }

  if (attempts === 7) {
    // Create multiple popups
    popupEscalationLevel = 3; // Jump to mid-stage escalation
    for (let i = 0; i < 2; i++) {
      setTimeout(createPopup, i * 400);
    }
  }

  if (attempts >= 9 && !document.querySelector('.overlay')) { // Check if overlay exists
    // Jump to late stage escalation 
    popupEscalationLevel = 6;
    
    // Add overlay
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    document.body.appendChild(overlay);

    // Create "final" popup
    const finalPopup = document.createElement('div');
    finalPopup.className = 'popup';
    finalPopup.style.left = '50%';
    finalPopup.style.top = '50%';
    finalPopup.style.transform = 'translate(-50%, -50%)';
    finalPopup.style.zIndex = '1000'; // Ensure it's above overlay

    finalPopup.innerHTML = `
      <div class="popup-content">Session timed out due to inactivity. Restarting...</div>
      <button class="popup-button">OK</button>
    `;

    document.body.appendChild(finalPopup);

    finalPopup.querySelector('.popup-button').addEventListener('click', function() {
      window.location.reload();
    });

    // Prevent further interaction with the box after overlay
    box.style.pointerEvents = 'none';
  }
}
