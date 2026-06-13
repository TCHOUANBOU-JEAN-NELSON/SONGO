// Les cases du jeu et leur nombre de graines initiales
let board = {
    A1: 3, A2: 3, A3: 3, A4: 3, A5: 3, A6: 3, A7: 3,
    B1: 3, B2: 3, B3: 3, B4: 3, B5: 3, B6: 3, B7: 3
};

let scoreA = 0;
let scoreB = 0;
let currentPlayer = 'A';

// Ordre de distribution face à l'ecran : de A1 à A7 puis de B1 à B7
const cases = ['A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7', 'B1', 'B2', 'B3', 'B4', 'B5', 'B6', 'B7'];

// Met à jour l'affichage des boutons HTML et des scores
function afficher() {
    for (let i = 0; i < 14; i++) {
        let id = cases[i];
        document.getElementById(id).innerHTML = board[id] + ' Graines <hr style="color:dimgrey;"><pre>case ' + id + '</pre>';
    }
    document.querySelector('#scoreA p').innerText = scoreA;
    document.querySelector('#scoreB p').innerText = scoreB;
    document.querySelector('article p').innerHTML = "C'est au tour du Joueur : <b>" + currentPlayer + "</b>";
}

// Compte le nombre total de graines dans le camp d'un joueur
function compterCamp(joueur) {
    let total = 0;
    for (let i = 1; i <= 7; i++) {
        total = total + board[joueur + i];
    }
    return total;
}

// Fonction principale du jeu appelee au clic
function jouer(caseChoisie) {
    // 1. VERIFICATIONS DE BASE
    if (!caseChoisie.startsWith(currentPlayer)) {
        alert("Ce n'est pas votre camp !");
        return;
    }
    if (board[caseChoisie] === 0) {
        alert("Cette case est vide !");
        return;
    }

    let adversaire = (currentPlayer === 'A') ? 'B' : 'A';

    // 2. REGLE DE SOLIDARITE
    if (compterCamp(adversaire) === 0) {
        let joueurPeutNourrir = false;
        for (let i = 0; i < 14; i++) {
            let c = cases[i];
            if (c.startsWith(currentPlayer) && board[c] > 0) {
                let idx = cases.indexOf(c);
                for (let k = 1; k <= board[c]; k++) {
                    if (cases[(idx + k) % 14].startsWith(adversaire)) joueurPeutNourrir = true;
                }
            }
        }

        if (joueurPeutNourrir) {
            let coupNourrit = false;
            let idxChoisi = cases.indexOf(caseChoisie);
            for (let k = 1; k <= board[caseChoisie]; k++) {
                if (cases[(idxChoisi + k) % 14].startsWith(adversaire)) coupNourrit = true;
            }
            if (!coupNourrit) {
                alert("Solidarité ! Vous devez obligatoirement nourrir l'adversaire.");
                return;
            }
        } else {
            alert("L'adversaire n'a plus de graines et vous ne pouvez pas le nourrir. Vous gagnez !");
            return;
        }
    }

    // 3. DISTRIBUTION
    let graines = board[caseChoisie];
    board[caseChoisie] = 0;
    let indexActuel = cases.indexOf(caseChoisie);
    let derniereCase = "";

    for (let i = 1; i <= graines; i++) {
        indexActuel = (indexActuel + 1) % 14;
        let nomCase = cases[indexActuel];
        board[nomCase] = board[nomCase] + 1;
        derniereCase = nomCase;
    }

    // 4. CAPTURE S'IL Y A 2, 3 OU 4 GRAINES FINALES CHEZ L'ADVERSAIRE
    let indexFin = cases.indexOf(derniereCase);
    while (cases[indexFin].startsWith(adversaire)) {
        let caseActuelle = cases[indexFin];
        let totalGraines = board[caseActuelle];
        
        if (totalGraines === 2 || totalGraines === 3 || totalGraines === 4) {
            if (currentPlayer === 'A') scoreA = scoreA + totalGraines;
            else scoreB = scoreB + totalGraines;
            board[caseActuelle] = 0;
            
            // Recule d'une case dans le sens inverse pour la capture consécutive
            indexFin = (indexFin - 1 + 14) % 14;
        } else {
            break;
        }
    }

    // 5. CONDITIONS DE FIN DE PARTIE
    if (scoreA >= 36 || scoreB >= 36) {
        afficher();
        alert("Le Joueur " + (scoreA >= 36 ? "A" : "B") + " a gagné la partie !");
        return;
    }

    let totalPlateau = 0;
    for (let i = 0; i < 14; i++) {
        totalPlateau = totalPlateau + board[cases[i]];
    }
    
    if (totalPlateau < 10) {
        for (let i = 0; i < 14; i++) {
            let c = cases[i];
            if (c.startsWith('A')) scoreA = scoreA + board[c];
            else scoreB = scoreB + board[c];
            board[c] = 0;
        }
        afficher();
        alert("Moins de 10 graines sur le plateau. Fin ! Score A: " + scoreA + " | Score B: " + scoreB);
        return;
    }

    // 6. CHANGEMENT DE TOUR
    currentPlayer = adversaire;
    afficher();
}

// Initialisation au chargement de la page HTML
window.onload = function() {
    for (let i = 0; i < 14; i++) {
        let idCase = cases[i];
        document.getElementById(idCase).onclick = function() {
            jouer(idCase);
        };
    }
    afficher();
};
