// phantom JS

var page = new WebPage(),
    address, output, size;
 
  address = "http://dev.d48/poster/";
  width = 2970; height = 3160; // 4200
  output = "assets/step.png";
 
 
  page.viewportSize = { width: width, height: height };

  page.open(address, function (status) {
      if (status !== 'success') {
          console.log('Unable to load the address!');
      } else {
          window.setTimeout(function () {
              page.render(output);
              phantom.exit();
          }, 900);
      }
  });