# remote-cam-scan

L'images est constitué de trois couches : 

1. Deux camera capturent une image de la salle à intervalle régulier. Deux scanner permettent de sur-imprimer des document à ces images. 
2. Un scanner A4 équipé d'un _fond bleu_ permet de "poser" les documents fournis par les artistes sur les images transmises par les caméras.
3. Un scanner A3 agit comme une gomme et transforme les tracés noirs ( principalement des textes calligraphiés ) en transparence sur les deux couches précédentes.

### dependencies

- imagemagick ( image processing )
- detox 			( filename sanitize )
- latex				( pdf generation )
- sane 				( scanner )
- fswebcam    ( webcam snapshot)
- ffmpeg      ( replay )
