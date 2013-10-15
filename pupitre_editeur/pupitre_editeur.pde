import promidi.*;
MidiIO midiIO;

boolean fullscreen = false, refreshBuffer = true, useBuffer = true, useMidi = true, isprinting = false;

int nZone = 8, nFlux = 8, zoneByLine = 3, index=0, copies=0;
int hSD=1024, wSD=719, hHD=3306, wHD=2337;
int zoneH = hSD/zoneByLine, zoneW = wSD/zoneByLine, zoneHHD = hHD/zoneByLine, zoneWHD = wHD/zoneByLine;

String docSet = "test-set";
PGraphics render;
PImage renderimg, currentimg;

boolean sketchFullScreen() {return fullscreen;}
Flux48[] f = new Flux48[nFlux];
Zone48[] z = new Zone48[nZone];
int[]zindex = new int[nZone];

void setup(){
  println("<pre>");
  
  frameRate(30);
  size(wSD, hSD);
  background(255);
  noStroke();

  textFont(createFont("Monaco", 24));
  textAlign(CENTER);

  if(useMidi){
    midiIO = MidiIO.getInstance(this);
    midiIO.openInput(0,0);
  }
  
  for (int i = 0; i<nFlux; i++){
     f[i] = new Flux48(i);
     f[i].refreshFileList();
  }
  
  for (int i = 0; i<nZone; i++){
    z[i] = new Zone48(i);
    zindex[i] = i;
  }
  render = createGraphics(wHD, hHD, JAVA2D);
  
}
void draw(){}

// MIDI
void controllerIn(Controller controller, int device, int channel){
  
  int num = controller.getNumber();
  int val = controller.getValue();
  int type = 9999;
  int i = 9999;
  
  //println(num+":"+val);
  
  switch (num){
    case 81 : i = 0; type=0; break;
    case 82 : i = 1; type=0; break;
    case 83 : i = 2; type=0; break;
    case 84 : i = 3; type=0; break;
    case 85 : i = 4; type=0; break;
    case 86 : i = 5; type=0; break;
    case 87 : i = 6; type=0; break;
    case 88 : i = 7; type=0; break;
    
    case 1 : i = 0; type=1; break;
    case 2 : i = 1; type=1; break;
    case 3 : i = 2; type=1; break;
    case 4 : i = 3; type=1; break;
    case 5 : i = 4; type=1; break;
    case 6 : i = 5; type=1; break; 
    case 7 : i = 6; type=1; break;
    case 8 : i = 7; type=1; break;
    case 92 : 
      printRender();
    break;
    
  }
  
  if(!isprinting){
    if(type == 0 ) {
      z[i].setDoc(val);
    }else if (type == 1){
      z[i].setFlux(val);
    }
  }
}

// key
void keyPressed(){
  //printRender();
  //println();
  //println(zindex);
}

// objects
class Flux48 {
  
  int id, fileCount = 0, oldFileCount = 0, newFiles = 0;
  Float[]ratio;
  String[]fileNames; 
  PImage[]imgSD;

  Flux48 (int tmpid){
    id = tmpid;
    imgSD = new PImage[127];
    ratio = new Float[127];
  }
   
  void refreshFileList(){
    java.io.File folder = new java.io.File(dataPath(docSet+"/c-"+nf(id, 2)));
    java.io.FilenameFilter imgExtFilter = new java.io.FilenameFilter() {
      public boolean accept(File dir, String name) {
        return name.toLowerCase().endsWith(".png")  | name.toLowerCase().endsWith(".jpeg") | name.toLowerCase().endsWith(".jpg");
      }
    };

    fileNames = folder.list(imgExtFilter);
    fileCount = fileNames.length;
    newFiles  = fileCount-oldFileCount;

    // println("\nc-"+ id +" "+oldFileCount+" +" + newFiles);  
    
    for ( int i = (fileCount-newFiles); i< fileCount; i++){
        String path = docSet+"/c-"+nf(id, 2)+"/"+fileNames[i];
        
        imgSD[i] = loadImage(path);
        ratio[i] = (float)imgSD[i].width/imgSD[i].height;
        
        
        println(path);
    }
    
    oldFileCount = fileCount;
  }
  PImage doc(int i) {
    refreshFileList();
    return imgSD[i];
  }
  Float ratio(int i) {
    return ratio[i];
  }
  String filename(int i){
    return fileNames[i];
  }
  int count(){
    return fileCount;
  }
}
class Zone48 {
  
