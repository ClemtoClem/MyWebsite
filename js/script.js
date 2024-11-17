/**
 * Template name : Personal website v1.0
 * Author : @ClemtoClem
 * Author URI : https://github.com/ClemtoClem/MyWebsite
 */
const sections_info = {
	"sectionHome": {"title":'My web site', "subtitle": "", "neon-text-effect": true},
	"sectionAboutMe": {"title":'About Me', "subtitle": "A la recherche d'un stage de fin d'étude", "neon-text-effect": false},
	"sectionCV": {"title":'Mon Curriculum Vitae', "subtitle": "Mon parcours professionnel et scolaire", "neon-text-effect": false},
	"sectionProjects": {"title":'Mes projets', "subtitle": "Mes projets personnels, professionnels et scolaires", "neon-text-effect": true},
	"sectionContact": {"title":'Contact', "subtitle": "Me contacter", "neon-text-effect": false},

	/* sections de chaque projet */
	"sectionProject-Polyadventure": {"title":'Polyadventure', "subtitle": "Un projet personnel", "neon-text-effect": false},
	"sectionProject-RedPitaya": {"title":'Red Pitaya', "subtitle": "Un projet professionnel", "neon-text-effect": false},
	"sectionProject-RobotHolonome": {"title":'Robot Holonome', "subtitle": "Un projet scolaire", "neon-text-effect": false},
	"sectionProject-BatSpy": {"title":'BatSpy', "subtitle": "Un projet scolaire", "neon-text-effect": false},
}

// Fonction pour basculer l'affichage de la barre latérale
function toggleMenu() {
	const sidebar = document.getElementById("sidebar");
	document.body.classList.toggle("menu-open");
	sidebar.classList.toggle("open");
}

function closeMenu() {
	const sidebar = document.getElementById("sidebar");
	document.body.classList.remove("menu-open");
	sidebar.classList.remove("open");
}

// Fonction pour afficher une sous-section spécifique
function showSection(sectionId, addToHistory = true) {
	// Masquer toutes les sous-sections
	const sections = document.querySelectorAll("section");
	sections.forEach(section => section.classList.remove("active"));

	// Afficher la sous-section sélectionnée
	const selectedSection = document.getElementById(sectionId);
	if (selectedSection) {
		selectedSection.classList.add("active");
	}

	// Mettre à jour le titre et le sous-titre de l'en-tête
	const info = sections_info[sectionId];
	if (info) { // Vérifie si info existe
		let header_title = document.getElementById("header-title");
		header_title.textContent = info["title"];
		if (info["neon-text-effect"]) {
			header_title.classList.add("neon-text-effect");
		} else {
			header_title.classList.remove("neon-text-effect");
		}
		document.getElementById("header-subtitle").textContent = info["subtitle"];
		document.title = info["title"]; // Mettre à jour le titre du document
	}

	// Mettre à jour l'URL si `addToHistory` est true
	if (addToHistory) {
		const newUrl = `#${sectionId}`;
		window.history.pushState({ sectionId: sectionId }, '', newUrl);
	}

    // Faire défiler vers le haut de la page
    document.getElementById('main-content').scrollTo(0, 0);

	// Fermer le menu après sélection
	closeMenu();
}

// Fonction pour récupérer le nom de la section depuis l'URL
function getSectionFromUrl() {
	// window.location.hash retourne la partie après le #
	const hash = window.location.hash;

	// Retirer le # pour ne garder que le nom de la section
	const sectionId = hash.substring(1); // Enlève le premier caractère (#)

	return sectionId; // Retourne "sectionHome", "sectionAboutMe", etc.
}

// Fonction pour vérifier si la section est incluse dans sections_info
function isSectionInInfo(sectionId) {
	return sectionId in sections_info; // Vérifie si sectionId est une clé dans sections_info
}

// Événement pour gérer les changements d'état de l'historique
window.addEventListener('popstate', function(event) {
	const sectionId = getSectionFromUrl();
	//console.log("popstate event triggered, sectionId:", sectionId);
	if (isSectionInInfo(sectionId)) {
		showSection(sectionId, false); // Ne pas ajouter à l'historique à partir de l'événement popstate
	}
});


// Fermer le menu si l'utilisateur clique en dehors de celui-ci
window.addEventListener('click', function (event) {
	const sidebar = document.getElementById("sidebar");
	const hamburger = document.querySelector("#hamburger");
	if (!sidebar.contains(event.target) && !hamburger.contains(event.target) && sidebar.classList.contains("open")) {
		toggleMenu();
	}
});

const links_info = {
	"a-polytech": {"img":'img/polytech-grenoble.jpg', "href":"https://polytech.grenoble-inp.fr/"},
	"a-IUT1": {"img":'img/IUT1-grenoble.jpeg', "href":"https://iut1.univ-grenoble-alpes.fr/"},
	"a-lycee": {"img":'img/lycee-les-eaux-claires-grenoble.jpg', "href":"https://eaux-claires.ent.auvergnerhonealpes.fr/"},
	"a-TIMA": {"img":'img/TIMA-grenoble.jpeg', "href":"https://tima.univ-grenoble-alpes.fr/"},
	"a-Itancia1": {"img":'img/itancia-grenoble.png', "href":"https://itancia.com/"},
	"a-Itancia2": {"img":'img/itancia-grenoble.png', "href":"https://itancia.com/"},
	"a-Carrefour": {"img":'img/carrefour-st-egreve.png', "href":"https://www.carrefour.fr/magasin/saint-egreve"},
	"a-SRD-05VDC-SL": {"img":'img/SRD-05VDC-SL.jpg', "href": "pdf/datasheets/SRD-05VDC-SL-C.pdf"},
	"a-2N2218-2N2219": {"img":'img/2N2222A.webp', "href": "pdf/datasheets/2N2218-2N2219.pdf"},
	"a-PIC18F4331": {"img":'img/PIC18F4431-J5X-FlipFlop2.avif', "href": "pdf/datasheets/PIC18F2331-2431-4331-4431.pdf"},
	"a-LD293D": {"img":'img/LD293D.jpg', "href": "pdf/datasheets/LD293D.pdf"},
};

