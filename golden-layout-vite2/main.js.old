
import {GoldenLayout}  from 'golden-layout'
import  "./css/goldenlayout-base.css";
import  "./css/themes/goldenlayout-dark-theme.css";


var config = {
  content: [{
      type: 'row',
      content: [
            {
	           type:'component',
	           componentName: 'example',
	           componentState: { text: 'Component 1' }
	          },
            {
	           type:'component',
	           componentName: 'example',
	           componentState: { text: 'Component 2' }
	          },
            {
	           type:'component',
	           componentName: 'gusa',
	           componentState: { text: 'Component 3' }
	          }
          ]
    }]
};

        const layoutElement = document.querySelector('#layoutContainer') ;
        //var myLayout = new GoldenLayout( config );
        var myLayout = new GoldenLayout( config, layoutElement  );


myLayout.registerComponent( 'example', function( container, state ){
	  container.getElement().innerHTML = '<h2>' + state.text + '</h2>';
});

myLayout.registerComponent( 'gusa', function( container, state ){
	  container.getElement().innerHTML = '<h2>' + "gusa" + '</h2>';
});
myLayout.init();

