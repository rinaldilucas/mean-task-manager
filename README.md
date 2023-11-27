<div id="top"></div>

[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![MIT License][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url]

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/rinaldilucas/mean-task-manager">
    <img src="./frontend/assets/images/_readme/logo.png" alt="Logo">
  </a>

  <h3 align="center">MEAN Stack Task Manager</h3>

  <p align="center">
    Project built using Angular, NodeJS, Express.j and MongoDB<br> with Angular Material to jump start your studies!
    <br />
    <a href="https://github.com/rinaldilucas/mean-task-manager"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://rinaldilucas.github.io/mean-task-manager/">View App*</a>
    ·
    <a href="https://mean-task-manager.onrender.com/api-docs">API Docs*</a>
    ·
    <a href="#donations">Donate</a>       
  </p>
  <small>
    * hosted on render.com free tier, so API need a little time to start after accessing
  </small>
  <br>
  <br>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#backend">Backend</a></li>
        <li><a href="#frontend">Frontend</a></li>
        <li><a href="#built-with">Built With</a></li>
        <li><a href="#hosting">Hosting</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#donations">Donations</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## About The Project

<div align="center">

[![Project Screenshot][project-screenshot]](https://rinaldilucas.github.io/mean-task-manager)

</div>

I built this project to make a cool template for those who wants to learn the MEAN stack. If this repository helped you, don't hesitate to leave a star!

Here are some of the features:

### Backend

- Node.js API written with TypeScript
- Search, ordering and pagination integrate with frontend to shorten response sizes
- JWT implementation with refresh token using Redis and cookies on strict mode
- Blacklist of access/refresh token
- Password encryption using bcrypt with salt rounds
- Authentication with brute force prevention using ExpressBrute
- Error handling to maintain error readability
- Backend (API) validation on controllers and routes using express-validator, which improves error readability using third-party software such as Insomnia and Postman
- Database and model validation using mongoose
- API documentation using Swagger
- ESlint rules focused on backend
- Multiple scripts to facilitate development, builds and deployment
- Scripts to format, lint, debug, develop, build and deploy
- And more

### Frontend

- Multilingual features implemented in both the client-side and API responses
- Examples of autocomplete, mat-chips, calendar, dialogs, bottomsheet and more
- Routed bottom sheet example implemented using only one component
- Virtual scrolling with pagination, ordering and search integrated with api to shorten response sizes
- Charts using chart.js library
- Angular routing animations using dynamic params
- Authentication and role guard
- Deactivate guard to prevent the user of discarding changes
- Multiple examples of synchronous custom validators
- Multiple handlers to ease the use of dialogs, bottomsheets, snackbars and more
- Custom async validator to check already registered user
- Registering using password techniques
- Example using functional resolvers with loading on routes
- Interceptor modules added to verify bearer token, errors, and headers language
- Front-end validation on requests and inputs
- Handler of promises and errors using destructuring
- Improved http security using HttpParams
- Unsubscriber component with subsink to facilitate the maneuvering of unsubscribes
- CRUD operations built using POO paradigms, allowing services to inherit its operations
- Example of custom pipes to convert date to selected language
- Example of custom directive to prevent form autofill
- Dark mode using browser cookies
- SCSS algorithm which uses rem unit to maintain aspect ratio
- Stylesheets written using BEM methodology
- Custom SCSS structure to improve reusability
- Material components are overwritten to support rem unit and improve mobile/table compatibility coding less
- Improved readability on media queries using include-media library
- ESlint rules focused on frontend, like keyboard accessibility, ARIA, focus and accessible HTML
- Input validators with multilingual features added
- Implementation of sass-lint which guarantees the order of css properties, maintaining the writing pattern and avoiding unnecessary code revisions
- Prettier rules implemented to improve code readability
- Multiple scripts to facilitate development, builds and deployment
- Custom folder structure organized by responsibility
- Scripts to format, lint, debug, develop, build and deploy
- And more

<p align="right">(<a href="#top">back to top</a>)</p>

### Built With

This section shows what technologies are used in this particular project.

- [Angular](https://angular.io/)
- [NodeJS](https://nodejs.org/en/)
- [MongoDB](https://www.mongodb.com/)
- [Express.js](https://expressjs.com/)
- [Angular Material](https://material.angular.io/)
- [Redis](https://redis.io/)
- [Swagger](https://swagger.io/)
- [Chart.js](https://www.chartjs.org/)
- [Yarn](https://www.yarnpkg.com/)

<p align="right">(<a href="#top">back to top</a>)</p>

### Hosting

This section shows what technologies are used in this particular project.

- <strong>MongoDB</strong> hosted on <a href="https://www.mongodb.com/pricing">MongoDB</a> shared cluster
- <strong>Redis</strong> hosted on <a href="https://render.com/pricing">Redis</a> free tier
- <strong>NodeJS</strong> hosted on <a href="https://render.com/pricing">NodeJS</a> free tier
- <strong>Angular</strong> hosted on <a href="https://pages.github.com/">Github Pages</a>

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- GETTING STARTED -->

## Getting Started

After cloning the project, you need to do a few things to be able to run it.

### Prerequisites

You need to have the following requirements:

- mongodb <a target="_blank" href="https://www.mongodb.com/try/download/community/">(download here)</a>
- node 16.20.1 <a target="_blank" href="https://nodejs.org/en/download/">(download here)</a>
- redis <a target="_blank" href="https://redis.io/download/">(download here for Linux)</a> or <a target="_blank" href="https://github.com/tporadowski/redis/releases">(download here for windows)</a>
- yarn

  ```sh
  npm install -g yarn
  ```

- angular cli 14

  ```sh
  npm install -g @angular/cli@14
  ```

### Installation

_Below is an example of how you can run the project._<br>
_More scripts at package.json_

1. Clone the repo
   ```sh
   git clone https://github.com/rinaldilucas/mean-task-manager.git
   ```
2. Install NPM packages via yarn
   ```sh
   yarn install
   ```
3. If running for the first time, run the following command to answer angular cli questions
   ```js
   ng serve
   ```
4. Run angular, express and mongoDB as development mode
   ```js
   yarn dev
   ```
5. Deploy to github pages
   ```js
   yarn deploy
   ```
   If needed, you can debug express using `yarn api-debug`. <br>More builds scripts at `./package.json`. <br>

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- USAGE EXAMPLES -->

## Usage

You can import the Insomnia routes via file `./backend/db/routes-collection.json` and import the mongodb collections via file `./backend/db/routes-collection`. <br>Below are the implemented routes: you also can view them inside `./backend/routes` folder or through the Swagger documentation at `http://localhost:3000/api-docs/`.

```js
-------------------------------
-------- [USER ROUTES] --------
-------------------------------
[GET] localhost:3000/api/users -> 'getAll'
[GET] localhost:3000/api/users/{id} -> 'getOne'
[POST] localhost:3000/api/users -> 'create'
[PUT] localhost:3000/api/users/{id} -> 'update'
[DELETE] localhost:3000/api/users/{id}-> 'remove'
[POST] localhost:3000/api/users/authenticate -> 'authenticate'
[GET] localhost:3000/api/user/exists/{email}/ -> 'checkIfEmailExists'
[PUT] localhost:3000/api/users/changePassword/{id} -> 'changePassword'
[POST] localhost:3000/api/users/refreshToken -> 'refreshToken'
[POST] localhost:3000/api/users/logout -> 'logout'

-------------------------------
-------- [TASK ROUTES] --------
-------------------------------
[GET] localhost:3000/api/tasks?pageSize&searchTerm&pageIndex&sortFilter&sortDirection&startDate&finalDate -> 'getAll'
[GET] localhost:3000/api/tasks/{id} -> 'getOne'
[POST] localhost:3000/api/tasks -> 'create'
[PUT] localhost:3000/api/tasks/{id} -> 'update'
[DELETE] localhost:3000/api/tasks/{id}-> 'remove'

-------------------------------
------ [CATEGORY ROUTES] ------
-------------------------------
[GET] localhost:3000/api/categories?onlyMine -> 'getAll'
[POST] localhost:3000/api/categories -> 'create'
[DELETE] localhost:3000/api/categories/{id} -> 'remove'
```

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- CONTRIBUTING -->

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/amazing-feature`)
3. Commit your Changes (`git commit -m 'feat: add some amazing feature'`)
4. Push to the Branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- LICENSE -->

## License

Distributed under the MIT License. See [LICENSE](./LICENSE) for more information.

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- CONTACT -->

## Contact

[![Website](https://img.shields.io/badge/-Website-0078D4?style=flat-square&logo=html5&logoColor=white&link=https://lucasreinaldi.com.br)](https://rinaldilucas.com)
[![Github](https://img.shields.io/badge/-Github-967bb5?style=flat-square&labelColor=967bb5&logo=github&logoColor=white&link=https://github.com/rinaldilucas)](https://github.com/rinaldilucas)
[![Gmail Badge](https://img.shields.io/badge/-Gmail-c14438?style=flat-square&logo=Gmail&logoColor=white&link=mailto:lucasreinaldi@gmail.com)](mailto:lucasreinaldi@gmail.com)
[![Hotmail Badge](https://img.shields.io/badge/-Hotmail-0078D4?style=flat-square&logo=microsoft-outlook&logoColor=white&link=mailto:lucasreinaldi@hotmail.com)](mailto:lucasreinaldi@hotmail.com)
[![Linkedin Badge](https://img.shields.io/badge/-LinkedIn-blue?style=flat-square&logo=Linkedin&logoColor=white&link=https://www.linkedin.com/in/rinaldilucas/)](https://www.linkedin.com/in/rinaldilucas/)
[![Telegram Badge](https://img.shields.io/badge/-Telegram-1ca0f1?style=flat-square&labelColor=1ca0f1&logo=telegram&logoColor=white&link=https://t.me/rinaldilucas)](https://t.me/rinaldilucas)

Project Link: [https://github.com/rinaldilucas/mean-task-manager](https://github.com/rinaldilucas/mean-task-manager)

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- ACKNOWLEDGMENTS -->

## Donations

If you feel that this project has helped you in any way, whether it's attracting clients or teaching you about the technologies used, feel free to make a donation.
It helps me a lot to continue developing open source codes.

- Metamask (USDT):
  ```sh
  0xA0410641515F06fF6a9AdAFf1c3e90a3905ba271
  ```
- PIX (BRL):
  ```sh
  72140bc8-fadc-42f5-abb6-9c13cc80a59f
  ```

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[contributors-shield]: https://img.shields.io/github/contributors/rinaldilucas/mean-task-manager.svg?style=for-the-badge
[contributors-url]: https://github.com/rinaldilucas/mean-task-manager/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/rinaldilucas/mean-task-manager.svg?style=for-the-badge
[forks-url]: https://github.com/rinaldilucas/mean-task-manager/network/members
[stars-shield]: https://img.shields.io/github/stars/rinaldilucas/mean-task-manager.svg?style=for-the-badge
[stars-url]: https://github.com/rinaldilucas/mean-task-manager/stargazers
[license-shield]: https://img.shields.io/github/license/rinaldilucas/mean-task-manager.svg?style=for-the-badge
[license-url]: https://github.com/rinaldilucas/mean-task-manager/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://www.linkedin.com/in/rinaldilucas/
[project-screenshot]: ./frontend/assets/images/_readme/screenshot.gif
