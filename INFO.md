# Pupitre éditeur

Des documents captés sont placés dans des boites de réceptions (_inbox_). Sur un _controller_ MIDI, la manipulation d’un _fader_ permet le choix d’un document dans un dossier donné. Un potentiomètre permet de sélection pour chacune des voies la boite de réception correspondante. 

Le document choisi pour chaque voie est replacé sur une grille à un emplacement choisi.

* * *

# usage
## inbox

Une _inbox_ reçoit les médias produits par les différentes sources via btsync ou des dossiers partagés sur le réseau local. Les flux sont pré-édités par des opérateurs. 

Pour le traitement le script utilise trois emplacements (_inbox_, _outbox_, _archives_) qui présentent une structure similaire qui représente les pistes qui pourront être sélectionnées par la suite sur le _controller_.

- 00-prise_de_vue
- 01-declarations
- 02-prise_de_note
- 03-description
- 04-documents
- 05-elements_graphiques
- 06-marqueurs
- 07-dessins 

Le dossier _inbox_default_ contient la version générique de l’_inbox_ en début de programme.

## _pupitre-editeur_ (patch processing)

_À partir des informations envoyées par le contrôleur le patch assemble les images des différentes boites de réception en une composition._


1. A chaque impulsion MIDI, le dossier correspondant au _slider_ les parcourut à la recherche d’éventuel nouveau média à ajouter à la liste.

2. Lors de l’ajout, une miniature est générée et stockée dans le dossier _data_. 

3. Le média correspondant à l’impulsion est affiché.

4. Lorsque l’utilisateur demande une impression, une composition en haute définition est générée à partir des images sources puis déposée dans un dossier pour impression.

## pupitre-daemon
### 48inbox 

la fonction _48inbox_ permet le traitement en temps réel des images déposé par les différentes sources. 

- niveau de gris
- auto orientation 
- mise à l’échelle (pixel et DPI)
- ajout d’une annotation avec l’heure

Le script scan tout le dossier _inbox_ et ses sous-dossiers à la recherche d’images nouvelles. Une fois, traités les images sont déposé dans une _outbox_ et les originaux sont stocké dans les _archives_.

### 48print

La fonction _48print_ convertit les assemblages JPEG produits par processing en PDF et les envoie à l’imprimante.

### boucle while
Une boucle articule l’ensemble des fonctions :

- _detox_ pour la mise aux normes des noms de fichiers
- _48print_
- _48inbox_



