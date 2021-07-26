# reactstrap-ts-frontend

## The very start

The first packages I installed (with TypeScript the types have to be installed too):

```console
npx create-react-app bootstrap-typescript --template typescript
npm install --save reactstrap react react-dom
npm install --save-dev @types/reactstrap
npm install @types/react
```

## Production

In VSCode TERMINAL:

```console
npm run build
```

## Deployments

### Netlify

https://app.netlify.com with .env variables

### AWS EC2

In the cloud server with port 5000 enabled:

```console
sudo su
apt update
apt install -y nodejs
apt install -y npm
npm install -g serve
exit
mkdir react
```

In the local terminal:

```console
scp -r -i "api-ivanne-service-key-pair.pem" /home/ivanne/Projects/learling/fullstack-boilerplate/frontend-boilerplate/build/ ubuntu@ec2-34-243-118-40.eu-west-1.compute.amazonaws.com:/home/ubuntu/react/
```

Back in the new React server:

```console
serve -s build
```

**-> Fail:** Get pretty 404 page when opening the public ip with port 5000.

I also tried to downgrade but it didn't help:

```console
npm uninstall -g serve
npm install -g serve@10.1.1
serve -s build
```

### AWS Amplify

GitHub build and custom domain with SSL - could work...

**Note:** For the backend-server I was in the region Ireland. For this app environment I switched the region (to Frankfurt) because I coudn't change the GitHub default settings elseways (changing the organization afterwards was not possible).

Build settings:

```console
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm install
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: build
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
```

Advanced settings:

Environment variables
