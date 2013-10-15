Settings.MoveMouseDelay = 0 
Settings.DelayAfterDrag = 0
Settings.DelayBeforeDrop = 0
Settings.MoveMouseDelay = 0

def getPDF():
    
    App.focus("Google Chrome")

    # aller dans le menu et prendre le pdf
    
    zone = Region(3,99,675,806)
    fichier = "Fichier.png"
    zone.wait(fichier,FOREVER)
    zone.click(fichier)

    telecharger = "Tlchargerauf.png"
    zone.wait(telecharger,FOREVER)
    zone.click(telecharger)    

    pdf = "DocumentPDFp.png"
    zone.wait(pdf,FOREVER)
    zone.click(pdf)


    # fermer la zone de notif de chrome 
    #zone2 = Region(0,689,731,210)
    #toutaff =  
    
    ##zone2.wait(toutaff,FOREVER)
    ##zone2.click(toutaff)

    wait(7)
    getPDF()
    
    pass

getPDF()