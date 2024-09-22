/**
 * Template name : Personal website v1.0
 * Author : @ClemtoClem
 * Author URI : https://github.com/ClemtoClem/MyWebsite
 */

/* Global events */
var windowInfo = {
	innerWidth : window.innerWidth,
	innerHeight : window.innerHeight,
	mouseInside : true,
	mouseX: 0,
	mouseY: 0
};
document.addEventListener('mousemove', function(event) {
	windowInfo.mouseX = event.clientX;
	windowInfo.mouseY = event.clientY;
});
document.addEventListener('mouseenter', function() {
	console.log('mouseenter');
	windowInfo.mouseInside = true;
});
document.addEventListener('mouseleave', function() {
	console.log('mouseleave');
	windowInfo.mouseInside = false;
});
window.addEventListener('resize', function() {
	windowInfo.innerWidth = window.innerWidth;
	windowInfo.innerHeight = window.innerHeight;
});

/* Background animation ans events */
function drawBackground() {
	function drawVia(x, y) {
		ctx.beginPath();
		ctx.arc(x, y, viaRadius, 0, 2 * Math.PI);
		ctx.strokeStyle = "#b87333"; // couleur cuivrée tamisée
		ctx.lineWidth = 4;
		ctx.stroke();
	}

	function drawLine(x1, y1, x2, y2) {
		ctx.beginPath();
		sensX = Math.sign(x2 - x1);
		sensY = Math.sign(y2 - y1);
		ctx.moveTo(x1 + sensX*4, y1 + sensY*4);
		ctx.lineTo(x2 - sensX*4, y2 - sensY*4);
		ctx.strokeStyle = "#b87333"; // couleur cuivrée tamisée
		ctx.lineWidth = 4;
		ctx.stroke();
	}

	function isLineValid(x1, y1, x2, y2) {
		// Utiliser une chaîne unique pour chaque ligne pour éviter les doublons
		var line1 = `${x1},${y1},${x2},${y2}`;
		var line2 = `${x2},${y2},${x1},${y1}`; // Considérer les deux directions
		return !lines.has(line1) && !lines.has(line2);
	}

	function drawRandomLine() {
		var x1, y1, x2, y2;
		var attempts = 0;
		do {
			x1 = Math.floor(Math.random() * (width / gridSize)) * gridSize;
			y1 = Math.floor(Math.random() * (height / gridSize)) * gridSize;
			if (Math.random() > 0.5) {
				// Ligne horizontale
				x2 = x1 + gridSize;
				y2 = y1;
			} else {
				// Ligne verticale
				x2 = x1;
				y2 = y1 + gridSize;
			}
			attempts++;
			if (attempts > 100) return; // Éviter une boucle infinie
		} while (!isLineValid(x1, y1, x2, y2));

		drawVia(x1, y1);
		drawLine(x1, y1, x2, y2);
		drawVia(x2, y2);

		// Ajouter la ligne au set
		lines.add(`${x1},${y1},${x2},${y2}`);
	}

	function updateSpeed() {
		if (!UPDATE_SPEED_WITH_MOUSE) {
			// Changer la direction et la vitesse cible aléatoirement
			targetSpeedx = (Math.random() - 0.5) * maxSpeed * 2;
			targetSpeedy = (Math.random() - 0.5) * maxSpeed * 2;

			setTimeout(updateSpeed, 5000); // Changer de direction toutes les 5 secondes
		} else {
			var mouseX = event.clientX;
			var mouseY = event.clientY;

			if (windowInfo.mouseInside === false) {
				// L'utilisateur a déplacé la souris hors de la fenêtre
				targetSpeedx = 0;
				targetSpeedy = 0;
				return;
			}

			// Calculer la distance par rapport au centre du canvas
			var centerX = width / 2;
			var centerY = height / 2;
			var distance = Math.sqrt((mouseX - centerX) * (mouseX - centerX) + (mouseY - centerY) * (mouseY - centerY));

			// Calculer la vitesse en fonction de la distance
			var normalizedDistance = Math.min(distance / (Math.sqrt(centerX * centerX + centerY * centerY)), 1); // Normaliser la distance entre 0 et 1
			var currentMaxSpeed = maxSpeed * normalizedDistance; // Vitesse maximale réduite en fonction de la distance

			// Mettre à jour la vitesse cible
			var deltaX = mouseX - centerX;
			var deltaY = mouseY - centerY;
			var magnitude = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

			targetSpeedx = (deltaX / magnitude) * currentMaxSpeed;
			targetSpeedy = (deltaY / magnitude) * currentMaxSpeed;

			window.addEventListener('mousemove', updateSpeed);
		}
	}

	function updateGrid() {
		ctx.clearRect(0, 0, width, height);

		var updatedLines = new Set();

		var maxWidth = width + gridSize * 2;
		var maxHeight = height + gridSize * 2;

		// Mise à jour de la vitesse actuelle pour qu'elle converge vers la vitesse cible
		if (speedx < targetSpeedx) {
			speedx += acceleration;
			if (speedx > targetSpeedx) speedx = targetSpeedx;
		} else if (speedx > targetSpeedx) {
			speedx -= acceleration;
			if (speedx < targetSpeedx) speedx = targetSpeedx;
		}
		if (speedy < targetSpeedy) {
			speedy += acceleration;
			if (speedy > targetSpeedy) speedy = targetSpeedy;
		} else if (speedy > targetSpeedy) {
			speedy -= acceleration;
			if (speedy < targetSpeedy) speedy = targetSpeedy;
		}

		lines.forEach(line => {
			var [x1, y1, x2, y2] = line.split(',').map(Number);

			x1 += speedx;
			y1 += speedy;
			x2 += speedx;
			y2 += speedy;

			drawVia(x1, y1);
			drawLine(x1, y1, x2, y2);
			drawVia(x2, y2);

			// Réafficher les lignes qui dépassent sur l'autre côté
			if (x1 > width + gridSize || x2 > width + gridSize) {
				x1 -= maxWidth; x2 -= maxWidth;
			} else if (x1 < -gridSize || x2 < -gridSize) {
				x1 += maxWidth; x2 += maxWidth;
			}
			if (y1 > height + gridSize || y2 > height + gridSize) {
				y1 -= maxHeight; y2 -= maxHeight;
			} else if (y1 < -gridSize || y2 < -gridSize) {
				y1 += maxHeight; y2 += maxHeight;
			}

			drawVia(x1, y1);
			drawLine(x1, y1, x2, y2);
			drawVia(x2, y2);

			// Sauvegarder la position de la ligne
			updatedLines.add(`${x1},${y1},${x2},${y2}`);
		});

		lines = updatedLines;

		requestAnimationFrame(updateGrid);
	}

	function drawGrid() {
		lines.clear(); // Effacer toutes les lignes
		for (var i = 0; i < numberOfLines; i++) {
			drawRandomLine(); // Générer de nouvelles lignes aléatoires
		}
		updateGrid(); // Mettre à jour le fond avec les nouvelles lignes

		setInterval(drawGrid, 5 * 60 * 1000); // Redessiner toutes les lignes toutes les 5 minutes
	}

	
	var UPDATE_SPEED_WITH_MOUSE = true;

	var canvas = document.getElementById('canvas');
	var ctx = canvas.getContext('2d');

	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	var width = canvas.width;
	var height = canvas.height;
	var gridSize = 40; // Taille de la grille
	var viaRadius = 5; // Rayon du via
	var lines = new Set(); // Stocke les lignes pour éviter les croisements

	var speedx = 0.5; // Vitesse de déplacement de la grille en x
	var speedy = 0.5; // Vitesse de déplacement de la grille en y
	var targetSpeedx = 0;
	var targetSpeedy = 0;
	var maxSpeed = 1; // Vitesse maximale
	var acceleration = 0.02; // Accélération pour atteindre la vitesse cible

	var numberOfLines = 100 + Math.random() * 200;  // nombre aléatoire de lignes entre 100 et 300

	for (var i = 0; i < numberOfLines; i++) {
		drawRandomLine();
	}
	
	updateSpeed();
	drawGrid();
}