  int id, idFlux = 0,idDoc = 0, fluxVal = 0, docVal = 0, posx, posy, posxHD, posyHD;
  PImage imgHD;
  
  Zone48 (int tmpid){
    id = tmpid;
    posx = (id%zoneByLine*zoneW);
    posy = (floor(id/zoneByLine)*zoneH);
    posxHD = (id%zoneByLine*zoneWHD);
    posyHD = (floor(id/zoneByLine)*zoneHHD);
  }
  void setFlux(int val){
    // set flux ID from à midi value (0-127)
    docVal  = val;
    idFlux  = (int)map(val,0,127,0,nFlux-1);
    idDoc   = (f[idFlux].count()-1);
    
    draw();
    // println("idFlux:"+idFlux);
  }
  void setDoc(int val){
    
    // set document ID from à midi value (0-127)
    
    fluxVal = val;
    idDoc   = (int)map(val,0,127,0,(f[idFlux].count()-1));
    
    draw();
    
    // println("idDoc:"+idDoc);
  }
  void draw(){
    // draw the current doc from the current flux in the zone
    
    updatezindex(id);
    rect(posx, posy, zoneW, zoneH);
    image(f[idFlux].doc(idDoc), posx, posy, f[idFlux].doc(idDoc).width, f[idFlux].doc(idDoc).height);
      
    /*fill(255);
    text("f:"+idFlux+" doc: "+idDoc, posx+(zoneW/2), posy+(zoneH-15));
    fill(0);*/
    // println("z"+id+" > idFlux:"+idFlux+" idDoc:"+idDoc+" posx:"+posx);
    
  }
  void drawHD(){
    println("drawHD-"+id);
    
    render.beginDraw();
    
    imgHD = loadImage(docSet+"/c-"+nf(idFlux, 2)+"/hd/"+f[idFlux].filename(idDoc));
    render.image(imgHD, posxHD, posyHD, imgHD.width , imgHD.height); 
    
    render.endDraw();
  }
  int idFlux(){
    return idFlux;
  }
  int idDoc(){
    return idDoc;
  }
}
void updatezindex(int zone){
  if(zindex[0] != zone){
    // println("z:"+zone);
    
    int[] tmpzindex = new int[nZone];
    tmpzindex[0] = zone;

    Boolean decalage = false;
    int key;
    
    for (int i = 0; i<nZone; i++){
      if (zindex[i] != zone){
        if(decalage){
          key = i;
        }else{
          key = i+1;
        }
        tmpzindex[key] = zindex[i];
      }else{
        decalage = true;
      }
    }
    arrayCopy(tmpzindex, zindex); 
  }
}
void printRender(){
  
  int notifx = 120;
  int notify = hSD/2;
  
  isprinting = true;
  
  copies++;
  
  fill(255);
  text("███", notifx, notify+3);
  
  fill(0);
  text(copies, notifx, notify+3); 
  
  PImage currentimg = get();
  
  render.beginDraw();
  render.image(currentimg, 0, 0, wHD , hHD); 
  render.endDraw();
  
  // for tests
  for (int i = 0; i<nZone; i++) {
    //println(nZone-i-1);
    z[zindex[nZone-i-1]].drawHD();
  }
  renderimg = render.get(0, 0, render.width, render.height);
  
  //image(renderimg,20,20,wSD/3,hSD/3);
  
  Date d = new Date();
  long current = d.getTime()/1000;
  
  isprinting = false;
  
  renderimg.save("outbox/"+copies+"-"+current+".jpeg");
  fill(0);
  text("███", notifx, notify+3);
  
  println(copies+"done !");

}

// TODO
/*
* 
* - inbox
*   > preprocess draw from doxie 
* 
* */