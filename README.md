# remote 48 ( auto-contact )

Génère automatiquement une planche contact. Ce dispositif est pensé pour être manipulé par une seule personne.

Un mouchard est placé sur l'ordinateur qui assure la projection.

Dans la salle, depuis leur téléphone portable 4 personnes envoient des réactions. Une 5 personne à l'aide d'une téléphone portable peu compléter les images de la projection par des photo prises dans la salle. 

Les images et les réactions sont disposés sous forme de grille suivant une logique FIFO. Avec une 42 items, chaque planche représente ±6 min.

## dépendances

server
- nodejs 			( pour phantomjs )
- phantomjs		( transformation de la page web en pdf )
- imagemagick ( traitement des images )

web app
- bootstrap 
- jquery