window.addEventListener('resize', drawBackground);


const sections_info = {
	"sectionHome": {"title":'My web site', "subtitle": "", "neon-text-effect": true},
	"sectionAboutMe": {"title":'About Me', "subtitle": "A la recherche d'un stage de fin d'étude", "neon-text-effect": false},
	"sectionCV": {"title":'Mon Curriculum Vitae', "subtitle": "Mon parcours professionnel et scolaire", "neon-text-effect": false},
	"sectionProjets": {"title":'Mes projets', "subtitle": "Mes projets personnels, professionnels et scolaires", "neon-text-effect": false},
	"sectionContact": {"title":'Contact', "subtitle": "Me contacter", "neon-text-effect": false},

	/* sections de chaque projet */
	"sectionProject-Polyadventure": {"title":'Polyadventure', "subtitle": "Un projet personnel", "neon-text-effect": false},
	"sectionProject-RedPitaya": {"title":'Red Pitaya', "subtitle": "Un projet professionnel", "neon-text-effect": false},
	"sectionProject-RobotHolonome": {"title":'Robot Holonome', "subtitle": "Un projet scolaire", "neon-text-effect": false},
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
function showSection(sectionId) {
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
	let header_title = document.getElementById("header-title")
	header_title.textContent = info["title"];
	if (info["neon-text-effect"]) {
		header_title.classList.add("neon-text-effect");
	} else {
		header_title.classList.remove("neon-text-effect");
	}
	document.getElementById("header-subtitle").textContent = info["subtitle"];

	document.title = info["title"]; // Update document title

	// Fermer le menu après sélection (optionnel)
	closeMenu();
}

// Fermer le menu si l'utilisateur clique en dehors de celui-ci
window.addEventListener('click', function (event) {
	const sidebar = document.getElementById("sidebar");
	const hamburger = document.querySelector("#hamburger");
	if (!sidebar.contains(event.target) && !hamburger.contains(event.target) && sidebar.classList.contains("open")) {
		toggleMenu();
	}
});

const tooltip_info = {
	"a-polytech": {"img":'img/polytech-grenoble.jpg'},
	"a-IUT1": {"img":'img/IUT1-grenoble.jpeg'},
	"a-lycee": {"img":'img/lycee-les-eaux-claires-grenoble.jpg'},
	"a-TIMA": {"img":'img/TIMA-grenoble.jpeg'},
	"a-Itancia1": {"img":'img/itancia-grenoble.png'},
	"a-Itancia2": {"img":'img/itancia-grenoble.png'},
	"a-Carrefour": {"img":'img/carrefour-st-egreve.png'},
};

function createTooltip() {
    // Créer l'élément tooltip
    var tooltip = document.createElement('div');
    tooltip.classList.add('tooltip');
    tooltip.style.display = 'none'; // Masquer par défaut
    document.body.appendChild(tooltip);

    // Ajouter les événements de survol et de déplacement de la souris pour chaque lien avec un ID dans tooltip_info
    var links = document.querySelectorAll('a[id]'); // Sélectionner uniquement les liens avec un attribut ID
    links.forEach(function(link) {
        if (tooltip_info.hasOwnProperty(link.id)) {
            link.addEventListener('mouseenter', function(event) {
                var imgSrc = tooltip_info[link.id]["img"];
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

function matrixAnimation() {
	var c = document.getElementById("canvas");
	if (c == null) return;
	var ctx = c.getContext("2d");

	//making the canvas full screen
	c.height = window.outerHeight;
	c.width = window.outerWidth;

	//chinese characters - taken from the unicode charset
	var matrix = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%+-/~{[|`]}";
	//converting the string into an array of single characters
	matrix = matrix.split("");

	var font_size = 10;
	var columns = c.width/font_size; //number of columns for the rain
	//an array of drops - one per column
	var drops = [];
	//x below is the x coordinate
	//1 = y co-ordinate of the drop(same for every drop initially)
	for(var x = 0; x < columns; x++)
		drops[x] = 1; 

	//drawing the characters
	function draw() {
		//Black BG for the canvas
		//translucent BG to show trail
		var gradient = ctx.createLinearGradient(0, c.height*60/100, 0, c.height*80/100);
		gradient.addColorStop(0, "#01122236");
		gradient.addColorStop(1, "#5a4d0136");
		ctx.fillStyle = gradient;
		ctx.fillRect(0, 0, c.width, c.height);

		ctx.fillStyle = "#42f47dff";//green text
		ctx.font = font_size + "px arial";
		//looping over drops
		for(var i = 0; i < drops.length; i++) {
			//a random chinese character to print
			var text = matrix[Math.floor(Math.random()*matrix.length)];
			//x = i*font_size, y = value of drops[i]*font_size
			ctx.fillText(text, i*font_size, drops[i]*font_size);

			//sending the drop back to the top randomly after it has crossed the screen
			//adding a randomness to the reset to make the drops scattered on the Y axis
			if(drops[i]*font_size > c.height && Math.random() > 0.975)
				drops[i] = 0;

			//incrementing Y coordinate
			drops[i]++;
		}
	}

	setInterval(draw, 35);
}

/* Fonction pour charger la page */
window.addEventListener('DOMContentLoaded', function() {
	createTooltip();

	matrixAnimation();
	//drawBackground();

	showSection('sectionHome');
});