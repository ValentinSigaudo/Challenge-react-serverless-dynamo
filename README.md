# Challenge-react-serverless-dynamo

Aplicacion de usuarios, donde los usuarios podran guardar editar y eliminar contactos

## Que se puede hacer con la aplicacion?

-La aplicacion cuenta con registro de usuarios, el cual se hace con Email y contraseña
-Luego de registrarte te envia un codigo a tu correo para verificar la cuente
-Una vez registrado y verificado, puedes ir a iniciar sesion
-luego de iniciar sesion, puedes ver tu lista de contactos, cargar nuevos, editar los existentes y eliminarlos

## Tecnologias usadas en el Frontend:

- React
- Validacion de formularios con react-hook-form
- Autenticacion, registro y confirmacion de usuarios hecha con cognito

## Dependencias utilizadas en el Frontend:

- aws-sdk/client-cognito-identity-provider (para manejo de sesion y registro de usuario)
- tailwind-css (para manejo de estilos)
- js-cookie (para guardar los datos de sesion en las cookies)
- jwt-decode (para obtener los datos del usuario logeado)
- react-hook-form (para manejo de validaciones de formularios)
- react-router-dom (para manejo de rutas)

## Cómo iniciar el proyecto:

- Antes que nada es necesario tener el archivo .env donde tendremos que cargar los datos sensibles :

  - VITE_API_BASE_URL
  - VITE_COGNITO_CLIENT_ID
  - VITE_COGNITO_USER_POOL_ID

- En la consola moverse a la carpeta FRONTEND
- Correr los comandos:
  - npm install (para instalar las dependencias)
  - npm run dev (iniciar el proyecto de manera local)
  - se deberia desplegar la aplicacion local en el puerto: http://localhost:5173

## Tecnologias usadas en el Backend:

-Serverless Framewor que permite definir y desplegar infraestructura y configuracion como código.
-AWS Lambda, Funciones que ejecutan la lógica de negocio en respuesta a eventos HTTP.
-API Gateway (HTTP API) genera los endpoints HTTP públicos para interactuar con las funciones Lambda.
-Amazon DynamoDB Base de datos NoSQL para almacenar las tablas de contactos.
-Amazon S3, almacena un archivo zip donde esta empaquetado el codigo y configuraciones

## Dependencias utilizadas en el Backend:

-aws-sdk/client-dynamodb (para interactuar con Amazon DynamoDB.)
-aws-sdk/client-s3 (para trabajar con Amazon S3)
-aws-sdk/util-dynamodb (ayuda a convertir entre los formatos de objetos de JavaScript y los de DynamoDB)
-uuid (para generar ids unicos en las tablas de contactos)

## Cómo desplegar el Backend?

- Antes que nada es necesario tener el archivo .env donde tendremos que cargar los datos sensibles :

  - USER_TABLE_ARN
  - CONTACT_TABLE_ARN
  - CONTACT_INDEX_ARN

- En la consola moverse a la carpeta BACKEND
- Correr los comandos:
  - npm install (para instalar las dependencias)
  - sls deploy para desplegar la configuracion actual del proyecto
  - Ahi se generan o actualizan los endpoints con los metodos para que se consuma la api