function createLinks() {
	// Créer l'élément tooltip
	var tooltip = document.createElement('div');
	tooltip.classList.add('tooltip');
	tooltip.style.display = 'none'; // Masquer par défaut
	document.body.appendChild(tooltip);

	// Ajouter les événements de survol et de déplacement de la souris pour chaque lien avec un ID dans links_info
	var links = document.querySelectorAll('a[id]'); // Sélectionner uniquement les liens avec un attribut ID
	links.forEach(function(link) {
		if (links_info.hasOwnProperty(link.id)) {
			link.setAttribute("href", links_info[link.id]["href"]);
			link.setAttribute("target", "_blank");

			link.addEventListener('mouseenter', function(event) {
				var imgSrc = links_info[link.id]["img"];
				var href = link.getAttribute("href");
				tooltip.innerHTML = `
					<img src="${imgSrc}" alt="Image de l'établissement" style="max-width: 200px; max-height: 150px;">
					<p style="font-size:12px; color: #fff; margin-top: 5px;">${href}</p>
				`;
				tooltip.style.display = 'block';
			});

			link.addEventListener('mouseleave', function() {
				tooltip.style.display = 'none';
			});

			link.addEventListener('mousemove', function(event) {
				var posX = event.clientX + 15; // Ajouter un décalage pour éviter de couvrir le curseur
				var posY = event.clientY + 15;

				// Calculer les limites du tooltip
				var tooltipRect = tooltip.getBoundingClientRect();
				var windowWidth = window.innerWidth;
				var windowHeight = window.innerHeight;

				// Ajuster la position si le tooltip dépasse les bords de la fenêtre
				if (posX + tooltipRect.width > windowWidth) {
					posX = windowWidth - tooltipRect.width - 10;
				}
				if (posY + tooltipRect.height > windowHeight) {
					posY = windowHeight - tooltipRect.height - 10;
				}

				tooltip.style.left = posX + 'px';
				tooltip.style.top = posY + 'px';
			});
		}
	});
}

function downloadCV() {
	const cvFileName = 'pdf/CV_CHARRIERE_Clement_2024.pdf';
	const link = document.createElement('a');
	link.href = cvFileName;
	link.download = 'CV_CHARRIERE_Clement_2024.pdf';
	link.click();
}

/* Ajout de la validation du formulaire */
// Validation du Formulaire de Contact
document.getElementById('contactForm').addEventListener('submit', function(event) {
	const name = document.getElementById('name').value.trim();
	const email = document.getElementById('email').value.trim();
	const subject = document.getElementById('subject').value.trim();
	const message = document.getElementById('message').value.trim();

	if (!name || !email || !subject || !message) {
		alert('Veuillez remplir tous les champs du formulaire.');
		event.preventDefault(); // Empêche la soumission du formulaire
	}

	// Simple validation de l'email
	const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	if (!emailPattern.test(email)) {
		alert('Veuillez entrer une adresse email valide.');
		event.preventDefault();
	}
});

function calculateAge(dateOfBirth) {
	const today = new Date();
	const birth = new Date(dateOfBirth);
	
	let age = today.getFullYear() - birth.getFullYear();
	const mois = today.getMonth() - birth.getMonth();
	
	// Si le mois actuel est avant le mois de naissance, ou si c'est le même mois mais que le jour est avant, on retire 1 an.
	if (mois < 0 || (mois === 0 && today.getDate() < birth.getDate())) {
		age--;
	}

	return age;
}

// Fonction pour défiler vers le haut de la page
function scrollToTop() {
    document.getElementById("main-content").scrollTo({ top: 0, behavior: "smooth" });
}

/* Fonction pour charger la page */
window.addEventListener('DOMContentLoaded', function() {
	let ageElem = document.getElementById("my-age");
	ageElem.innerHTML = calculateAge('2001-10-30');

	// Récupère le conteneur et le bouton
	const mainContent = document.getElementById("main-content");
	const scrollToTopBtn = document.getElementById("scrollToTopBtn");

	// Fonction pour afficher/masquer le bouton en fonction de la position de défilement
	mainContent.addEventListener("scroll", () => {
		if (mainContent.scrollTop > mainContent.clientHeight/2) {
			scrollToTopBtn.classList.add("show");
			scrollToTopBtn.classList.remove("hide");
		} else {
			scrollToTopBtn.classList.remove("show");
			scrollToTopBtn.classList.add("hide");
		}
	});

	createLinks();

	// Charger la section au chargement de la page
	const sectionName = getSectionFromUrl();
	if (isSectionInInfo(sectionName)) {
		showSection(sectionName);
	} else {
		showSection('sectionHome'); // Affiche la section par défaut si la section n'est pas valide
	}
});