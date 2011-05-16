<html>
  <head>
    <title>BeeperBooper</title>
  </head>
  <body>
    {{#audioNodes}}
      <div><audio controls="true" src="{{audioDataURI}}" /></div>
    {{/audioNodes}}
  </body>
</html>
