const overlay = document.getElementById('overlay');
const popup = document.getElementById('popup');
const closePopup = document.getElementById('close-popup');
const popupTitle = document.getElementById('popup-title');
const popupBody = document.getElementById('popup-body');
const heartsContainer = document.getElementById('hearts-container');
export let popupActive = false;

const author = document.getElementById('author');
const project = document.getElementById('project');
const rules = document.getElementById('rules');




// const observer = new MutationObserver((mutations) => {
//     mutations.forEach((mutation) => {
//         mutation.addedNodes.forEach((node) => {
//             if (node.tagName === 'CANVAS' && node.id === 'renderer') {
//                 // console.log('Canvas detected and ready.');
//                 const canvas = document.getElementById('renderer');
//                 // console.log();
//                 setInterval(() => {
//                     // console.log('checking');
//                     if(popupActive){
//                         // console.log('active');
//                         heartsContainer.style.display = 'none';
                        
//                     }
//                     else{
//                         // console.log('not active');
//                         canvas.style.visibility = 'visible';
//                         heartsContainer.style.display = 'flex';
//                         canvas.style.display = 'flex';
//                     }
//                 }, 100); // Check every 100ms
//             }
//         });
//     });
// });

// Observe the body for changes
// observer.observe(document.body, { childList: true, subtree: true });

function blockCanvasInteractions(e) {
    if (popupActive) {
        e.stopPropagation(); // Prevent the event from reaching the canvas
        e.preventDefault();  // Block the default behavior
    }
}

// Listen for pointer events


// Function to show the popup
function showPopup() {
    overlay.classList.add('active');
    popupActive = true;
}

// Function to hide the popup
function hidePopup(event) {
    // event.stopPropagation();
    overlay.classList.remove('active');
    popupActive = false;
}

// Add event listener to close the popup
closePopup.addEventListener('mousedown', hidePopup);

// Example: Show the popup after 1 second (demo purpose)
setTimeout(showPopup, 1);

//close popup on  overlay click

overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
        hidePopup();
    }
});

document.addEventListener('click', (e)=>{
    if (e.target === author) {
        showAuthor();
    }
    if (e.target === project) {
        showProject();
    }
    if (e.target === rules) {
        showRules();
    }
})

function showRules(){
    popupTitle.textContent = `Rules`;
    popupBody.innerHTML = `This is a island_picker.js game where user tries to guess island with highest average elevation. <br>
		Player has three lives that are represented by three hearts in upper-left corner of the game. <br><br> Good Luck. `;
    showPopup();
}

function showAuthor(){
    popupTitle.textContent = `About Author`;
    popupBody.innerHTML = `Lazar Stanojević is a skilled software developer with experience in a variety of programming languages and technologies.<br>
    He has worked extensively with Node.js, C# .NET, and Python Django, showcasing versatility in both backend development and web frameworks.<br>
    In addition, Lazar has a strong foundation in Operating Systems and Computer Architecture, reflecting a deep understanding of both software and hardware principles. 
    <br><br>
    You can find his CV <a href="https://github.com/159753x/Jobs/blob/main/Lazar_Stanojevic_CV.pdf" target="_blank">here<a>`;
    showPopup();
}

function showProject(){
    popupTitle.textContent = `About Project`;
    popupBody.innerHTML = `island_picker.js is an 3D game created using Three.js, inspired by the iconic blocky style of Minecraft.<br><br> 
    The game combines graphics, lighting, and responsive controls, providing a fun and creative experience for players who enjoy pixel-style gaming.`;
    showPopup();
}